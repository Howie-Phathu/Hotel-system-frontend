import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { bookingsAPI, hotelsAPI } from '../services/api';
import { allHotels, HotelType } from './HotelDetailsPage';
import toast from 'react-hot-toast';
import './BookingPage.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RootState } from '@/store';

const BookingPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const checkIn = useSelector((state: RootState) => state.bookings.checkIn);
  const checkOut = useSelector((state: RootState) => state.bookings.checkOut);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('South Africa');
  const [phoneCode, setPhoneCode] = useState('+27');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHotel = async () => {
      if (!hotelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const response = await hotelsAPI.getById(hotelId);
          const hotelData = response.data || response;
          
          // Transform API hotel data to match HotelType interface
          const transformedHotel: HotelType = {
            id: hotelData.id || hotelData.hotel_id || hotelId,
            name: hotelData.name || 'Unknown Hotel',
            description: hotelData.description || hotelData.short_description || '',
            location: hotelData.location || hotelData.city || '',
            address: hotelData.address || '',
            latitude: hotelData.latitude || -28.519657,
            longitude: hotelData.longitude || 28.816808,
            rating: typeof hotelData.rating === 'number' 
              ? hotelData.rating 
              : parseFloat(String(hotelData.rating || 0)),
            pricePerNight: hotelData.price_per_night || hotelData.price || 0,
            images: Array.isArray(hotelData.images) 
              ? hotelData.images 
              : hotelData.image 
                ? [hotelData.image] 
                : [],
            amenities: Array.isArray(hotelData.amenities)
              ? hotelData.amenities.map((a: string) => ({ name: a, icon: FaMapMarkerAlt }))
              : [],
            policies: hotelData.policies || [],
          };
          
          setHotel(transformedHotel);
        } catch (apiError: any) {
          // If API fails, try mock data
          console.log('API fetch failed, trying mock data:', apiError);
          const mockHotel = allHotels.find(h => h.id === hotelId || h.id === String(hotelId));
          
          if (mockHotel) {
            setHotel(mockHotel);
          } else {
            toast.error('Hotel not found');
          }
        }
      } catch (err: any) {
        console.error('Error loading hotel:', err);
        toast.error('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading hotel details...</div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="booking-page">
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Hotel Not Found</h2>
          <p>The hotel you are looking for does not exist.</p>
          <Link to="/hotels" style={{ 
            display: 'inline-block', 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  // Calculate nights if dates set
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 3600 * 24)
          )
        )
      : 0;

  // Price calculations
  const pricePerNight = typeof hotel.pricePerNight === 'number' 
    ? hotel.pricePerNight 
    : parseFloat(String(hotel.pricePerNight || 0));
  const originalPrice = nights * pricePerNight;
  // Example discount: fixed 200 if nights > 3 just for illustration
  const discount = nights > 3 ? 200 : 0;
  const totalPrice = Math.max(0, originalPrice - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut || !name || !email || !phoneNumber) {
      setError('Please fill all required fields and select dates.');
      toast.error('Please fill all required fields');
      return;
    }
    
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in.');
      toast.error('Check-out must be after check-in');
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      // Create booking via API
      const bookingResponse = await bookingsAPI.create({
        hotel_id: hotel.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: numberOfGuests,
        number_of_rooms: numberOfRooms,
        guest_details: {
          name,
          email,
          phone: `${phoneCode}${phoneNumber}`,
          address,
        },
      });

      // Handle different response formats
      const booking = bookingResponse.booking || bookingResponse.data?.booking || bookingResponse.data || bookingResponse;
      
      if (!booking || !booking.id) {
        throw new Error('Invalid booking response: missing booking ID');
      }
      
      // Navigate to payment page with booking data
      navigate(`/payment/${hotel.id}`, {
        state: {
          bookingId: booking.id,
          bookingData: {
            ...booking,
            hotel: {
              id: hotel.id,
              name: hotel.name,
            },
            check_in_date: checkIn,
            check_out_date: checkOut,
            number_of_guests: numberOfGuests,
            number_of_rooms: numberOfRooms,
            total_amount: totalPrice,
            currency: 'ZAR',
          },
        },
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-page-container">
      <div className="steps-indicator">
        <div className="step completed">1 Your selection</div>
        <div className="step current">2 Your details</div>
        <div className="step">3 Finish Booking</div>
      </div>
      <div className="booking-main">
        {/* Left pane: selection summary */}
        <div className="selection-summary">
          <div className="hotel-card">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="hotel-image"
            />
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p className="hotel-location">
                <span role="img" aria-label="location">
                  <FaMapMarkerAlt/>
                </span>{' '}
                {hotel.address}, {hotel.location}
              </p>
              <div className="hotel-amenities">
                {/* Example: Static or create icons + labels */}
                <div className="amenities-grid">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <amenity.icon />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
              </div>
              <p className="rating-text">Excellent location – {hotel.rating}</p>
            </div>
          </div>

          <div className="price-summary">
            <h4>Your price summary</h4>
            <div className="price-row">
              <span>Original price ({nights} night{nights !== 1 ? 's' : ''})</span>
              <span>ZAR {originalPrice.toLocaleString()}</span>
            </div>
            <div className="price-row discount">
              <span>Discount</span>
              <span>ZAR -{discount.toLocaleString()}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>
                ZAR {totalPrice.toLocaleString()}
                <br />
                <small>Includes taxes & charges</small>
              </span>
            </div>
          </div>

          <div className="booking-details-summary">
            <h4>Your booking details</h4>
            <div className="dates-row">
              <div>
                <strong>Check in</strong>
                <div>{checkIn ? new Date(checkIn).toDateString() : '-'}</div>
                <small>From 13:00</small>
              </div>
              <div>
                <strong>Check out</strong>
                <div>{checkOut ? new Date(checkOut).toDateString() : '-'}</div>
                <small>Until 18:00</small>
              </div>
            </div>
            <p>Total length of stay: {nights} night{nights !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Right pane: Enter your details form */}
        <div className="details-form">
          <h3>Enter your details</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                placeholder="Enter Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Address
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>

            <label>
              Number of Guests
              <input
                type="number"
                placeholder="Number of guests"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </label>

            <label>
              Number of Rooms
              <input
                type="number"
                placeholder="Number of rooms"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </label>

            <label>
              Country
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option>South Africa</option>
                <option>Other</option>
              </select>
            </label>

            <label className="phone-input">
              Phone Number
              <div className="phone-wrapper">
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  required
                >
                  <option value="+27">ZA +27</option>
                  <option value="+1">US +1</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </label>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="next-btn" disabled={isLoading}>
              {isLoading ? 'Creating Booking...' : 'Continue to Payment &rarr;'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
