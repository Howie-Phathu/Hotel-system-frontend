import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaHotel, FaCreditCard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './BookingConfirmationPage.css';

interface BookingData {
  id: string;
  hotel_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_rooms: number;
  total_amount: string;
  currency: string;
  booking_status: string;
  payment_status: string;
  guest_details?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  hotel?: {
    id: string;
    name: string;
    address: string;
    city: string;
    contact_phone?: string;
  };
  user?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

function buildBookingFromApi(bookingData: any, bookingId: string): BookingData {
  return {
    id: String(bookingData.id ?? bookingData.booking_id ?? bookingId),
    hotel_id: String(bookingData.hotel_id ?? bookingData.hotel?.id ?? ''),
    check_in_date: bookingData.check_in_date ?? bookingData.checkInDate ?? '',
    check_out_date: bookingData.check_out_date ?? bookingData.checkOutDate ?? '',
    number_of_guests: bookingData.adults ?? bookingData.number_of_guests ?? bookingData.guests ?? 1,
    number_of_rooms: bookingData.rooms ?? bookingData.number_of_rooms ?? 1,
    total_amount: String(bookingData.total_price ?? bookingData.total_amount ?? bookingData.totalAmount ?? '0'),
    currency: bookingData.currency ?? 'ZAR',
    booking_status: bookingData.status ?? bookingData.booking_status ?? 'confirmed',
    payment_status: bookingData.payment_status ?? bookingData.paymentStatus ?? 'paid',
    hotel: {
      id: String(bookingData.hotel_id ?? bookingData.hotel?.id ?? ''),
      name: bookingData.hotel_name ?? bookingData.hotel?.name ?? 'Hotel',
      address: bookingData.address ?? bookingData.hotel?.address ?? bookingData.location ?? '',
      city: bookingData.city ?? bookingData.hotel?.city ?? bookingData.location ?? '',
      contact_phone: bookingData.contact_phone ?? bookingData.hotel?.contact_phone,
    },
    user: {
      email: bookingData.user_email ?? bookingData.user?.email ?? '',
      first_name: bookingData.user_first_name ?? bookingData.user?.first_name,
      last_name: bookingData.user_last_name ?? bookingData.user?.last_name,
    },
    guest_details: bookingData.guest_details ?? {
      name: (bookingData.user_first_name || bookingData.user?.first_name) && (bookingData.user_last_name || bookingData.user?.last_name)
        ? `${bookingData.user_first_name || bookingData.user?.first_name} ${bookingData.user_last_name || bookingData.user?.last_name}`.trim()
        : undefined,
      email: bookingData.user_email ?? bookingData.email,
      phone: bookingData.phone,
      address: bookingData.address,
    },
  };
}

function buildBookingFromState(stateData: any, bookingId: string): BookingData {
  const hotel = stateData.hotel ?? {};
  return {
    id: String(bookingId),
    hotel_id: String(stateData.hotel_id ?? hotel.id ?? ''),
    check_in_date: stateData.check_in_date ?? stateData.checkIn ?? '',
    check_out_date: stateData.check_out_date ?? stateData.checkOut ?? '',
    number_of_guests: stateData.number_of_guests ?? stateData.guests ?? stateData.adults ?? 1,
    number_of_rooms: stateData.number_of_rooms ?? stateData.rooms ?? 1,
    total_amount: String(stateData.total_amount ?? stateData.total_price ?? stateData.total ?? '0'),
    currency: stateData.currency ?? 'ZAR',
    booking_status: 'confirmed',
    payment_status: 'paid',
    hotel: {
      id: String(hotel.id ?? stateData.hotel_id ?? ''),
      name: hotel.name ?? 'Hotel',
      address: hotel.address ?? stateData.address ?? '',
      city: hotel.city ?? stateData.city ?? '',
      contact_phone: hotel.contact_phone,
    },
    user: {
      email: stateData.user_email ?? stateData.guest_details?.email ?? '',
      first_name: stateData.user?.first_name,
      last_name: stateData.user?.last_name,
    },
    guest_details: stateData.guest_details,
  };
}

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId: paramBookingId } = useParams<{ bookingId?: string }>();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  const bookingId = paramBookingId ?? location.state?.bookingId;
  const stateBookingData = location.state?.bookingData;

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      toast.error('Booking information not found');
      navigate('/hotels');
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await bookingsAPI.getById(String(bookingId));
        const raw = response.data?.booking ?? response.data ?? response.booking ?? response;
        if (raw) {
          setBooking(buildBookingFromApi(raw, bookingId));
        } else {
          throw new Error('Booking data not found in response');
        }
      } catch (error: any) {
        if (stateBookingData) {
          setBooking(buildBookingFromState(stateBookingData, bookingId));
        } else {
          toast.error(error.response?.data?.message ?? 'Failed to load booking details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, stateBookingData, navigate]);

  if (loading) {
    return (
      <div className="booking-confirmation-page">
        <div className="container">
          <div className="loading-state">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-confirmation-page">
        <div className="container">
          <div className="error-state">Booking not found</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="booking-confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Your booking has been confirmed. We've sent a confirmation email to{' '}
            <strong>{booking.guest_details?.email || booking.user?.email}</strong>
          </p>
          <div className="booking-reference">
            <span>Booking Reference:</span>
            <strong>{booking.id}</strong>
          </div>
        </div>

        <div className="confirmation-content">
          <div className="booking-details-card">
            <h2>
              <FaHotel /> Hotel Details
            </h2>
            <div className="detail-section">
              <div className="detail-item">
                <span className="detail-label">Hotel Name:</span>
                <span className="detail-value">{booking.hotel?.name || 'Hotel'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  <FaMapMarkerAlt style={{ marginRight: '5px' }} />
                  {booking.hotel?.address}, {booking.hotel?.city}
                </span>
              </div>
              {booking.hotel?.contact_phone && (
                <div className="detail-item">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{booking.hotel.contact_phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="booking-details-card">
            <h2>
              <FaCalendarAlt /> Booking Details
            </h2>
            <div className="detail-section">
              <div className="detail-item">
                <span className="detail-label">Check-in:</span>
                <span className="detail-value">{formatDate(booking.check_in_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Check-out:</span>
                <span className="detail-value">{formatDate(booking.check_out_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">
                  {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaUsers /> Guests:
                </span>
                <span className="detail-value">{booking.number_of_guests}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rooms:</span>
                <span className="detail-value">{booking.number_of_rooms}</span>
              </div>
            </div>
          </div>

          <div className="booking-details-card">
            <h2>
              <FaCreditCard /> Payment Details
            </h2>
            <div className="detail-section">
              <div className="detail-item">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value amount">
                  {booking.currency || 'ZAR'} {(() => {
                    const amount = parseFloat(String(booking.total_amount || 0));
                    return isNaN(amount) ? '0.00' : amount.toLocaleString('en-ZA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  })()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Payment Status:</span>
                <span className={`detail-value status-badge ${booking.payment_status || 'paid'}`}>
                  {(booking.payment_status || 'paid').toUpperCase()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Booking Status:</span>
                <span className={`detail-value status-badge ${booking.booking_status || 'confirmed'}`}>
                  {(booking.booking_status || 'confirmed').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="booking-details-card">
            <h2>Guest Information</h2>
            <div className="detail-section">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {booking.guest_details?.name || 
                   `${booking.user?.first_name || ''} ${booking.user?.last_name || ''}`.trim() ||
                   'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">
                  {booking.guest_details?.email || booking.user?.email || 'N/A'}
                </span>
              </div>
              {booking.guest_details?.phone && (
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{booking.guest_details.phone}</span>
                </div>
              )}
              {booking.guest_details?.address && (
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{booking.guest_details.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/hotels')}
          >
            Browse More Hotels
          </button>
          <Link to="/profile" className="btn-secondary">
            View My Bookings
          </Link>
          <button
            className="btn-download"
            onClick={() => window.print()}
          >
            Print Confirmation
          </button>
        </div>

        <div className="confirmation-footer">
          <p>
            <strong>Important:</strong> Please arrive at the hotel between 13:00 and 18:00 for check-in.
          </p>
          <p>
            If you have any questions or need to modify your booking, please contact us or use your booking reference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;

