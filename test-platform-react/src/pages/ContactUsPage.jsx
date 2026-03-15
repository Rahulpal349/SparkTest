import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactUsPage() {
  useEffect(() => {
    document.title = 'Contact Us - SparkTest';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-main section-padding">
        <div className="container narrow-container centered-text">
          <h1 className="legal-title">Contact Us – SparkTest</h1>
          <p className="legal-subtitle">If you have any questions, suggestions, or support requests, feel free to contact us.</p>

          <div className="contact-card-grid">
            <div className="contact-card">
              <div className="contact-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h3>Email</h3>
              <p><a href="mailto:sparktestbyrahul@gmail.com">sparktestbyrahul@gmail.com</a></p>
            </div>

            <div className="contact-card">
              <div className="contact-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3>Phone</h3>
              <p>8670464890</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3>Office Address</h3>
              <p>Bankura, West Bengal, India</p>
            </div>
          </div>

          <div className="support-info-section">
            <h2>Support</h2>
            <p>For help with account issues, mock test problems, technical support, or feedback and suggestions, please email us and our team will respond as soon as possible.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
