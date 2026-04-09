import React, { useState } from 'react';

function UploadForm({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return;

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    onAnalyze(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="resume">1. Upload Resume File (PDF or DOCX)</label>
        <input
          type="file"
          id="resume"
          className="form-control"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="jobDescription">2. Paste Job Description</label>
        <textarea
          id="jobDescription"
          className="form-control"
          placeholder="Paste the target job description text here to compare..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn" disabled={loading || !file || !jobDescription}>
        {loading ? 'Analyzing Application...' : 'Analyze Match Score'}
      </button>
    </form>
  );
}

export default UploadForm;
