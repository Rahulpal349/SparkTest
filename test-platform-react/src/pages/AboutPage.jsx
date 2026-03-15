import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About SparkTest - Our Journey & Mission';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <Header />
      
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero section-padding">
          <div className="container about-hero-grid">
            <div className="about-hero-content">
              <div className="badge">
                <span className="dot"></span> Engineering Excellence
              </div>
              <h1 className="about-hero-title">About <span className="text-primary">SparkTest</span></h1>
              <p className="about-hero-desc">
                Helping engineering students move from <span className="text-italic">'Kal se padhunga'</span> to actual preparation.
              </p>
              <div className="about-hero-ctas">
                <Link to="/exams" className="btn btn-primary">Explore Tests</Link>
                <button className="btn btn-outline" onClick={() => document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' })}>Our Story</button>
              </div>
            </div>
            <div className="about-hero-image-wrap">
              <img src="/images/about-hero.png" alt="Engineering Preparation" className="about-hero-img" />
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="story-section section-padding bg-light">
          <div className="container narrow-container-large">
            <div className="section-header centered">
              <h2 className="section-title-line">Our Story</h2>
            </div>
            <div className="story-content">
              <p>
                SparkTest is an online mock test platform created for engineering students who are tired of saying "Kal se padhunga" and then opening YouTube instead. The platform was built by <strong>Rahul Pal</strong>, an Electrical Engineer, to bridge the gap between procrastination and practice.
              </p>
              <p>
                We understand the struggle of navigating through vast engineering syllabuses, where finding relevant practice materials often feels like solving a complex differential equation without a formula sheet.
              </p>
            </div>
          </div>
        </section>

        {/* What SparkTest Does */}
        <section className="features-section section-padding">
          <div className="container">
            <div className="section-header centered">
              <h2 className="section-title">What SparkTest Does</h2>
              <p>Everything you need to master your engineering exams in one place.</p>
            </div>
            <div className="about-features-grid">
              <div className="about-feature-card text-center">
                <div className="feature-icon-circle green-soft">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
                <h3>Attempt Tests</h3>
                <p>Access curated mock tests tailored to the latest engineering patterns and difficulty levels.</p>
              </div>
              <div className="about-feature-card text-center">
                <div className="feature-icon-circle green-soft">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </div>
                <h3>Check Your Score</h3>
                <p>Get instant results and detailed breakdowns of your performance across various subjects.</p>
              </div>
              <div className="about-feature-card text-center">
                <div className="feature-icon-circle green-soft">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h3>Analyze Mistakes</h3>
                <p>Review every wrong answer with clear explanations to ensure you don't repeat the same errors.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mission-section section-padding bg-light-green">
          <div className="container mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p className="text-gray">
                Our mission is to make exam preparation easier, accessible, and free for all engineering students. We believe that understanding <strong>Kirchhoff's laws</strong> or mastering <strong>Laplace transforms</strong> shouldn't be a privilege, but a standard part of every engineer's toolkit.
              </p>
              <ul className="mission-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Democratizing high-quality technical education.</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Building a community of consistent learners.</span>
                </li>
              </ul>
            </div>
            <div className="mission-code-snippet">
              <div className="code-window">
                <div className="code-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <pre className="code-content">
                  <code>
{`// Mission Algorithm
while(student.preparing) {
  provide(quality_tests);
  reduce(anxiety);
  maximize(potential);
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Why SparkTest? */}
        <section className="why-section section-padding">
          <div className="container">
            <div className="section-header centered">
              <h2>Why SparkTest?</h2>
              <p>Designed by an engineer, for engineers.</p>
            </div>
            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon-refined">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13l4 4m0-4l-4 4m-5-5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5z"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path></svg>
                </div>
                <h3>No More Random PDFs</h3>
                <p>Stop scrolling through endless Telegram channels for outdated study materials.</p>
              </div>
              <div className="why-card">
                <div className="why-icon-refined">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
                <h3>Real Exam Experience</h3>
                <p>Interface designed to mimic actual computer-based competitive engineering exams.</p>
              </div>
              <div className="why-card">
                <div className="why-icon-refined">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                </div>
                <h3>Performance Tracking</h3>
                <p>See your growth over time with data-driven insights and progress reports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About the Founder */}
        <section className="founder-section section-padding bg-dark">
          <div className="container founder-grid">
            <div className="founder-image-wrap">
              <img src="/images/founder.png" alt="Rahul Pal" className="founder-img" />
              <div className="founder-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
              </div>
            </div>
            <div className="founder-content">
              <h2 className="text-white">About the Founder</h2>
              <h4 className="text-subtitle">Rahul Pal, Electrical Engineer</h4>
              <blockquote className="founder-quote">
                "I created SparkTest because I saw my classmates—and myself—struggling with the gap between classroom theory and exam readiness. We needed a place that made practicing as easy as scrolling through social media, but ten times more productive."
              </blockquote>
              <div className="founder-actions">
                <button className="founder-circle-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <button className="founder-circle-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="about-cta section-padding bg-light-green centered-text">
          <div className="container">
            <h2>Ready to stop procrastination?</h2>
            <p className="text-gray mb-4">Join thousands of engineering students who have already sparked their preparation.</p>
            <Link to="/signup" className="btn btn-primary btn-large">Start Your First Test Free</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
