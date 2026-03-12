import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

export default function ExamsPage() {
  useEffect(() => {
    document.title = 'Exams - SparkTest';
  }, []);

  return (
    <div className="mock-tests-page">
      <UserHeader />

      <section className="mock-tests-hero">
        <h1>SSC JE Electrical Engineering</h1>
        <p>Your comprehensive practice hub for SSC JE (EE) preparation.</p>
      </section>

      <div className="test-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <Link to="/mock-tests" className="mock-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div className="card-top">
            <div className="mock-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <h3>Mock Tests</h3>
            <p className="test-count">Chapter, Subject, Full & Mini Tests</p>
          </div>
          <div className="progress-section">
            <div className="progress-status">
              <span className="status-label">Overall Progress</span>
              <span className="status-val">0%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }}></div></div>
            <p className="status-summary">Get started with your first test</p>
          </div>
          <span className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Explore Mock Tests →</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
