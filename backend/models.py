from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class AnalysisHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_name = db.Column(db.String(100), nullable=False)
    job_description = db.Column(db.Text, nullable=False)
    match_score = db.Column(db.Integer, nullable=False)
    semantic_score = db.Column(db.Float, nullable=False)
    requirement_score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    matches_json = db.Column(db.Text, nullable=True)
    missing_json = db.Column(db.Text, nullable=True)
    radar_data_json = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "candidate_name": self.candidate_name,
            "match_score": self.match_score,
            "semantic_score": self.semantic_score,
            "requirement_score": self.requirement_score,
            "created_at": self.created_at.isoformat()
        }
