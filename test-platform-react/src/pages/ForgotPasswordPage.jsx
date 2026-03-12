import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = 'Forgot Password? - SparkTest';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password submitted");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Sidebar */}
        <aside className="auth-sidebar">
          <Link to="/" className="logo-link-wrapper">
            <Logo />
          </Link>

          <div className="auth-sidebar-content">
            <h1>Master your skills with <span className="text-primary">precision testing.</span></h1>
            <p>Join thousands of professionals using SparkTest to validate their expertise and accelerate their career growth.</p>
            
            <div className="auth-illustration-box">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 7v2m0 6v2M7 12h2m6 0h2"></path>
              </svg>
            </div>
          </div>

          <div className="auth-sidebar-footer">
            <p>© 2026 SparkTest. All rights reserved.</p>
          </div>
        </aside>

        {/* Form Section */}
        <main className="auth-form-section">
          <div className="auth-card">
            <div className="auth-header">
              <h2 style={{ fontSize: '2rem' }}>Forgot Password?</h2>
            </div>
            <p className="auth-subtitle" style={{ marginTop: '-1rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>Enter your email address and we'll send you a link to reset your password.</p>

            <form id="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </span>
                  <input type="email" id="email" placeholder="name@company.com" required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-auth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                Send Reset Link
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12,5 19,12 12,5"></polyline></svg>
              </button>

              <Link to="/login" className="back-to-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', textDecoration: 'none', color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12,19 5,12 12,5"></polyline></svg>
                Back to Log In
              </Link>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="#" className="need-help" style={{ fontSize: '0.85rem', color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Need help?
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
