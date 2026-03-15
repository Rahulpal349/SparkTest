import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy - SparkTest';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page-wrapper">
      <Header />
      
      <section className="legal-hero">
        <div className="container">
          <span className="legal-badge">Legal Documentation</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">
            Last updated: October 24, 2023. We are committed to protecting your personal information and your right to privacy.
          </p>
        </div>
      </section>

      <main className="legal-container">
        <p className="legal-intro">
          When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.
        </p>

        <div className="legal-section-list">
          <div className="legal-item">
            <div className="legal-number">1</div>
            <div className="legal-item-content">
              <h3>Information We Collect</h3>
              <p>
                We collect personal information that you voluntarily provide to us when registering at the Service Expressing an interest in obtaining information about us or our products and services, when participating in activities on the Service or otherwise contacting us.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">2</div>
            <div className="legal-item-content">
              <h3>How We Use Your Information</h3>
              <p>
                We use personal information collected via our Service for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">3</div>
            <div className="legal-item-content">
              <h3>Data Security</h3>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">4</div>
            <div className="legal-item-content">
              <h3>Cookies and Tracking</h3>
              <p>
                We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">5</div>
            <div className="legal-item-content">
              <h3>Changes to the Policy</h3>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
              </p>
            </div>
          </div>
        </div>

        <div className="legal-cta-card">
          <div className="legal-cta-header">
            <div className="legal-cta-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h2>Questions about your privacy?</h2>
          </div>
          <p>
            If you have questions or comments about this notice, you may email us at sparktestbyrahul@gmail.com or by post to our office in West Bengal.
          </p>
          <button className="btn btn-primary btn-large">Contact Privacy Team</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
