import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

const exams = [
  {
    id: 'ssc-je',
    name: 'SSC JE Electrical Engineering',
    description: 'Staff Selection Commission Junior Engineer (Electrical) — Comprehensive Tier 1 & Tier 2 mock tests.',
    tests: '80+',
    students: '5,000+',
    color: '#22C55E',
    bgColor: '#F0FDF4',
    available: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'rrb-je',
    name: 'RRB JE Electrical',
    description: 'Railway Recruitment Board Junior Engineer — Expertly crafted tests for Technical and Non-Technical sections.',
    tests: '60+',
    students: '3,200+',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    available: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'state-boards',
    name: 'State Electricity Boards',
    description: 'State Level AE/JE Exams for PGCIL, UPCL, PSPCL, UPRVUNL, and other major regional boards.',
    tests: '40+',
    students: '2,100+',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    available: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'gate-ee',
    name: 'GATE Electrical Engineering',
    description: 'Graduate Aptitude Test in Engineering — Practice with previous year papers and mock tests.',
    tests: '50+',
    students: '4,500+',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    available: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
      </svg>
    ),
  },
  {
    id: 'ese',
    name: 'ESE / IES Electrical',
    description: 'Engineering Services Examination — Prelims & Mains objective practice for UPSC ESE.',
    tests: '30+',
    students: '1,800+',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    available: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      </svg>
    ),
  },
  {
    id: 'isro',
    name: 'ISRO Technical Assistant',
    description: 'Indian Space Research Organisation — Electrical Engineering technical tests for Scientist/Engineer roles.',
    tests: '20+',
    students: '900+',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    available: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

export default function ExamsPage() {
  useEffect(() => {
    document.title = 'Test Series - SparkTest';
  }, []);

  return (
    <div className="mock-tests-page">
      <UserHeader />

      <section className="mock-tests-hero">
        <h1>Explore Exam Categories</h1>
        <p>Choose your target exam and start your preparation journey with expert-designed test series.</p>
      </section>

      <div className="exam-cards-grid">
        {exams.map((exam) => (
          <div className={`exam-select-card ${!exam.available ? 'coming-soon-card' : ''}`} key={exam.id}>
            <div className="exam-select-header">
              <div className="exam-select-icon" style={{ background: exam.bgColor, color: exam.color }}>
                {exam.icon}
              </div>
              {!exam.available && <span className="coming-soon-tag">Coming Soon</span>}
              {exam.available && <span className="live-tag">Live</span>}
            </div>
            <h3>{exam.name}</h3>
            <p className="exam-select-desc">{exam.description}</p>
            <div className="exam-select-stats">
              <div className="exam-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <span>{exam.tests} Tests</span>
              </div>
              <div className="exam-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <span>{exam.students} Students</span>
              </div>
            </div>
            {exam.available ? (
              <Link to={`/exams/${exam.id}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                Start Preparation →
              </Link>
            ) : (
              <button className="btn btn-disabled" disabled style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                Notify Me When Available
              </button>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
