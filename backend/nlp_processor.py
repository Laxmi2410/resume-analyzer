import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Categorized Skill Database
SKILLS_DB = {
    "languages": {"python", "java", "javascript", "c++", "sql", "html", "css", "typescript", "ruby", "go"},
    "frameworks": {"react", "node.js", "flask", "django", "spring boot", "angular", "vue", "express", "next.js"},
    "tools": {"aws", "docker", "kubernetes", "git", "linux", "azure", "gcp", "ci/cd", "jenkins", "terraform"},
    "data_ai": {"machine learning", "nlp", "scikit-learn", "spacy", "pandas", "numpy", "tensorflow", "pytorch", "postgresql", "mongodb", "mysql", "nosql"},
    "soft_skills": {"communication", "leadership", "agile", "scrum", "teamwork", "problem solving", "management", "mentoring"}
}

def clean_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text.lower()

def extract_skills_categorized(text):
    doc = nlp(text.lower())
    text_lower = text.lower()
    
    extracted = {
        "languages": set(),
        "frameworks": set(),
        "tools": set(),
        "data_ai": set(),
        "soft_skills": set()
    }
    
    # Check tokens
    for token in doc:
        for category, skills in SKILLS_DB.items():
            if token.text in skills:
                extracted[category].add(token.text)
                
    # Check multi-word skills
    for category, skills in SKILLS_DB.items():
        for skill in skills:
            if " " in skill and skill in text_lower:
                extracted[category].add(skill)
                
    return extracted

def analyze_resume_vs_jd(resume_text, jd_text):
    clean_resume = clean_text(resume_text)
    clean_jd = clean_text(jd_text)
    
    # TF-IDF Score
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        vectors = vectorizer.fit_transform([clean_jd, clean_resume])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    except ValueError:
        similarity = 0.0 # Handle empty text edge cases
    
    # Extract categorized
    resume_skills = extract_skills_categorized(resume_text)
    jd_skills = extract_skills_categorized(jd_text)
    
    categorized_gaps = {}
    categorized_matches = {}
    radar_data = []
    
    total_jd_skills = 0
    total_matched_skills = 0
    
    for category in SKILLS_DB.keys():
        r_set = resume_skills[category]
        j_set = jd_skills[category]
        
        missing = list(j_set - r_set)
        matching = list(j_set.intersection(r_set))
        
        categorized_gaps[category] = missing
        categorized_matches[category] = matching
        
        total_jd_skills += len(j_set)
        total_matched_skills += len(matching)
        
        # Calculate percentage for radar chart
        if len(j_set) > 0:
            pct = int((len(matching) / len(j_set)) * 100)
        else:
            pct = 100 if len(r_set) > 0 else 0 # 100% if they have bonus skills but none required
            
        radar_data.append({
            "subject": category.replace('_', ' ').title(),
            "A": pct,
            "fullMark": 100
        })
        
    # Calculate a custom robust requirements score
    req_score = int((total_matched_skills / total_jd_skills * 100)) if total_jd_skills > 0 else 0
    
    # Blended score: 40% TF-IDF semantic + 60% hard skill matching
    final_score = int(similarity * 40) + int((req_score * 0.6))
    
    return {
        "match_score": min(final_score, 100),
        "semantic_similarity": round(similarity * 100, 1),
        "requirement_score": req_score,
        "radar_data": radar_data,
        "matches": categorized_matches,
        "missing": categorized_gaps,
        "resume_full_skills": {k: list(v) for k, v in resume_skills.items()}
    }
