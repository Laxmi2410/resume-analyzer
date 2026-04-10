from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

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
    text_lower = text.lower()
    words = set(text_lower.split())

    extracted = {
        "languages": set(),
        "frameworks": set(),
        "tools": set(),
        "data_ai": set(),
        "soft_skills": set()
    }

    # Single word matching
    for category, skills in SKILLS_DB.items():
        for skill in skills:
            if " " not in skill and skill in words:
                extracted[category].add(skill)

    # Multi-word matching
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
        similarity = 0.0  # Handle empty text
    
    # Extract categorized skills
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
        
        # Radar chart percentage
        if len(j_set) > 0:
            pct = int((len(matching) / len(j_set)) * 100)
        else:
            pct = 100 if len(r_set) > 0 else 0
            
        radar_data.append({
            "subject": category.replace('_', ' ').title(),
            "A": pct,
            "fullMark": 100
        })
    
    # Requirement score
    req_score = int((total_matched_skills / total_jd_skills * 100)) if total_jd_skills > 0 else 0
    
    # Final blended score
    final_score = int(similarity * 40) + int(req_score * 0.6)
    
    return {
        "match_score": min(final_score, 100),
        "semantic_similarity": round(similarity * 100, 1),
        "requirement_score": req_score,
        "radar_data": radar_data,
        "matches": categorized_matches,
        "missing": categorized_gaps,
        "resume_full_skills": {k: list(v) for k, v in resume_skills.items()}
    }