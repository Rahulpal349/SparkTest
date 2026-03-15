import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

export default function ScoreReportPage() {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submission');
  const { user } = useAuth();
  
  const [submission, setSubmission] = useState(null);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const scoreRef = useRef(null);
  const ringRef = useRef(null);

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchResult = async () => {
      if (!submissionId) return;

      const { data: subData } = await supabase.from('test_submissions').select('*').eq('id', submissionId).single();
      if (subData) {
        setSubmission(subData);
        
        const { data: testData } = await supabase.from('tests').select('*').eq('id', subData.test_id).single();
        const { data: questionsData } = await supabase.from('questions').select('*').eq('test_id', subData.test_id);

        setTest(testData);
        setQuestions(questionsData || []);
      }
      setLoading(false);
    };

    fetchResult();
  }, [submissionId]);

  useEffect(() => {
    if (!loading && submission) {
      // Animate Score
      gsap.from(scoreRef.current, {
        innerText: 0,
        duration: 1.5,
        snap: { innerText: 1 },
        ease: "power2.out"
      });

      // Animate Ring
      const percentage = (submission.score / submission.total_possible_score) * 100;
      const circumference = 2 * Math.PI * 70;
      const offset = circumference - (percentage / 100) * circumference;
      
      gsap.to(ringRef.current, {
        strokeDashoffset: offset,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, [loading, submission]);

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

  const getBreakdown = () => {
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;
    
    questions.forEach(q => {
      const userAns = submission?.answers?.[q.id];
      if (userAns !== undefined && userAns !== null) {
        attempted++;
        // Use String coercion to handle type mismatches (number vs string IDs)
        if (String(userAns) === String(q.correct_option_id)) correct++;
        else incorrect++;
      }
    });

    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    return { correct, incorrect, attempted, accuracy };
  };

  const breakdown = getBreakdown();

  return (
    <div className="score-report-page">
      {/* Header */}
      <header className="sr-header">
        <div className="sr-header-container">
          <Link to="/" className="sr-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="sr-logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
          </Link>
          <div className="sr-header-right">
            <div className="sr-user">
              <div className="sr-user-info">
                <span className="sr-user-name">{fullName}</span>
                <span className="sr-user-meta">Candidate ID: {user?.id?.slice(0, 8).toUpperCase()}</span>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=DCFCE7&color=22C55E`} alt="User" className="sr-avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="sr-main">
        {/* Title */}
        <div className="sr-title-row">
          <div>
            <h1 className="sr-title">Test Score Report</h1>
            <p className="sr-subtitle">{test?.title} • Completed on {new Date(submission?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Performance Summary Cards */}
        <div className="sr-stats-grid">
          <div className="sr-card sr-performance-card">
            <h3 className="sr-card-title">OVERALL PERFORMANCE</h3>
            <div className="sr-chart-container">
              <div className="sr-progress-ring">
                <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle className="sr-progress-bg" cx="80" cy="80" r="70" style={{ fill: 'none', stroke: '#E5E7EB', strokeWidth: 10 }}></circle>
                  <circle 
                    ref={ringRef}
                    className="sr-progress-fill" 
                    cx="80" cy="80" r="70" 
                    style={{ 
                      fill: 'none', 
                      stroke: '#22C55E', 
                      strokeWidth: 10, 
                      strokeDasharray: 2 * Math.PI * 70,
                      strokeDashoffset: 2 * Math.PI * 70,
                      strokeLinecap: 'round'
                    }}
                  ></circle>
                </svg>
                <div className="sr-score-overlay">
                  <span ref={scoreRef} className="sr-score-main">{submission?.score}</span>
                  <span className="sr-score-total">/ {submission?.total_possible_score}</span>
                </div>
              </div>
            </div>
            <div className="sr-badge-excel">
              {breakdown.accuracy > 80 ? 'Excellent Progress' : breakdown.accuracy > 50 ? 'Good Job' : 'Keep Practicing'}
            </div>
          </div>

          <div className="sr-card sr-stat-card">
            <div className="sr-stat-header">
              <div className="sr-stat-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20V16"></path></svg>
              </div>
            </div>
            <div className="sr-stat-body">
              <span className="sr-label">Attempted</span>
              <span className="sr-value">{breakdown.attempted}</span>
              <span className="sr-sub-label">out of {questions.length} questions</span>
            </div>
          </div>

          <div className="sr-card sr-stat-card">
            <div className="sr-stat-header">
              <div className="sr-stat-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
            </div>
            <div className="sr-stat-body">
              <span className="sr-label">Time Taken</span>
              <span className="sr-value">{Math.floor(submission?.time_taken_seconds / 60)}m {submission?.time_taken_seconds % 60}s</span>
              <span className="sr-sub-label">Allocated: {test?.duration_minutes} mins</span>
            </div>
          </div>

          <div className="sr-card sr-stat-card">
            <div className="sr-stat-header">
              <div className="sr-stat-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </div>
            </div>
            <div className="sr-stat-body">
              <span className="sr-label">Accuracy Rate</span>
              <span className="sr-value">{breakdown.accuracy.toFixed(1)}%</span>
              <span className="sr-sub-label">Target: &gt;85% for Tier 1</span>
            </div>
          </div>
        </div>

        {/* Benchmarking Section */}
        <div className="sr-bench-section">
          <div className="sr-bench-card sr-card">
            <div className="sr-bench-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20V16"></path></svg>
              <h3 className="sr-card-title-main">Score Benchmarking</h3>
            </div>
            <div className="sr-bench-layout">
              <div className="sr-bench-bars">
                <div className="sr-bar-group">
                  <div className="sr-bar-label"><span>Your Score</span><span>{submission?.score} / {submission?.total_possible_score}</span></div>
                  <div className="sr-bar-track"><div className="sr-bar-fill green" style={{ width: `${(submission?.score / submission?.total_possible_score) * 100}%` }}></div></div>
                </div>
              </div>
              <div className="sr-insight-panel">
                <h4 className="sr-insight-title">Performance Summary</h4>
                <p className="sr-insight-desc">
                  You correctly answered <span className="text-green">{breakdown.correct} questions</span> and had <span className="text-red">{breakdown.incorrect} incorrect</span> attempts. 
                  {breakdown.accuracy > 70 
                    ? " Your accuracy is strong! Focus on reducing silly mistakes to reach the topper level." 
                    : " Try to improve your accuracy by reviewing the concepts and avoiding guesses."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sectional Breakdown */}
        <div className="sr-breakdown-card sr-card">
          <div className="sr-bench-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            <h3 className="sr-card-title-main">Test Statistics</h3>
          </div>
          <table className="sr-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Aspect</th>
                <th>Count</th>
                <th>Marks Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="section-bold">Correct Answers</td>
                <td><span className="count-box green">{breakdown.correct}</span></td>
                <td className="marks-bold text-green">+{breakdown.correct * 2}</td>
              </tr>
              <tr>
                <td className="section-bold">Incorrect Answers</td>
                <td><span className="count-box red">{breakdown.incorrect}</span></td>
                <td className="marks-bold text-red">-{breakdown.incorrect * 0.5}</td>
              </tr>
              <tr>
                <td className="section-bold">Unattempted</td>
                <td><span className="count-box grey">{questions.length - breakdown.attempted}</span></td>
                <td className="marks-bold">0</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="total-bold">Total Score</td>
                <td></td>
                <td className="total-bold" style={{ color: '#22C55E', fontSize: '1.2rem' }}>{submission?.score.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Footer */}
        <div className="sr-footer-actions">
          <Link to="/mock-tests" className="sr-btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Back to Mock Tests
          </Link>
          <Link to={`/instructions?test=${submission?.test_id}`} className="sr-btn-outline-green" style={{ textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6"></path><path d="M2.05 14.5A10 10 0 1 0 5 4.5L2 7.5"></path></svg> Re-attempt Test
          </Link>
        </div>
      </main>

      <footer className="site-footer">
        <p>© 2024 SparkTest Professional Education. All rights reserved.</p>
      </footer>
    </div>
  );
}
