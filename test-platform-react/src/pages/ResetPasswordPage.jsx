import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Logo from '../components/Logo';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password - SparkTest';
    gsap.from(".auth-card > *", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password submitted");
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
            <h1>Empowering your <span className="text-primary">growth</span></h1>
            <p>Securely manage your assessment platform and take your professional testing to the next level.</p>
            
            <div className="auth-illustration-box">
              <img src="/assets/auth-illustration.png" alt="Engineering Illustration" />
            </div>
          </div>

          <div className="auth-sidebar-footer">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Support</a>
            </div>
            <p style={{ marginTop: '0.5rem' }}>© 2026 SparkTest. All rights reserved.</p>
          </div>
        </aside>

        {/* Form Section */}
        <main className="auth-form-section">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Reset Password</h2>
            </div>
            <p className="auth-subtitle">Create a new password for your account.</p>

            <form id="reset-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <div className="input-with-icon">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Enter new password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="input-action-icon" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <div className="input-with-icon">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirm-password" 
                    placeholder="Re-enter new password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="input-action-icon" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="requirements-list">
                <p>Requirements</p>
                <div className="requirement-item valid">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  At least 8 characters
                </div>
                <div className="requirement-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  Contains a number or symbol
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-auth">Reset Password</button>

              <Link to="/login" className="back-to-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', textDecoration: 'none', color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12,19 5,12 12,5"></polyline>
                </svg>
                Back to login
              </Link>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
