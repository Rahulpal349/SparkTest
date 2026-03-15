import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About SparkTest - Our Story';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <Header />
      <main className="about-main section-padding">
        <div className="container narrow-container">
          <section className="about-hero centered-text">
            <h1 className="legal-title">About SparkTest</h1>
            <p className="about-tagline">Making exam preparation easier, accessible, and free for engineering students.</p>
          </section>

          <section className="about-section">
            <p className="about-intro">
              SparkTest is an online mock test platform created for engineering students who are tired of saying <strong>“kal se padhunga”</strong> and then opening YouTube instead.
            </p>
            <p>
              The platform was built by <strong>Rahul Pal</strong>, an Electrical Engineer, who realized something very important during exam preparation:
            </p>
            <div className="quote-box">
              <p>“Finding good practice questions is harder than solving the questions themselves.”</p>
            </div>
            <p>
              After spending hours searching random PDFs, Telegram groups, and questionable websites, he decided to do what every engineer eventually does: <strong>Build a solution.</strong>
            </p>
            <p>And that solution became <strong>SparkTest</strong>.</p>
          </section>

          <section className="about-section highlight-bg">
            <h2 className="section-subtitle">What SparkTest Does</h2>
            <p>SparkTest gives engineering students a place to practice mock tests that feel like real exams.</p>
            <ul className="feature-list">
              <li><strong>Attempt tests</strong> with real-time feedback</li>
              <li><strong>Check your score</strong> and track progress</li>
              <li><strong>Analyze mistakes</strong> to improve accuracy</li>
              <li>And realize that you should probably study a little more...</li>
            </ul>
            <p className="about-joke">Basically, it is like the real exam… but without the invigilator staring into your soul. 👁️</p>
          </section>

          <section className="about-section">
            <h2 className="section-subtitle">Our Mission</h2>
            <p>Our mission is simple: <strong>Make exam preparation easier, accessible, and free for engineering students.</strong></p>
            <p>Engineering is already difficult enough with:</p>
            <ul className="bullet-list">
              <li>Kirchhoff’s laws</li>
              <li>Laplace transforms</li>
              <li>And that one subject nobody understands but somehow everyone passes.</li>
            </ul>
            <p>So the least we can do is make practice tests easier to access.</p>
          </section>

          <section className="about-section highlight-bg">
            <h2 className="section-subtitle">Why SparkTest?</h2>
            <p>Because engineering students deserve something better than random PDFs from Telegram or websites that look like they were built in 2005.</p>
            <div className="why-grid">
              <div className="why-item">
                <div className="why-icon">✅</div>
                <p>Free practice tests for engineers</p>
              </div>
              <div className="why-item">
                <div className="why-icon">✅</div>
                <p>Real exam-like mock test experience</p>
              </div>
              <div className="why-item">
                <div className="why-icon">✅</div>
                <p>Performance tracking and analysis</p>
              </div>
              <div className="why-item">
                <div className="why-icon">✅</div>
                <p>A simple platform without unnecessary nonsense</p>
              </div>
            </div>
          </section>

          <section className="about-section centered-text">
            <h2 className="section-subtitle">About the Founder</h2>
            <div className="founder-card">
              <img src={`https://ui-avatars.com/api/?name=Rahul+Pal&background=DCFCE7&color=22C55E&size=128`} alt="Rahul Pal" className="founder-avatar" />
              <h3>Rahul Pal</h3>
              <p className="founder-title">Electrical Engineer & Developer</p>
              <p className="founder-desc">
                Rahul is an Electrical Engineer who enjoys building things with technology. Instead of just complaining about problems in exam preparation, he decided to actually build a platform to help students practice.
              </p>
            </div>
          </section>

          <section className="about-conclusion centered-text">
            <p className="final-thought">Because let's be honest… Engineering exams are already hard enough. ⚡</p>
            <p className="about-goal">Help engineers practice more, stress less, and hopefully pass their exams.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
