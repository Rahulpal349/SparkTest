import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-redesign">
      <div className="container">
        <div className="footer-redesign-grid">
          <div className="footer-logo-section">
            <div className="logo logo-link-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
            </div>
            <p>The most trusted platform for electrical engineering students to crack government exams with confidence.</p>
          </div>
          <div className="footer-col">
            <h4>PLATFORM</h4>
            <ul>
              <li><Link to="/exams">Test Series</Link></li>
              <li><Link to="/mock-tests">Live Test</Link></li>
              <li><Link to="/performance">Performance</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>LEGAL</h4>
            <ul>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© 2024 SparkTest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
