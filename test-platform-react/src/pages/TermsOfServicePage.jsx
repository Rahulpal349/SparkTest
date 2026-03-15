import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service - SparkTest';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page-wrapper">
      <Header />
      
      <section className="legal-hero">
        <div className="container">
          <span className="legal-badge">Legal Documentation</span>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">
            Last updated: October 24, 2023. Please review these terms carefully as they govern your use of the SparkTest platform.
          </p>
        </div>
      </section>

      <main className="legal-container">
        <p className="legal-intro">
          Welcome to SparkTest. By accessing our platform, website, or services, you agree to comply with and be bound by the following terms and conditions. These terms apply to all visitors, users, and others who access or use the Service.
        </p>

        <div className="legal-section-list">
          <div className="legal-item">
            <div className="legal-number">1</div>
            <div className="legal-item-content">
              <h3>Acceptance of Terms</h3>
              <p>
                By creating an account, subscribing to our services, or simply browsing the SparkTest platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you are entering into these terms on behalf of an academic institution or company, you represent that you have the authority to bind such entity.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">2</div>
            <div className="legal-item-content">
              <h3>User Accounts</h3>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">3</div>
            <div className="legal-item-content">
              <h3>Intellectual Property</h3>
              <p>
                The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of SparkTest and its licensors. Our intellectual property may not be used in connection with any product or service without the prior written consent of SparkTest.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">4</div>
            <div className="legal-item-content">
              <h3>Limitations of Liability</h3>
              <p>
                In no event shall SparkTest, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </div>
          </div>

          <div className="legal-item">
            <div className="legal-number">5</div>
            <div className="legal-item-content">
              <h3>Termination</h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>
          </div>
        </div>

        <div className="legal-cta-card">
          <div className="legal-cta-header">
            <div className="legal-cta-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2>Questions about our terms?</h2>
          </div>
          <p>
            Our legal team is here to help you understand how our platform works. If you have any concerns regarding these terms, please contact us.
          </p>
          <button className="btn btn-primary btn-large">Contact Legal Support</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
