import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'SparkTest - Power Up Your Preparation for Govt. EE Exams';
  }, []);

  return (
    <>
      {/* Header */}
      <header className="glass fixed-top">
        <nav className="container nav-bar">
          <Link to="/" className="logo-link-wrapper">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
            </div>
          </Link>
          <ul className="nav-links">
            <li><Link to="/exams">Test Series</Link></li>
            <li><Link to="#">Live Test</Link></li>
            <li><Link to="#">About</Link></li>
          </ul>
          <div className="nav-actions">
            <Link to="/login" className="login-link">Log In</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section section-padding">
          <div className="container hero-grid">
            <div className="hero-content centered">
              <div className="badge">
                <span className="dot"></span> NEW: SSC JE 2024 SERIES LIVE
              </div>
              <h1>Power Up Your Preparation for <span className="text-primary">Govt. EE Exams</span></h1>
              <p className="hero-description">
                Master core electrical engineering concepts with our comprehensive mock test series designed by top-tier educators and industry experts.
              </p>
              <div className="hero-ctas">
                <Link to="/signup" className="btn btn-primary btn-large">Take a Free Mock Test</Link>
                <Link to="/exams" className="btn btn-secondary btn-large">View Exam Schedule</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Categories */}
        <section id="exams" className="exams-section section-padding bg-light">
          <div className="container">
            <div className="section-header">
              <h2>Exam Categories</h2>
              <p>Targeted preparation for specific electrical engineering recruitment boards.</p>
            </div>
            <div className="exam-grid">
              <div className="exam-card">
                <div className="icon-box green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
                <h3>SSC JE</h3>
                <p>Staff Selection Commission Junior Engineer (Electrical) - Comprehensive Tier 1 &amp; Tier 2 mocks.</p>
                <a href="#" className="explore-link">Explore Syllabus <span className="arrow">→</span></a>
              </div>
              <div className="exam-card">
                <div className="icon-box green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                </div>
                <h3>RRB JE</h3>
                <p>Railway Recruitment Board - Expertly crafted tests for Technical and Non-Technical sections.</p>
                <a href="#" className="explore-link">Explore Syllabus <span className="arrow">→</span></a>
              </div>
              <div className="exam-card">
                <div className="icon-box green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                </div>
                <h3>State Electricity Boards</h3>
                <p>State Level AE/JE Exams for PGCIL, UPCL, PSPCL, and other major regional boards.</p>
                <a href="#" className="explore-link">Explore Syllabus <span className="arrow">→</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container stats-banner">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">ACTIVE STUDENTS</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">MOCK TESTS</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">SUCCESS RATE</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">EXPERT SUPPORT</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-section section-padding">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo-link-wrapper">
              <div className="logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg grayscale">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
              </div>
            </Link>
            <p className="footer-desc">
              The most trusted platform for electrical engineering students to crack government exams with confidence and precision.
            </p>
          </div>
          <div className="footer-links">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/exams">Test Series</Link></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>
          <div className="footer-newsletter">
            <h4>NEWSLETTER</h4>
            <p>Get weekly exam alerts and core concept notes.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 SparkTest. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </>
  );
}
