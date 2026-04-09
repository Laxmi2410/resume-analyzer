import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Star, Users } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsList = location.state?.results || [];
  
  const [activeIndex, setActiveIndex] = useState(0);

  if (!resultsList || resultsList.length === 0) {
    return (
      <div className="flex-center" style={{ flexDirection: 'column', minHeight: '40vh' }}>
        <h2 style={{ marginBottom: '1rem' }}>No active analysis</h2>
        <p className="text-muted mb-4">Please submit documents and a job description first.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/upload')}>Return to Upload</button>
      </div>
    );
  }

  const activeResult = resultsList[activeIndex];
  const { match_score, semantic_similarity, requirement_score, radar_data, matches = {}, missing = {}, resume_full_skills = {} } = activeResult;

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const renderCategorizedSkills = (skillDict, status) => {
    return Object.entries(skillDict).map(([category, skills]) => {
      if (!skills || skills.length === 0) return null;
      return (
        <div key={category} style={{ marginBottom: '1.25rem' }}>
          <strong style={{ textTransform: 'capitalize', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            {category.replace('_', ' ')}
          </strong>
          <div className="skill-list-container" style={{ marginTop: 0, flexDirection: 'row', flexWrap: 'wrap', gap: '0.4rem' }}>
            {skills.map((skill) => (
              <div 
                key={skill} 
                className={`skill-item ${status === 'bonus' ? '' : status}`} 
                style={status === 'bonus' ? { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af', padding: '0.4rem 0.8rem' } : { padding: '0.4rem 0.8rem' }}
              >
                {status === 'success' ? <CheckCircle2 size={14} /> : status === 'error' ? <XCircle size={14} /> : <Star size={14} />}
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const hasSkills = (skillDict) => {
    return Object.values(skillDict).some((arr) => arr && arr.length > 0);
  };

  const additional_skills = {};
  if (resume_full_skills) {
      Object.keys(resume_full_skills).forEach(category => {
        additional_skills[category] = resume_full_skills[category].filter(
          skill => !(matches[category] || []).includes(skill)
        );
      });
  }

  return (
    <div className="results-dashboard">
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn-ghost" onClick={() => navigate('/upload')}>
          <ArrowLeft size={16} className="mr-2" /> Back to Upload
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '2rem' }}>
        
        {/* Left Panel: Leaderboard */}
        <div className="card" style={{ padding: '1.5rem', alignSelf: 'start', position: 'sticky', top: '6rem' }}>
           <h3 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
             <Users size={18} className="mr-2"/> Candidate Leaderboard
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {resultsList.map((res, i) => (
               <div 
                  key={i} 
                  onClick={() => setActiveIndex(i)}
                  style={{ 
                    padding: '0.8rem', border: '1px solid', borderRadius: '8px', cursor: 'pointer',
                    background: activeIndex === i ? '#eff6ff' : 'var(--surface)',
                    borderColor: activeIndex === i ? 'var(--brand)' : 'var(--border-light)',
                    transition: 'all 0.15s'
                  }}
               >
                 <div className="flex-between">
                   <div style={{ fontWeight: 600, fontSize: '0.9rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                     {res.candidate_name || res.filename}
                   </div>
                   <span className="badge" style={{ background: i === 0 ? '#fef3c7' : 'var(--bg-app)', color: i === 0 ? '#b45309' : 'var(--text-main)', border: '1px solid var(--border-light)' }}>
                     {res.match_score}%
                   </span>
                 </div>
                 {i === 0 && <div className="text-sm mt-2" style={{ color: '#d97706', fontWeight: 600 }}>Top Recommendation</div>}
               </div>
             ))}
           </div>
        </div>

        {/* Right Panel: Selected Candidate Detail */}
        <div>
          <div className="dashboard-header mb-4">
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{activeResult.candidate_name || activeResult.filename}</h1>
            <p className="text-muted mt-1">Detailed breakdown of candidate qualifications against requirements.</p>
          </div>

          <div className="card score-summary-card mb-4" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 1.5fr', gap: '2rem', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Overall Alignment</h3>
                <div className="score-container" style={{ marginTop: '0.5rem' }}>
                  <span className="score-value" style={{ color: getScoreColor(match_score), fontSize: '3rem' }}>{match_score}%</span>
                </div>
                <div className="progress-track" style={{ marginBottom: '1.5rem', height: '8px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(match_score, 100)}%`, backgroundColor: getScoreColor(match_score) }}
                  ></div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', background: 'var(--bg-app)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{requirement_score}%</div>
                    <div className="text-sm text-muted">Requirements Met</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{semantic_similarity}%</div>
                    <div className="text-sm text-muted">Semantic Context</div>
                  </div>
                </div>
              </div>
              
              <div style={{ height: '300px', width: '100%', borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
                {radar_data && radar_data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radar_data}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar name="Coverage" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                      <Tooltip wrapperStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex-center w-full" style={{ height: '100%' }}>No radar data available.</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#065f46', fontSize: '1.05rem', margin: 0 }}>Requirements Met ✔️</h3>
              </div>
              <div>
                {hasSkills(matches) ? renderCategorizedSkills(matches, 'success') : (
                  <p className="text-muted text-sm">No exact requirement matches detected.</p>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#991b1b', fontSize: '1.05rem', margin: 0 }}>Skill Gaps ❌</h3>
              </div>
              <div>
                {hasSkills(missing) ? renderCategorizedSkills(missing, 'error') : (
                  <p className="text-muted text-sm">Excellent. Candidate meets all mapped requirements.</p>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#3730a3', fontSize: '1.05rem', margin: 0 }}>Bonus Skills 🌟</h3>
              </div>
              <div>
                {hasSkills(additional_skills) ? renderCategorizedSkills(additional_skills, 'bonus') : (
                  <p className="text-muted text-sm">No extra standalone keywords detected.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Results;
