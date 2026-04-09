import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2, X } from 'lucide-react';
import axios from 'axios';

function Upload() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0 || !jd.trim()) {
        setError('Please provide at least one resume file and a job description.');
        return;
    }
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('resumes', file);
    });
    formData.append('job_description', jd);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/results', { state: { results: response.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred connecting to the server.');
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      <div>
        <div className="card">
          <div className="card-header">
            <h2>Batch Analysis</h2>
            <p className="subtitle text-muted">Upload multi-candidate documents for bulk parsing against your requisition.</p>
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">1. Candidate Resumes</label>
              <div 
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => document.getElementById('fileUpload').click()}
              >
                <input 
                  id="fileUpload" type="file" className="hidden" 
                  accept=".pdf,.docx" multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
                    }
                  }} 
                />
                <UploadCloud size={32} className="dropzone-icon" />
                <p><strong>Click to upload</strong> or drag and drop<br/><span className="text-sm">Select multiple PDFs/DOCX files</span></p>
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Selected Files ({files.length}):</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, listStyle: 'none' }}>
                    {files.map((file, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{file.name}</span>
                        <X size={16} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={(e) => { e.stopPropagation(); removeFile(i); }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">2. Job Description</label>
              <textarea 
                className="text-input" 
                placeholder="Paste the target requirements here..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary w-full flex-center" disabled={loading}>
                {loading ? <><Loader2 size={18} className="icon-spin mr-2"/> Evaluating Candidates...</> : 'Run Leaderboard Engine'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="info-panel">
        <div className="info-card">
          <FileText size={20} className="info-icon" />
          <h3>Bulk Operations Engine</h3>
          <ul className="info-list">
            <li>Our engine will iteratively parse and extract text from every uploaded source document.</li>
            <li>We utilize TF-IDF modeling to calculate semantic alignment and generate an objective ranking.</li>
            <li>You receive a sorted Leaderboard of all candidates, drastically reducing time-to-hire.</li>
            <li>Results are automatically archived to the Database History tab for compliance and future access.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Upload;
