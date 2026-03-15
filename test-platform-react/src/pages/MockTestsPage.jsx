import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

export default function MockTestsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'My Assessments - SparkTest';
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
          category:test_categories(name)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const activeCount = submissions.filter(s => !s.finished_at).length;
  const completedCount = submissions.filter(s => s.finished_at).length;

  const filteredSubmissions = submissions.filter(s => {
    const isFinished = !!s.finished_at;
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !isFinished) || 
      (filter === 'completed' && isFinished);
    
    const matchesSearch = s.tests?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F9FAFB' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div className="assessments-page">
      <UserHeader />
      
      <main className="assess-main">
        <div className="assess-container">
          {/* Header & Quick Stats */}
          <div className="assess-header-row">
            <div className="header-text">
              <h1 className="assess-title">My Assessments</h1>
              <p className="assess-subtitle">Review your history and continue your active mock exams.</p>
            </div>
            <div className="quick-stats">
              <div className="hdr-stat-card">
                <div className="hdr-stat-icon orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div className="hdr-stat-info">
                  <span className="hdr-stat-label">ACTIVE</span>
                  <span className="hdr-stat-val">{activeCount}</span>
                </div>
              </div>
              <div className="hdr-stat-card">
                <div className="hdr-stat-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="hdr-stat-info">
                  <span className="hdr-stat-label">COMPLETED</span>
                  <span className="hdr-stat-val">{completedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="assess-controls">
            <div className="tabs-row">
              <button 
                className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Tests <span className="tab-count">{submissions.length}</span>
              </button>
              <button 
                className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active <span className="tab-count">{activeCount}</span>
              </button>
              <button 
                className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed <span className="tab-count">{completedCount}</span>
              </button>
            </div>
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="Search tests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Assessment Cards Grid */}
          <div className="assessments-grid">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map(sub => (
                <AssessmentCard key={sub.id} sub={sub} />
              ))
            ) : (
              <div className="empty-assessments">
                <div className="empty-content">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <h3>No assessments found</h3>
                  <p>Try changing your filter or search query, or start a new test.</p>
                  <Link to="/exams" className="btn btn-primary mt-3" style={{ textDecoration: 'none' }}>Browse Test Series</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .assessments-page {
          min-height: 100vh;
          background: #F8FAFC;
        }
        .assess-main {
          padding: 3rem 1.5rem;
        }
        .assess-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .assess-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          gap: 2rem;
        }
        .assess-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        .assess-subtitle {
          color: #64748B;
          font-size: 1.1rem;
        }
        .quick-stats {
          display: flex;
          gap: 1.25rem;
        }
        .hdr-stat-card {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border: 1px solid #F1F5F9;
          min-width: 180px;
        }
        .hdr-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hdr-stat-icon.orange { background: #FFF7ED; color: #F97316; }
        .hdr-stat-icon.green { background: #F0FDF4; color: #22C55E; }
        .hdr-stat-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.05em;
        }
        .hdr-stat-val {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1E293B;
        }

        /* Controls */
        .assess-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid #E2E8F0;
          gap: 1.5rem;
        }
        .tabs-row {
          display: flex;
          gap: 2rem;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tab-btn.active {
          color: #22C55E;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #22C55E;
          border-radius: 3px 3px 0 0;
        }
        .tab-count {
          background: #F1F5F9;
          color: #64748B;
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 20px;
        }
        .tab-btn.active .tab-count {
          background: #DCFCE7;
          color: #166534;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #E2E8F0;
          padding: 0.6rem 1rem;
          border-radius: 12px;
          width: 300px;
          gap: 0.75rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          color: #1E293B;
        }

        /* Assessments Grid */
        .assessments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
          gap: 1.5rem;
        }

        .assessment-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid #F1F5F9;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .assessment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
        .card-visual {
          width: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-visual.progress { background: #FFEDD5; }
        .card-visual.completed { background: #DCFCE7; }
        .card-visual.expired { background: #F1F5F9; }
        
        .card-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          margin-bottom: 1rem;
        }
        .status-badge.in-progress { background: #FFF7ED; color: #F97316; }
        .status-badge.finished { background: #F0FDF4; color: #22C55E; }
        .status-badge.expired { background: #F8FAFC; color: #94A3B8; }
        
        .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

        .date-text {
          float: right;
          font-size: 0.8rem;
          color: #94A3B8;
          font-weight: 500;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 0.25rem;
          clear: both;
        }
        .card-meta {
          color: #64748B;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-group {
          width: 60%;
        }
        .bar-wrap {
          height: 8px;
          background: #F1F5F9;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .bar-fill { height: 100%; background: #F97316; border-radius: 4px; }
        
        .res-btn {
          background: #22C55E;
          color: white;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 10px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
        }
        .res-btn:hover { background: #16A34A; }

        .score-group label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .score-big { font-size: 1.5rem; font-weight: 800; color: #1E293B; }
        .score-big span { font-size: 1rem; color: #94A3B8; weight: 600; }

        .rep-btn {
          border: 1.5px solid #22C55E;
          color: #22C55E;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .rep-btn:hover { background: #F0FDF4; }

        .arc-btn {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #64748B;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          text-decoration: none;
        }

        .empty-assessments {
          grid-column: 1 / -1;
          padding: 6rem 0;
          text-align: center;
          background: white;
          border-radius: 24px;
          border: 1px dashed #E2E8F0;
        }
        .empty-content h3 { font-weight: 800; color: #1E293B; margin: 1rem 0 0.5rem; }
        .empty-content p { color: #64748B; }

        @media (max-width: 1100px) {
          .assessments-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .assess-header-row { flex-direction: column; align-items: flex-start; }
          .assess-controls { flex-direction: column; align-items: flex-start; }
          .search-box { width: 100%; }
          .hdr-stat-card { min-width: auto; flex: 1; }
          .card-visual { width: 100px; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function AssessmentCard({ sub }) {
  const isFinished = !!sub.finished_at;
  const isExpired = false; // Placeholder for logic
  
  const status = isFinished ? 'finished' : (isExpired ? 'expired' : 'in-progress');
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="assessment-card">
      <div className={`card-visual ${status}`}>
        {status === 'in-progress' && (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        )}
        {status === 'finished' && (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M12 20.94a8.95 8.95 0 0 1-4.96-1.46 9 9 0 1 1 12.4-8.48"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        )}
        {status === 'expired' && (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
        )}
      </div>
      
      <div className="card-content">
        <header>
          <span className={`status-badge ${status}`}>
            <span className="dot"></span>
            {status === 'in-progress' ? 'In Progress' : (status === 'finished' ? 'Completed' : 'Expired')}
          </span>
          <span className="date-text">
            {status === 'in-progress' ? `Attempted ${formatDate(sub.created_at)}` : `Finished ${formatDate(sub.finished_at || sub.created_at)}`}
          </span>
        </header>
        
        <h3 className="card-title">{sub.tests?.title}</h3>
        <p className="card-meta">{sub.tests?.category?.name} • Full Length Test</p>
        
        <div className="card-footer">
          {status === 'in-progress' && (
            <>
              <div className="progress-group">
                <div className="bar-wrap">
                  <div className="bar-fill" style={{ width: '45%' }}></div>
                </div>
              </div>
              <Link to={`/test-interface?testId=${sub.test_id}&resume=${sub.id}`} className="res-btn">
                Resume <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </Link>
            </>
          )}
          
          {status === 'finished' && (
            <>
              <div className="score-group">
                <label>YOUR SCORE</label>
                <div className="score-big">{sub.score}<span>/{sub.total_possible_score}</span></div>
              </div>
              <Link to={`/score-report?submission=${sub.id}`} className="rep-btn">
                View Report <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17l-6-6-4 4-5-5"/></svg>
              </Link>
            </>
          )}
          
          {status === 'expired' && (
             <Link to="#" className="arc-btn">View Archive</Link>
          )}
        </div>
      </div>
    </div>
  );
}

