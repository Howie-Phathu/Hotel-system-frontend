import React from 'react';
import './HelpCenterPage.css';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="help-center-page">
      <div className="help-container">
        <h1>Help Center</h1>
        <p>
          Find answers to common questions about booking, payments, and more.
        </p>
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How do I book a hotel?</h3>
            <p>Go to the search page, enter your destination and dates, then select your preferred hotel and book.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel my booking?</h3>
            <p>Yes, you can cancel your booking from your profile page under the Bookings tab, subject to cancellation policies.</p>
          </div>
          <div className="faq-item">
            <h3>How do I contact support?</h3>
            <p>Visit the Contact page or email support@hoteleasee.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
