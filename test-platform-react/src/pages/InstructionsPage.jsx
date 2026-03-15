import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function InstructionsPage() {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('test');
  const { user } = useAuth();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(false);

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;
      
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (error) {
        console.error('Error fetching test:', error);
      } else {
        setTest(data);
        document.title = `Instructions: ${data.title} - SparkTest`;
      }
      setLoading(false);
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F9FAFB' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="instructions-page">
      {/* Header */}
      <header className="instructions-header">
        <div className="header-left">
          <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
          </Link>
        </div>
        <div className="header-center">
          <h2 className="exam-title">{test?.title || 'Mock Test'}</h2>
        </div>
        <div className="header-right">
          <div className="candidate-info">
            <div className="candidate-details">
              <span className="candidate-name">{fullName}</span>
              <span className="candidate-id">ID: {user?.id?.slice(0, 8).toUpperCase()}</span>
            </div>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E8F5E9&color=22C55E`} alt="Candidate" className="candidate-avatar" />
          </div>
        </div>
      </header>

      <div className="instructions-layout">
        {/* Main Content */}
        <main className="instructions-main">
          <div className="breadcrumb">Dashboard &nbsp;›&nbsp; Online Tests</div>
          <h1 className="main-title">General Instructions</h1>
          <div className="test-info-strip">
            <span className="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}
            </span>
            <span className="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {test?.duration_minutes || 0} Minutes
            </span>
            <span className="info-item">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> {test?.total_questions || 0} Questions
            </span>
          </div>

          <div className="instructions-card">
            <div className="card-header">
              <h3>Please read the instructions carefully</h3>
              <a href="#" className="view-pattern">View Exam Pattern
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>

            <div className="instructions-section">
              <div className="section-title">
                <span className="info-icon">i</span>
                <h4>General Details</h4>
              </div>
              <ol className="instructions-list">
                <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.</li>
                <li>When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
                <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols.</li>
              </ol>
            </div>

            <div className="status-legend-box">
              <div className="legend-row">
                <div className="legend-item">
                  <span className="legend-symbol not-visited"></span>
                  <span>You have not visited the question yet.</span>
                </div>
                <div className="legend-item">
                  <span className="legend-symbol not-answered">✕</span>
                  <span>You have not answered the question.</span>
                </div>
              </div>
              <div className="legend-row">
                <div className="legend-item">
                  <span className="legend-symbol answered">✓</span>
                  <span>You have answered the question.</span>
                </div>
                <div className="legend-item">
                  <span className="legend-symbol marked"></span>
                  <span>You have NOT answered, but marked for review.</span>
                </div>
              </div>
            </div>

            <div className="instructions-section">
              <h4>Navigating to a Question</h4>
              <p>To answer a question, do the following:</p>
              <ul className="nav-rules">
                <li>Click on the question number in the Question Palette to go to that numbered question directly.</li>
                <li>Click on <strong>Save &amp; Next</strong> to save your answer for the current question and then go to the next question.</li>
                <li>Click on <strong>Mark for Review &amp; Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
              </ul>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="instructions-sidebar">
          <div className="user-large-card">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FFEDD5&color=C2410C`} alt={fullName} className="user-img-large" />
            <div className="user-info-large">
              <h4>{fullName}</h4>
              <span>ID: {user?.id?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-header">
              <h5 className="section-label">EXAM SUMMARY</h5>
            </div>
            <div style={{ padding: '0 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#6B7280' }}>Questions:</span>
                <span style={{ fontWeight: 600 }}>{test?.total_questions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#6B7280' }}>Max Marks:</span>
                <span style={{ fontWeight: 600 }}>{test?.total_marks}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#6B7280' }}>Time:</span>
                <span style={{ fontWeight: 600 }}>{test?.duration_minutes} Mins</span>
              </div>
            </div>
          </div>

          <button className="help-desk-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Help Desk
          </button>
        </aside>
      </div>

      {/* Fixed Footer */}
      <footer className="instructions-footer">
        <div className="footer-left">
          <Link to="/test-list" className="btn-secondary">Back to List</Link>
        </div>
        <div className="footer-center" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <label className="consent-checkbox" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 500 }}>I have read and understood the instructions.</span>
          </label>
        </div>
        <div className="footer-right">
          <Link 
            to={consent ? `/test-interface?test=${testId}` : '#'} 
            className={`btn-primary-large ${!consent ? 'disabled' : ''}`} 
            style={{ 
              textDecoration: 'none',
              opacity: consent ? 1 : 0.5,
              cursor: consent ? 'pointer' : 'not-allowed',
              pointerEvents: consent ? 'auto' : 'none'
            }}
          >
            I AM READY TO BEGIN &nbsp;▶
          </Link>
        </div>
      </footer>
    </div>
  );
}
