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
      // ✅ FIXED BASE URL (no duplication issue)
      const apiUrl = "https://resume-analyzer.onrender.com";

      const response = await axios.post(
        `${apiUrl}/api/analyze`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      console.log(response.data);

      // ✅ Safe navigation (no crash)
      navigate('/results', { state: { results: response.data || [] } });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      <div>
        <div className="card">
          <div className="card-header">
            <h2>Batch Analysis</h2>
            <p className="subtitle text-muted">
              Upload multiple resumes and compare with job description.
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">1. Upload Resumes</label>

              <div
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileUpload').click()}
              >
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
                    }
                  }}
                />

                <UploadCloud size={32} />
                <p>Click or drag files here (PDF/DOCX)</p>
              </div>

              {files.length > 0 && (
                <ul style={{ marginTop: '1rem' }}>
                  {files.map((file, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {file.name}
                      <X size={16} onClick={() => removeFile(i)} style={{ cursor: 'pointer' }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">2. Job Description</label>
              <textarea
                className="text-input"
                placeholder="Paste job description..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Loader2 className="icon-spin" /> : 'Analyze'}
            </button>
          </form>
        </div>
      </div>

      <div className="info-panel">
        <div className="info-card">
          <FileText size={20} />
          <h3>How it works</h3>
          <ul>
            <li>Upload resumes</li>
            <li>Paste job description</li>
            <li>Get matching score</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Upload;