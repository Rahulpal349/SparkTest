import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 32 }) {
  return (
    <Link to="/" className="logo-link-wrapper" style={{ textDecoration: 'none' }}>
      <div className="logo">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#22C55E" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="logo-text"><span className="text-black">Spark</span><span className="text-primary">Test</span></span>
      </div>
    </Link>
  );
}
