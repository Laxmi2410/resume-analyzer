from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, AnalysisHistory
from utils import extract_text_from_pdf, extract_text_from_docx
from nlp_processor import analyze_resume_vs_jd
import io
import json
import os

app = Flask(__name__)
# Database config
base_dir = os.path.abspath(os.path.dirname(__name__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(base_dir, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app) 
db.init_app(app)

# Create tables if not exist
with app.app_context():
    db.create_all()

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # 1. Validate incoming request (using 'resumes' plural now for multi-file)
    if 'resumes' not in request.files:
        return jsonify({"error": "No resume files provided. Use form-data key 'resumes'."}), 400
    
    if 'job_description' not in request.form:
        return jsonify({"error": "No job description provided"}), 400
        
    resume_files = request.files.getlist('resumes')
    jd_text = request.form['job_description']
    
    if not resume_files or resume_files[0].filename == '':
        return jsonify({"error": "No files selected"}), 400
        
    results_list = []
        
    for resume_file in resume_files:
        try:
            filename = resume_file.filename.lower()
            resume_text = ""
            
            file_stream = io.BytesIO(resume_file.read())
            
            if filename.endswith('.pdf'):
                resume_text = extract_text_from_pdf(file_stream)
            elif filename.endswith('.docx'):
                resume_text = extract_text_from_docx(file_stream)
            else:
                continue # Skip unsupported
                
            if not resume_text.strip():
                continue
                
            # 3. Analyze text through NLP Processor
            analysis_result = analyze_resume_vs_jd(resume_text, jd_text)
            
            # Simple candidate name extraction (just use filename without extension for now)
            candidate_name = resume_file.filename.rsplit('.', 1)[0].replace('_', ' ').title()
            
            analysis_result["candidate_name"] = candidate_name
            analysis_result["filename"] = resume_file.filename
            
            # 4. Save to Database
            history_record = AnalysisHistory(
                candidate_name=candidate_name,
                job_description=jd_text,
                match_score=analysis_result["match_score"],
                semantic_score=analysis_result["semantic_similarity"],
                requirement_score=analysis_result["requirement_score"],
                matches_json=json.dumps(analysis_result["matches"]),
                missing_json=json.dumps(analysis_result["missing"]),
                radar_data_json=json.dumps(analysis_result["radar_data"])
            )
            db.session.add(history_record)
            
            results_list.append(analysis_result)
            
        except Exception as e:
            print(f"Error processing {resume_file.filename}: {e}")
            
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database commit error: {str(e)}"}), 500
        
    # Sort results by match_score descending
    results_list = sorted(results_list, key=lambda x: x["match_score"], reverse=True)
    
    return jsonify(results_list), 200

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        # Fetch last 50 analyses
        records = AnalysisHistory.query.order_by(AnalysisHistory.created_at.desc()).limit(50).all()
        return jsonify([record.to_dict() for record in records]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
