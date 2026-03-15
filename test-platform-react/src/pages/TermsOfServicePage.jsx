import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service - SparkTest';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-main section-padding">
        <div className="container narrow-container">
          <h1 className="legal-title">Terms of Service – SparkTest</h1>
          <p className="legal-updated">Last Updated: 15 March 2026</p>

          <section className="legal-section">
            <p>Welcome to SparkTest, operated by SpeakTest. By accessing or using our platform, you agree to the following terms. If you do not agree with these terms, please do not use the platform.</p>
          </section>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By using SparkTest, you agree to comply with these Terms of Service and all applicable laws.</p>
          </section>

          <section className="legal-section">
            <h2>2. Services Provided</h2>
            <p>SparkTest provides online mock tests, exam preparation tools, and performance analytics. These services are intended for educational purposes only.</p>
          </section>

          <section className="legal-section">
            <h2>3. User Accounts</h2>
            <p>Users may need to create an account to access certain features. You agree to:</p>
            <ul>
              <li>Provide accurate information</li>
              <li>Keep login credentials secure</li>
              <li>Not share your account with others</li>
            </ul>
            <p>We reserve the right to suspend accounts involved in misuse.</p>
          </section>

          <section className="legal-section">
            <h2>4. Prohibited Activities</h2>
            <p>Users must not:</p>
            <ul>
              <li>Copy or distribute test content without permission</li>
              <li>Attempt to hack or disrupt the platform</li>
              <li>Use automated bots or scraping tools</li>
              <li>Upload harmful or illegal content</li>
            </ul>
            <p>Violation may result in account suspension.</p>
          </section>

          <section className="legal-section">
            <h2>5. Intellectual Property</h2>
            <p>All content on SparkTest including questions, test structure, design, and software is the intellectual property of SpeakTest and may not be copied without permission.</p>
          </section>

          <section className="legal-section">
            <h2>6. Service Availability</h2>
            <p>We try to maintain uninterrupted service but cannot guarantee that the platform will always be available or error-free.</p>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>SparkTest is not responsible for exam results, technical issues outside our control, or loss caused by platform downtime.</p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to Terms</h2>
            <p>We may modify these Terms at any time. Continued use of the platform means you accept updated terms.</p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Information</h2>
            <p>Company Name: SpeakTest</p>
            <p>Email: <a href="mailto:sparktestbyrahul@gmail.com">sparktestbyrahul@gmail.com</a></p>
            <p>Phone: 8670464890</p>
            <p>Address: Bankura, West Bengal, India</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
