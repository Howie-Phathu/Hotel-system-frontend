import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { RootState } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import './LoginPage.css';
import HotelImage from '../assets/Capital.jpg'

const LoginPage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    dispatch(loginStart());
    try {
      const response = await authAPI.login(email, password);
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
      
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
        toast.success('Welcome Admin!');
      } else {
        navigate('/hotels');
        toast.success('Login successful!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
      
      // Set field-specific errors
      if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('user')) {
        setEmailError(errorMessage);
      } else if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('credential')) {
        setPasswordError(errorMessage);
      }
    }
  };



  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-form">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${emailError ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setEmailError('');
                      if (authState.error) dispatch(loginFailure(''));
                    }}
                    onBlur={() => validateEmail(email)}
                    required
                  />
                </div>
                {emailError && <span className="field-error">{emailError}</span>}
              </div>
              
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setPasswordError('');
                      if (authState.error) dispatch(loginFailure(''));
                    }}
                    onBlur={() => validatePassword(password)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && <span className="field-error">{passwordError}</span>}
              </div>
              
              {authState.error && !emailError && !passwordError && (
                <div className="error-message">{authState.error}</div>
              )}
              <button type="submit" className="login-btn" disabled={authState.isLoading}>
                {authState.isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="signup-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>

          <div className="login-image">
            <img src={HotelImage} alt="Luxury hotel room" />
            <div className="image-overlay">
              <h2>Discover Amazing Hotels</h2>
              <p>Find and book the perfect accommodation for your next trip</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

