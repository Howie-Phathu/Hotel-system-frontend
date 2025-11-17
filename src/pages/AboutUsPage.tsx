import React from 'react';
import './AboutUsPage.css';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-page">
      <div className="container">
        <h1>About Us</h1>
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At HotelEasee, our mission is to provide seamless hotel booking experiences that connect travelers with their perfect stays.
            We strive for excellence in customer satisfaction through innovative technology and personalized service.
          </p>
        </section>
        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team is composed of passionate professionals dedicated to making your travel planning easy and enjoyable. From software engineers to customer support, we work hand-in-hand to bring you the best.
          </p>
        </section>
        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Wide range of hotels with verified reviews</li>
            <li>User-friendly interface with a smooth booking process</li>
            <li>24/7 customer support and assistance</li>
            <li>Secure and flexible payment options</li>
          </ul>
        </section>
        <section className="about-section">
          <h2>Contact</h2>
          <p>
            For inquiries, support, or feedback, reach out to us at <a href="mailto:support@hoteleasee.com">support@hoteleasee.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
