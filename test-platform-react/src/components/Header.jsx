import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="glass fixed-top">
      <nav className="container nav-bar">
        <Logo size={32} />
        <ul className="nav-links">
          <li><Link to="/exams">Test Series</Link></li>
          <li><Link to="/mock-tests">Live Test</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="#">Practice</Link></li>
        </ul>
        <div className="nav-right">
          {user ? (
            <Link to="/exams" className="btn btn-primary">Go to Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Get Started →</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
