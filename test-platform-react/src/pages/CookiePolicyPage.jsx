import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CookiePolicyPage() {
  useEffect(() => {
    document.title = 'Cookie Policy - SparkTest';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page-wrapper">
      <Header />
      
      <section className="legal-hero">
        <div className="container">
          <span className="legal-badge">Legal Documentation</span>
          <h1 className="legal-title">Cookie Policy</h1>
          <p className="legal-updated">
            Last updated: October 24, 2023. This policy explains how SparkTest uses cookies and similar technologies.
          </p>
        </div>
      </section>

      <main className="legal-container">
        <p className="legal-intro">
          This Cookie Policy explains what cookies are and how we use them. You should read this policy to understand what type of cookies we use, the information we collect using cookies and how that information is used.
        </p>

        <div className="legal-section-list">
          <div className="legal-item">
            <div className="legal-number">1</div>
            <div className="legal-item-content">
              <h3>What are Cookies?</h3>
              <p>
                Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">2</div>
            <div className="legal-item-content">
              <h3>How We Use Cookies</h3>
              <p>
                As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">3</div>
            <div className="legal-item-content">
              <h3>Types of Cookies we use</h3>
              <p>
                We use **Essential** cookies for user authentication and security, **Analytical** cookies to understand visitor interactions, and **Functional** cookies to remember user preferences like language or theme settings.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">4</div>
            <div className="legal-item-content">
              <h3>Controlling Cookies</h3>
              <p>
                You can manage your cookies preferences by clicking on the "Settings" button and enabling or disabling the cookie categories on the popup according to your preferences. In addition to this, different browsers provide different methods to block and delete cookies used by websites.
              </p>
            </div>
          </div>
        </div>

        <div className="legal-cta-card">
          <div className="legal-cta-header">
            <div className="legal-cta-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <h2>Need more details?</h2>
          </div>
          <p>
            If you want to know more about our data practices, please visit our full Privacy Policy or contact our support team.
          </p>
          <button className="btn btn-primary btn-large">Manage Preferences</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
