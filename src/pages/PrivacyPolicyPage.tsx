import React from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect personal information such as your name, email, and booking details.</p>
        </section>
        <section>
          <h2>2. How We Use Your Information</h2>
          <p>Your information is used to process bookings, provide support, and improve our services.</p>
        </section>
        <section>
          <h2>3. Data Security</h2>
          <p>We implement security measures to protect your data from unauthorized access.</p>
        </section>
        <section>
          <h2>4. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
