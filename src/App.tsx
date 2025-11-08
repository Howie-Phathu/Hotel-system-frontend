// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './store/'
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import FavoritesPage from './pages/FavoritesPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './middleware/ProtectedRoute';
import './App.css';
import PaymentMethodPage from './pages/PaymentMethodPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <div className="App">
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
                    <Route path="hotels" element={<ErrorBoundary><HotelsPage /></ErrorBoundary>} />
                    <Route path="hotels/:hotelId" element={<ErrorBoundary><HotelDetailsPage /></ErrorBoundary>} />
                    <Route path="booking/:hotelId" element={<ErrorBoundary><BookingPage /></ErrorBoundary>} />
                    <Route path="profile" element={<ErrorBoundary><ProtectedRoute><ProfilePage /></ProtectedRoute></ErrorBoundary>} />
                    <Route path="login" element={<ErrorBoundary><LoginPage /></ErrorBoundary>} />
                    <Route path="forgot-password" element={<ErrorBoundary><ForgotPasswordPage /></ErrorBoundary>} />
                    <Route path="favorites" element={<ErrorBoundary><ProtectedRoute><FavoritesPage /></ProtectedRoute></ErrorBoundary>} />
                    <Route path='payment/:hotelId' element={<ErrorBoundary><ProtectedRoute><PaymentMethodPage /></ProtectedRoute></ErrorBoundary>} />
                    <Route path="booking-confirmation" element={<ErrorBoundary><ProtectedRoute><BookingConfirmationPage /></ProtectedRoute></ErrorBoundary>} />
                    <Route path="notifications" element={<ErrorBoundary><ProtectedRoute><NotificationsPage /></ProtectedRoute></ErrorBoundary>} />
                    <Route path="register" element={<ErrorBoundary><RegisterPage /></ErrorBoundary>} />
                    <Route path="admin/*" element={<ErrorBoundary><ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute></ErrorBoundary>} />
                    <Route path="*" element={<ErrorBoundary><NotFoundPage /></ErrorBoundary>} />
                  </Route>
                </Routes>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </div>
            </Router>
          </ErrorBoundary>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;

