import React from 'react';
import './TermsPage.css';

const TermsPage: React.FC = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1>Terms of Service</h1>
        <p>
          By using HotelEasee, you agree to the following terms and conditions.
        </p>
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>These terms govern your use of our website and services.</p>
        </section>
        <section>
          <h2>2. User Responsibilities</h2>
          <p>You agree to provide accurate information and use the service lawfully.</p>
        </section>
        <section>
          <h2>3. Booking and Payments</h2>
          <p>All bookings are subject to availability and payment terms as specified.</p>
        </section>
        <section>
          <h2>4. Limitation of Liability</h2>
          <p>We are not liable for indirect or consequential damages arising from your use of the service.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
