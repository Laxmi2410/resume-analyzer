import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UploadCloud, Cpu, LineChart, Target, Layers, Zap, CheckCircle2, XCircle } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Background decoration */}
      <div className="hero-bg-accent"></div>

      <div className="hero-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-content">
          <div className="badge-pill mb-4" style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', background: '#eff6ff', color: '#1e40af', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #bfdbfe' }}>
            Resume parsing powered by NLP
          </div>
          <h1 className="hero-title">
            Hire smarter. <br/>
            <span className="text-muted">Analyze faster.</span>
          </h1>
          <p className="hero-subtitle">
            Instantly evaluate candidate resumes against your job requisitions using machine learning. Identify skill gaps automatically before the first interview.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/upload')}>
              👉 Analyze Resume <ArrowRight size={18} className="mr-2" style={{ marginLeft: '8px' }} />
            </button>
          </div>
          
          <div className="trust-section mt-6">
            <p className="text-muted text-sm font-medium">Built for recruiters & engineering managers to automate shortlisting.</p>
          </div>
        </div>
        
        <div className="hero-illustration">
          <div className="mock-dashboard card">
             <div className="flex-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div>
                   <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Sarah Jenkins</h4>
                   <p className="text-muted text-sm" style={{ margin: 0, marginTop: '2px' }}>Senior Frontend Engineer</p>
                </div>
                <div className="flex-center" style={{ flexDirection: 'column' }}>
                   <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', lineHeight: 1 }}>78%</span>
                   <span className="text-muted" style={{ fontSize: '0.7rem' }}>Match</span>
                </div>
             </div>
             
             <div className="mb-4">
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Verified Skills</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                   <span className="skill-badge success"><CheckCircle2 size={12} className="mr-1"/> React</span>
                   <span className="skill-badge success"><CheckCircle2 size={12} className="mr-1"/> TypeScript</span>
                   <span className="skill-badge success"><CheckCircle2 size={12} className="mr-1"/> Node.js</span>
                </div>
             </div>
             
             <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Missing Requirements</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                   <span className="skill-badge error"><XCircle size={12} className="mr-1"/> AWS</span>
                   <span className="skill-badge error"><XCircle size={12} className="mr-1"/> Docker</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="section-spacing text-center">
         <h2 className="section-title">How It Works</h2>
         <p className="section-subtitle text-muted">A seamless pipeline from document upload to actionable insights.</p>
         
         <div className="steps-grid mt-6">
            <div className="step-card">
               <div className="icon-wrapper"><UploadCloud size={24} /></div>
               <h3>1. Upload Resumes</h3>
               <p className="text-muted text-sm mt-2">Drag and drop batches of candidate files along with your job description.</p>
            </div>
            <div className="step-card">
               <div className="icon-wrapper"><Cpu size={24} /></div>
               <h3>2. Analyze with AI</h3>
               <p className="text-muted text-sm mt-2">Our NLP processor instantly extracts entities, languages, and semantic contexts.</p>
            </div>
            <div className="step-card">
               <div className="icon-wrapper"><LineChart size={24} /></div>
               <h3>3. Get Insights</h3>
               <p className="text-muted text-sm mt-2">Review the generated leaderboard, radar charts, and specific skill gap analyses.</p>
            </div>
         </div>
      </div>

      {/* Features Section */}
      <div className="section-spacing">
        <div className="text-center mb-6">
           <h2 className="section-title">Enterprise-Grade Analysis</h2>
        </div>
        
        <div className="features-grid">
           <div className="card feature-card">
              <Target size={28} style={{ color: 'var(--brand)', marginBottom: '1rem' }} />
              <h3>Skill Gap Detection</h3>
              <p className="text-muted mt-4 text-sm">Stop guessing. Visually identify exactly which mandatory requirements a candidate lacks before bringing them to an on-site interview.</p>
           </div>
           
           <div className="card feature-card">
              <Layers size={28} style={{ color: '#10b981', marginBottom: '1rem' }} />
              <h3>Resume Ranking</h3>
              <p className="text-muted mt-4 text-sm">Upload 50 resumes at once. We calculate a contextually-aware Total Match Score and rank them sequentially.</p>
           </div>
           
           <div className="card feature-card">
              <Zap size={28} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
              <h3>Instant Match Score</h3>
              <p className="text-muted mt-4 text-sm">We securely merge exact keyword compliance with TF-IDF semantic checking, ensuring both hard skills and contextual experience are rewarded.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
