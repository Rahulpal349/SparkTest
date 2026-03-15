import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

export default function PerformancePage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    avgAccuracy: 0,
    totalTime: 0
  });

  useEffect(() => {
    document.title = 'Performance - SparkTest';
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('test_submissions')
      .select(`
        *,
        tests (
          title,
          category_id
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setSubmissions(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  };

  const calculateStats = (data) => {
    if (data.length === 0) return;

    const total = data.length;
    let totalScorePercent = 0;
    let totalTime = 0;

    data.forEach(sub => {
      totalScorePercent += (sub.score / sub.total_possible_score) * 100;
      totalTime += sub.time_taken_seconds;
    });

    setStats({
      totalTests: total,
      avgScore: (totalScorePercent / total).toFixed(1),
      avgAccuracy: (totalScorePercent / total).toFixed(1), // Using same for now as placeholder
      totalTime: Math.floor(totalTime / 60)
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F9FAFB' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div className="performance-page">
      <UserHeader />
      
      <main className="perf-main">
        <div className="perf-container">
          <header className="perf-page-header">
            <div className="title-section">
              <h1 className="perf-title">Performance Analytics</h1>
              <p className="perf-subtitle">Comprehensive breakdown of your preparation journey and test statistics.</p>
            </div>
          </header>

          {/* Key Stats Row */}
          <div className="perf-stats-grid">
            <div className="perf-stat-card glass-card">
              <div className="stat-icon-wrapper bg-soft-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Tests Taken</span>
                <span className="stat-value text-dark">{stats.totalTests}</span>
              </div>
            </div>

            <div className="perf-stat-card glass-card">
              <div className="stat-icon-wrapper bg-soft-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Time Spent</span>
                <span className="stat-value text-success">{stats.totalTime}m</span>
              </div>
            </div>

            <div className="perf-stat-card glass-card">
              <div className="stat-icon-wrapper bg-soft-warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Avg. Accuracy</span>
                <span className="stat-value text-warning">{stats.avgAccuracy}%</span>
              </div>
            </div>

            <div className="perf-stat-card glass-card">
              <div className="stat-icon-wrapper bg-soft-info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Avg. Score</span>
                <span className="stat-value text-info">{stats.avgScore}%</span>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="perf-history-card glass-card">
            <div className="history-header">
              <div className="header-title-row">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <h3 className="section-title">Recent Test History</h3>
              </div>
            </div>

            <div className="history-table-container">
              <table className="perf-table">
                <thead>
                  <tr>
                    <th>TEST NAME</th>
                    <th>DATE</th>
                    <th>SCORE</th>
                    <th>ACCURACY</th>
                    <th>TIME TAKEN</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length > 0 ? (
                    submissions.map(sub => (
                      <tr key={sub.id}>
                        <td className="test-name-cell">{sub.tests?.title}</td>
                        <td className="date-cell">{new Date(sub.created_at).toLocaleDateString('en-GB')}</td>
                        <td className="score-cell">
                          <span className="score-main">{sub.score}</span>
                          <span className="score-total">/{sub.total_possible_score}</span>
                        </td>
                        <td className="accuracy-cell">
                          <div className="acc-wrap">
                            <div className="acc-bar-bg">
                              <div className="acc-bar-fill" style={{ width: `${(sub.score / sub.total_possible_score) * 100}%` }}></div>
                            </div>
                            <span className="acc-text">{((sub.score / sub.total_possible_score) * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="time-cell">{Math.floor(sub.time_taken_seconds / 60)}m {sub.time_taken_seconds % 60}s</td>
                        <td className="action-cell">
                          <Link to={`/score-report?submission=${sub.id}`} className="view-link">View Report &rarr;</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-wrap">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          <p>No tests attempted yet. Start your journey today!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .performance-page {
          min-height: 100vh;
          background: #F9FAFB;
        }

        .perf-main {
          padding: 4rem 1.5rem;
        }

        .perf-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .perf-page-header {
          margin-bottom: 3rem;
        }

        .perf-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .perf-subtitle {
          color: #6B7280;
          font-size: 1.125rem;
          max-width: 600px;
        }

        /* Stats Grid */
        .perf-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .perf-stat-card {
          padding: 1.75rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .perf-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-soft-primary { background: #EEF2FF; color: #4F46E5; }
        .bg-soft-success { background: #ECFEFF; color: #22C55E; }
        .bg-soft-warning { background: #FFFBEB; color: #F59E0B; }
        .bg-soft-info { background: #F0FDFA; color: #0891B2; }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 800;
          line-height: 1;
        }

        /* History Table Card */
        .perf-history-card {
           padding: 2rem;
        }

        .history-header {
          margin-bottom: 2rem;
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }

        .history-table-container {
          overflow-x: auto;
        }

        .perf-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .perf-table th {
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .perf-table td {
          padding: 1.5rem 0;
          border-bottom: 1px solid #F3F4F6;
          vertical-align: middle;
        }

        .test-name-cell {
          font-weight: 700;
          color: #111827;
        }

        .date-cell {
          color: #6B7280;
          font-size: 0.875rem;
        }

        .score-main {
         font-weight: 700;
         color: #111827;
        }

        .score-total {
          color: #9CA3AF;
          font-size: 0.875rem;
        }

        .acc-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .acc-bar-bg {
          width: 80px;
          height: 6px;
          background: #F3F4F6;
          border-radius: 3px;
          overflow: hidden;
        }

        .acc-bar-fill {
          height: 100%;
          background: #22C55E;
          border-radius: 3px;
        }

        .acc-text {
          font-weight: 700;
          font-size: 0.875rem;
          color: #111827;
        }

        .time-cell {
          color: #6B7280;
          font-size: 0.875rem;
        }

        .view-link {
          text-decoration: none;
          color: #22C55E;
          font-weight: 700;
          font-size: 0.875rem;
          transition: color 0.2s ease;
          display: block;
          text-align: right;
        }

        .view-link:hover {
          color: #16A34A;
        }

        .empty-state {
          padding: 4rem 0;
          text-align: center;
        }

        .empty-wrap p {
          color: #9CA3AF;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .perf-title { font-size: 2rem; }
          .perf-stat-card { padding: 1.25rem; }
          .stat-value { font-size: 1.5rem; }
          .perf-history-card { padding: 1.25rem; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
