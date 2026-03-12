import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function UserHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="user-header">
      <Logo size={28} />
      <nav className="user-nav">
        <Link to="/exams" className="active">Exams</Link>
        <Link to="#">My Tests</Link>
        <Link to="#">Performance</Link>
      </nav>
      <div className="user-profile-info" style={{ gap: '1.5rem' }}>
        <div className="date-info">
          <span className="date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="user-name">{fullName}</span>
        </div>
        <div className="profile-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E8F5E9&color=22C55E`} alt="Profile" className="profile-avatar" />
          <button 
            onClick={handleSignOut}
            className="btn-logout" 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#EF4444', 
              fontSize: '0.875rem', 
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
