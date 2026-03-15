import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy - SparkTest';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-main section-padding">
        <div className="container narrow-container">
          <h1 className="legal-title">Privacy Policy – SparkTest</h1>
          <p className="legal-updated">Last Updated: 15 March 2026</p>

          <section className="legal-section">
            <p>Welcome to SparkTest, operated by SpeakTest, located in Bankura, West Bengal, India. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
          </section>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>When you use SparkTest, we may collect the following information:</p>
            <h3>Personal Information</h3>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Account login details</li>
            </ul>
            <h3>Usage Information</h3>
            <ul>
              <li>Mock test performance and results</li>
              <li>Time spent on tests</li>
              <li>Device information</li>
              <li>Browser type and IP address</li>
            </ul>
            <h3>Cookies</h3>
            <p>We may use cookies to improve user experience, analyze traffic, and personalize content.</p>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide mock tests and educational services</li>
              <li>Improve our platform and user experience</li>
              <li>Track test performance and rankings</li>
              <li>Communicate updates or important notifications</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Data Protection</h2>
            <p>We take reasonable technical and organizational measures to protect your personal data from unauthorized access, misuse, or disclosure. However, no method of internet transmission is 100% secure.</p>
          </section>

          <section className="legal-section">
            <h2>4. Sharing of Information</h2>
            <p>We do not sell or rent your personal information. We may share information only:</p>
            <ul>
              <li>When required by law</li>
              <li>To protect our legal rights</li>
              <li>With trusted service providers helping us operate the platform</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Third-Party Services</h2>
            <p>Our platform may use third-party tools such as authentication providers, analytics services, and payment gateways. These services have their own privacy policies.</p>
          </section>

          <section className="legal-section">
            <h2>6. Children's Information</h2>
            <p>SparkTest is intended for students preparing for competitive exams. We do not knowingly collect data from children under 13 without parental consent.</p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your data. Contact us regarding privacy concerns.</p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy occasionally. Updated policies will be posted on this page.</p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>If you have questions regarding this Privacy Policy, contact us:</p>
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
