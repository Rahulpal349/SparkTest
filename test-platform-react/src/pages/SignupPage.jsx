import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create an Account - SparkTest';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      console.log("Signup successful:", data);
      navigate('/login', { state: { message: 'Signup successful! Please check your email for verification.' } });
    }
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
            <h1>Join the top ranks of Electrical Engineers</h1>
            <p>Access comprehensive mock tests, live series, and expert-designed questions. Elevate your technical career today.</p>
            
            <div className="auth-illustration-box">
              <img src="/assets/auth-illustration.png" alt="Engineering Illustration" />
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
              <h2>Create an Account</h2>
              <Link to="/login" className="toggle-link">Log In</Link>
            </div>
            <p className="auth-subtitle">Start your journey toward engineering mastery.</p>

            {error && <div className="auth-error-message" style={{ color: '#EF4444', backgroundColor: '#FEE2E2', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

            <form id="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input 
                  type="text" 
                  id="fullname" 
                  placeholder="Nikola Tesla" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="nikola@sparktest.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button type="button" className="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="auth-footer-text" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B7280' }}>
              By signing up, you agree to SparkTest's <a href="#" style={{ color: '#22C55E' }}>Terms of Service</a> and <a href="#" style={{ color: '#22C55E' }}>Privacy Policy</a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
