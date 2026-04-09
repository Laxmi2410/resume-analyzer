import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

function ResultsDashboard({ results }) {
  const { match_score, semantic_similarity, requirement_score, radar_data, matches, missing, resume_full_skills } = results;

  const getScoreClass = (score) => {
    if (score >= 70) return '';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const renderCategorizedSkills = (skillDict, isMatch) => {
    return Object.entries(skillDict).map(([category, skills]) => {
      if (!skills || skills.length === 0) return null;
      return (
        <div key={category} style={{ marginBottom: '1rem' }}>
          <strong style={{ textTransform: 'capitalize', color: '#4b5563', display: 'block', marginBottom: '0.25rem' }}>
            {category.replace('_', ' ')}
          </strong>
          <div className="skills-list">
            {skills.map((skill) => (
              <span key={skill} className={`skill-tag ${isMatch ? 'matching' : 'missing'}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const hasSkills = (skillDict) => {
    return Object.values(skillDict).some((arr) => arr && arr.length > 0);
  };

  // Find bonus skills (in resume but not in JD)
  const additional_skills = {};
  Object.keys(resume_full_skills).forEach(category => {
    additional_skills[category] = resume_full_skills[category].filter(
      skill => !matches[category].includes(skill)
    );
  });

  return (
    <div className="fade-in">
      <h2 style={{ marginTop: 0, marginBottom: '2rem', textAlign: 'center', fontSize: '2.2rem', color: '#1f2937' }}>
        Intelligence Report
      </h2>
      
      <div className="results-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="score-card glass">
            <h3 style={{ marginTop: 0, color: '#374151', fontSize: '1.4rem' }}>Blended Match Score</h3>
            <div className={`score-circle ${getScoreClass(match_score)} pulse`}>
              {match_score}%
            </div>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Base Requirement Focus: <strong>{requirement_score}%</strong><br/>
              Semantic Relevance: <strong>{semantic_similarity}%</strong>
            </p>
          </div>

          <div className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#374151', marginBottom: '1rem' }}>Skill Profiling</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Coverage" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(240, 253, 244, 0.5)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#065f46', borderBottom: '2px solid #a7f3d0', paddingBottom: '0.75rem' }}>
              Required Skills Met ✔️
            </h3>
            {hasSkills(matches) ? renderCategorizedSkills(matches, true) : (
              <p style={{ color: '#6b7280' }}>No direct technical skill matches found.</p>
            )}
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(254, 242, 242, 0.5)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#991b1b', borderBottom: '2px solid #fecaca', paddingBottom: '0.75rem' }}>
              Skill Gaps ❌
            </h3>
            {hasSkills(missing) ? renderCategorizedSkills(missing, false) : (
              <p style={{ color: '#6b7280' }}>Excellent! You meet all tracked key requirements.</p>
            )}
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(238, 242, 255, 0.5)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#3730a3', borderBottom: '2px solid #c7d2fe', paddingBottom: '0.75rem' }}>
              Bonus Candidate Skills 🌟
            </h3>
            {hasSkills(additional_skills) ? renderCategorizedSkills(additional_skills, true) : (
              <p style={{ color: '#6b7280' }}>No extra standalone keywords detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsDashboard;
