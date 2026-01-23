import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import './RegisterPage.css';
import HotelImage from '../assets/Capital.jpg';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Split name into first and last
      const nameParts = firstName.trim().split(' ');
      const first = nameParts[0] || '';
      const last = nameParts.slice(1).join(' ') || lastName;

      const response = await authAPI.register({
        email,
        password,
        first_name: first,
        last_name: last || undefined,
      });

      const { user, token } = response.data;
      
      // Format user data for Redux
      const formattedUser = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
      };

      dispatch(loginSuccess({ user: formattedUser, token }));
      toast.success('Registration successful!');
      
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/hotels');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-container">
          <div className="register-form">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join HotelEase today</p>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    id="firstName"
                    className="form-input"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setError(null);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    id="lastName"
                    className="form-input"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setError(null);
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  {/* <FaEnvelope className="input-icon" /> */}
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  {/* <FaLock className="input-icon" /> */}
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  {/* <FaLock className="input-icon" /> */}
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="error-message">{error}</p>
              )}

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the{' '}
                  <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" className="register-btn" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          <div className="register-image">
            <img src={HotelImage} alt="Luxury hotel room" />
            <div className="image-overlay">
              <h2>Start Your Journey</h2>
              <p>
                Join thousands of travelers who trust HotelEase for their
                accommodation needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
