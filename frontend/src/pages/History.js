import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Database } from 'lucide-react';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Use environment variable if it exists, otherwise use localhost
        const apiUrl = process.env.REACT_APP_API_URL || 'https://resume-analyzer.onrender.com/api/analyze';
        const res = await axios.get(`${apiUrl}/api/history`);
        setHistory(res.data);
      } catch (err) {
        setError('Failed to fetch history from the database.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="history-page">
      <div className="dashboard-header mb-6">
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>Analysis History</h1>
        <p className="text-muted">A record of all past candidate evaluations securely stored in the database.</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex-center" style={{ height: '200px' }}>
            <Loader2 size={32} className="icon-spin text-muted" />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : history.length === 0 ? (
          <div className="flex-center" style={{ flexDirection: 'column', height: '200px', color: 'var(--text-muted)' }}>
            <Database size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No history available.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Candidate Name</th>
                  <th>Match Score</th>
                  <th>Core Req Score</th>
                  <th>Semantic Score</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {new Date(record.created_at).toLocaleDateString()} {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{record.candidate_name}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: record.match_score >= 70 ? '#d1fae5' : record.match_score >= 40 ? '#fef3c7' : '#fee2e2', color: record.match_score >= 70 ? '#065f46' : record.match_score >= 40 ? '#b45309' : '#991b1b'}}>
                        {record.match_score}%
                      </span>
                    </td>
                    <td>{record.requirement_score}%</td>
                    <td>{record.semantic_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
