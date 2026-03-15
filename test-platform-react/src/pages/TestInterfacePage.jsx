import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function TestInterfacePage() {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('test');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Test State
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: optionId }
  const [questionStatus, setQuestionStatus] = useState({}); // { index: 'answered' | 'unanswered' | 'marked' | 'visited' }
  const [showModal, setShowModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchData = async () => {
      if (!testId) return;

      const { data: testData } = await supabase.from('tests').select('*').eq('id', testId).single();
      const { data: questionsData } = await supabase.from('questions').select('*').eq('test_id', testId).order('created_at', { ascending: true });

      if (testData) {
        setTest(testData);
        setTimeLeft(testData.duration_minutes * 60);
        document.title = `${testData.title} - SparkTest`;
      }
      if (questionsData) {
        setQuestions(questionsData);
        // Initialize status
        const initialStatus = {};
        questionsData.forEach((_, i) => { initialStatus[i] = i === 0 ? 'visited' : 'not-visited'; });
        setQuestionStatus(initialStatus);
      }
      setLoading(false);
    };

    fetchData();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0 && !loading && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinalSubmit(); // Auto-submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, loading, isPaused]);
  
  // Security & Scroll Lock
  useEffect(() => {
    // Lock global scroll
    document.documentElement.classList.add('test-active');
    document.body.classList.add('test-active');
    
    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Disable copy
    const handleCopy = (e) => e.preventDefault();
    document.addEventListener('copy', handleCopy);
    
    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+S
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 67 || e.keyCode === 86)) // Ctrl+U/S/C/V
      ) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Cleanup
      document.documentElement.classList.remove('test-active');
      document.body.classList.remove('test-active');
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (optionId) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleSaveAndNext = () => {
    if (userAnswers[currentQuestion.id]) {
      setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'answered' }));
    } else {
      setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'unanswered' }));
    }
    
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (questionStatus[nextIndex] === 'not-visited') {
        setQuestionStatus(prev => ({ ...prev, [nextIndex]: 'visited' }));
      }
    }
  };

  const handleMarkForReview = () => {
    setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'review' }));
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (questionStatus[nextIndex] === 'not-visited') {
        setQuestionStatus(prev => ({ ...prev, [nextIndex]: 'visited' }));
      }
    }
  };

  const handleClearResponse = () => {
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQuestion.id];
    setUserAnswers(newAnswers);
    // If it was answered, set it back to unanswered/visited
    setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'unanswered' }));
  };

  const handleFinalSubmit = async () => {
    // Calculate Score (Simple frontend calculation for now, better to do on backend/trigger)
    let score = 0;
    questions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (userAns !== undefined && userAns !== null) {
        // Use String coercion to handle type mismatches (number vs string IDs)
        if (String(userAns) === String(q.correct_option_id)) {
          score += 2; // Assuming 2 marks for correct
        } else {
          score -= 0.5; // Assuming 0.5 negative
        }
      }
    });

    const submission = {
      user_id: user.id,
      test_id: testId,
      score: Math.max(0, score),
      total_possible_score: questions.length * 2, // Harmonize with +2 marks logic
      time_taken_seconds: (test.duration_minutes * 60) - timeLeft,
      answers: userAnswers
    };

    const { data, error } = await supabase.from('test_submissions').insert(submission).select().single();

    if (error) {
      console.error('Submission error:', error);
      alert('Failed to submit test. Please try again.');
    } else {
      navigate(`/score-report?submission=${data.id}`);
    }
  };

  const getStatusCounts = () => {
    const counts = { answered: 0, unanswered: 0, review: 0, notVisited: 0 };
    Object.values(questionStatus).forEach(s => {
      if (s === 'answered') counts.answered++;
      else if (s === 'review') counts.review++;
      else if (s === 'unanswered' || s === 'visited') counts.unanswered++;
      else counts.notVisited++;
    });
    return counts;
  };

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

  const counts = getStatusCounts();

  return (
    <div className="test-interface-page">
      {/* Header */}
      <header className="ti-header">
        <div className="ti-header-left">
          <div className="ti-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="ti-logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
          </div>
          <div className="ti-header-divider"></div>
          <div className="ti-test-info">
            <span className="ti-test-name">{test?.title}</span>
            <span className="ti-section-name">Section: All Questions</span>
          </div>
        </div>
        <div className="ti-header-center">
          <div className="ti-timer-box">
            <span className="ti-timer-label">TIME LEFT</span>
            <span className="ti-timer-value">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="ti-header-right">
          <button className="ti-action-btn" onClick={() => setIsPaused(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause
          </button>
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=DCFCE7&color=22C55E`} alt="User" className="ti-avatar" />
        </div>
      </header>

      <div className="ti-layout">
        {/* Question Area */}
        <main className="ti-question-area">
          <div className="ti-question-header">
            <div>
              <h2 className="ti-question-number">Question No. {currentIndex + 1}</h2>
              <div className="ti-marks-info">
                <span className="ti-marks positive">Marks: +2.0</span>
                <span className="ti-marks negative">Negative: -0.5</span>
              </div>
            </div>
            <button className="ti-report-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> Report
            </button>
          </div>

          <div className="ti-question-body">
            <p className="ti-question-text">{currentQuestion?.question_text}</p>

            <div className="ti-options">
              {currentQuestion?.options.map((opt) => (
                <label key={opt.id} className={`ti-option ${userAnswers[currentQuestion.id] === opt.id ? 'selected' : ''}`} onClick={() => handleOptionSelect(opt.id)}>
                  <input 
                    type="radio" 
                    name="answer" 
                    value={opt.id} 
                    checked={userAnswers[currentQuestion.id] === opt.id} 
                    onChange={() => {}} 
                  />
                  <span className="ti-radio"></span>
                  <span className="ti-option-text">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question Footer */}
          <div className="ti-question-footer">
            <div className="ti-footer-left">
              <button className="ti-btn ti-btn-outline" onClick={handleMarkForReview}>Mark for Review &amp; Next</button>
              <button className="ti-btn ti-btn-outline" onClick={handleClearResponse}>Clear Response</button>
            </div>
            <button className="ti-btn ti-btn-save" onClick={handleSaveAndNext}>
              {currentIndex === questions.length - 1 ? 'Save' : 'Save & Next'} &nbsp;→
            </button>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="ti-sidebar">
          <div className="ti-user-card">
            <div className="ti-user-avatar-wrap">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=DCFCE7&color=22C55E`} alt={fullName} className="ti-user-avatar-img" />
            </div>
            <div className="ti-user-details">
              <span className="ti-user-name">{fullName}</span>
              <span className="ti-user-id">Candidate ID: {user?.id?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          <div className="ti-stats-grid">
            <div className="ti-stat-box answered"><span className="ti-stat-value">{counts.answered}</span><span className="ti-stat-label">ANSWERED</span></div>
            <div className="ti-stat-box unanswered"><span className="ti-stat-value">{counts.unanswered}</span><span className="ti-stat-label">UNANSWERED</span></div>
            <div className="ti-stat-box not-visited"><span className="ti-stat-value">{counts.notVisited}</span><span className="ti-stat-label">NOT VISITED</span></div>
            <div className="ti-stat-box review"><span className="ti-stat-value">{counts.review}</span><span className="ti-stat-label">REVIEW</span></div>
          </div>

          <div className="ti-palette-section">
            <h5 className="ti-palette-title">QUESTION PALETTE</h5>
            <div className="ti-palette-grid">
              {questions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className={`ti-q-btn ${idx === currentIndex ? 'q-current' : ''} q-${questionStatus[idx] || 'default'}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (questionStatus[idx] === 'not-visited') {
                      setQuestionStatus(prev => ({ ...prev, [idx]: 'visited' }));
                    }
                  }}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="ti-sidebar-footer">
            <div className="ti-sidebar-links">
              <Link to="/instructions" className="ti-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Instructions
              </Link>
            </div>
            <button className="ti-submit-btn" onClick={() => setShowModal(true)}>Submit Test</button>
          </div>
        </aside>
      </div>

      {/* Test Summary Modal */}
      {showModal && (
        <div className="ts-overlay" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="ts-modal">
            <div className="ts-modal-header">
              <div>
                <h2 className="ts-title">Test Summary</h2>
                <p className="ts-subtitle">Review your progress before final submission</p>
              </div>
              <button className="ts-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="ts-modal-body">
              <table className="ts-table">
                <thead>
                  <tr>
                    <th>Section</th><th>No. of questions</th><th>Answered</th><th>Not Answered</th><th>Marked for Review</th><th>Not Visited</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="ts-section-name">General Technical</td>
                    <td>{questions.length}</td>
                    <td>{counts.answered}</td>
                    <td>{counts.unanswered}</td>
                    <td>{counts.review}</td>
                    <td>{counts.notVisited}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="ts-modal-footer">
              <button className="ts-tests-btn" onClick={() => setShowModal(false)}>Resume Test</button>
              <button onClick={handleFinalSubmit} className="ts-resume-btn" style={{ background: '#22C55E', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Submit &amp; View Results &nbsp;▶</button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="ti-pause-overlay">
          <div className="ti-pause-modal">
            <div className="ti-pause-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            </div>
            <h2 className="ti-pause-title">Test Paused</h2>
            <p className="ti-pause-text">Your timer has been stopped. Take a break and click <strong>Resume</strong> when you're ready to continue.</p>
            <button className="ti-btn-save" onClick={() => setIsPaused(false)}>Resume Test</button>
          </div>
        </div>
      )}
    </div>
  );
}
