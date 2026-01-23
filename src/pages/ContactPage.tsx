import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Have questions or need assistance? Reach out to us using the form below or contact our support team directly.
        </p>
        <form className="contact-form">
          <div className="contact-form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="contact-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="contact-form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
        <div className="contact-contact-info">
          <h3>Support</h3>
          <p>Email: <a href="mailto:support@hoteleasee.com">support@hoteleasee.com</a></p>
          <p>Phone: +27 12 345 6789</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
