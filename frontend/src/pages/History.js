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
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

        const res = await axios.get(`${apiUrl}/api/history`);

        // ✅ SAFE handling (no crash)
        setHistory(Array.isArray(res.data) ? res.data : []);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch history from the database.');
        setHistory([]); // prevent crash
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-page">
      <div className="dashboard-header mb-6">
        <h1 style={{ fontSize: '2rem' }}>Analysis History</h1>
        <p className="text-muted">All past evaluations.</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex-center" style={{ height: '200px' }}>
            <Loader2 size={32} className="icon-spin text-muted" />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : history.length === 0 ? (
          <div className="flex-center" style={{ height: '200px' }}>
            <Database size={48} />
            <p>No history available.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(history) ? history : []).map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.created_at).toLocaleString()}</td>
                  <td>{record.candidate_name}</td>
                  <td>{record.match_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default History;