import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHeart, FaShare, FaMapMarkerAlt, FaStar, FaWifi, FaSwimmingPool, FaCar, FaUtensils } from 'react-icons/fa';
import './HotelDetailsPage.css';
import '../components/ShareModal.css';
import '../components/ReviewsSection.css';
import HotelsPageImage from '../assets/Hotel1.jpg';
import HotelsPageImage1 from '../assets/Hotel1-1.jpg';
import HotelsPageImage2 from '../assets/Hotel1-2.jpg';

import CapitalHotelImage1 from '../assets/Capital-1.jpg';
import CapitalHotelImage2 from '../assets/Capital-2.jpg';
import CapitalHotelImage3 from '../assets/Capital-3.jpg';

import MaxHotelImage from '../assets/Max.jpg';
import SkyHotelImage from '../assets/Sky.jpg';
import PretoriaHotelImage from '../assets/Pretoria.jpg';
import PrimeHotelImage from '../assets/Prime.jpg';
import CapitalHotelImage from '../assets/Capital.jpg';

import HotelMap from '../components/HotelMap';
import ReviewsSection from '../components/ReviewsSection';
import ShareModal from '../components/ShareModal';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckIn, setCheckOut } from '@/store/slices/bookingSlice';
import { RootState } from '@/store';
import { hotelsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Helper function to get a unique default image for each hotel based on ID
const getDefaultHotelImage = (hotelId: string | number | undefined): string => {
  const defaultImages = [
    HotelsPageImage,      // Hotel1.jpg
    CapitalHotelImage,    // Capital.jpg
    MaxHotelImage,        // Max.jpg
    SkyHotelImage,        // Sky.jpg
    PretoriaHotelImage,   // Pretoria.jpg
    PrimeHotelImage,      // Prime.jpg
  ];
  
  if (!hotelId) return defaultImages[0];
  
  // Convert hotelId to a number for consistent hashing
  const idStr = String(hotelId);
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % defaultImages.length;
  return defaultImages[index];
};

// Define the structure of a single amenity object
export interface AmenityType {
  name: string;
  icon: React.ElementType; // Assuming 'icon' holds the FaReactIcon name
}

// Define the structure of a single hotel object
export interface HotelType {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  latitude: number, 
  longitude: number,
  rating: number;
  pricePerNight: number;
  images: string[];
  amenities: AmenityType[];
  policies: string[];
}

export const allHotels: HotelType[] = [
    {
      id: '1',
      name: 'Hotel Sky',
      description: 'Experience luxury and comfort at our world-class hotel located in the heart of the city. Our hotel offers exceptional service, modern amenities, and breathtaking views.',
      location: 'Qwaqwa, Free-state',
      address: '048, Mokhethi St',
      rating: 5.0,
      pricePerNight: 2000,
      images: [HotelsPageImage, HotelsPageImage1, HotelsPageImage2],
      amenities: [
        { name: 'Free WiFi', icon: FaWifi },
        { name: 'Swimming Pool', icon: FaSwimmingPool },
        { name: 'Free Parking', icon: FaCar },
        { name: 'Restaurant', icon: FaUtensils },
      ],
      policies: [
        'Check-in: 3:00 PM',
        'Check-out: 11:00 AM',
        'Cancellation: Free cancellation up to 24 hours before check-in',
        'Pet Policy: Pets allowed with additional fee',
      ],
      latitude: -28.519657, 
      longitude: 28.816808,
    },

    {
      id: '2',
      name: 'The Capital',
      description: "Discover a haven in the heart of the city at The Capital. Whether you're here for work or leisure, we've got you covered with essential amenities: a refreshing swimming pool for relaxation, a sophisticated restaurant for every meal, and free, fast Wi-Fi to keep you connected.",
      location: 'Durban, KZN',
      address: '012, Mandela St',
      rating: 4.5,
      pricePerNight: 3000,
      images: [CapitalHotelImage1, CapitalHotelImage2, CapitalHotelImage3],
      amenities: [
        { name: 'Free WiFi', icon: FaWifi },
        { name: 'Swimming Pool', icon: FaSwimmingPool },
        { name: 'Restaurant', icon: FaUtensils },
      ],
      policies: [
        'Check-in: 08:00 AM',
        'Check-out: 18:00 PM',
        'Cancellation: Free cancellation up to 24 hours before check-in',
        'Pet Policy: Pets allowed with additional fee',
      ],
      latitude: -29.8587, 
      longitude: 31.0218,
    },
  ];

const HotelDetailsPage: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const checkIn = useSelector((state: RootState) => state.bookings.checkIn);
  const checkOut = useSelector((state: RootState) => state.bookings.checkOut);
  const dispatch = useDispatch();

  const { hotelId } = useParams<{ hotelId: string }>();

  useEffect(() => {
    const loadHotel = async () => {
      if (!hotelId) {
        setError('Hotel ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        try {
          const response = await hotelsAPI.getById(hotelId);
          const hotelData = response.data || response;
          
          // Transform API hotel data to match HotelType interface
          const transformedHotel: HotelType = {
            id: hotelData.id || hotelData.hotel_id || hotelId,
            name: hotelData.name || 'Unknown Hotel',
            description: hotelData.description || hotelData.short_description || 'No description available.',
            location: hotelData.location || hotelData.city || hotelData.province || 'Location not specified',
            address: hotelData.address || hotelData.location || '',
            latitude: typeof hotelData.latitude === 'number' 
              ? hotelData.latitude 
              : (hotelData.location_coordinates?.lat) || -28.519657,
            longitude: typeof hotelData.longitude === 'number' 
              ? hotelData.longitude 
              : (hotelData.location_coordinates?.lng) || 28.816808,
            rating: typeof hotelData.rating === 'number' 
              ? hotelData.rating 
              : parseFloat(String(hotelData.rating || 0)),
            pricePerNight: typeof hotelData.price_per_night === 'number'
              ? hotelData.price_per_night
              : parseFloat(String(hotelData.price_per_night || hotelData.price || 0)),
            images: (() => {
              if (Array.isArray(hotelData.images) && hotelData.images.length > 0) {
                return hotelData.images;
              }
              if (hotelData.image) {
                return [hotelData.image];
              }
              return [getDefaultHotelImage(hotelData.id || hotelData.hotel_id || hotelId)];
            })(),
            amenities: (() => {
              if (Array.isArray(hotelData.amenities) && hotelData.amenities.length > 0) {
                return hotelData.amenities.map((a: any) => {
                  if (typeof a === 'string') {
                    return { name: a, icon: FaWifi };
                  }
                  return { name: a.name || a, icon: FaWifi };
                });
              }
              return [];
            })(),
            policies: Array.isArray(hotelData.policies) && hotelData.policies.length > 0
              ? hotelData.policies
              : [
                  'Check-in: 3:00 PM',
                  'Check-out: 11:00 AM',
                  'Cancellation: Free cancellation up to 24 hours before check-in',
                ],
          };
          
          setHotel(transformedHotel);
        } catch (apiError: any) {
          // If API fails, try mock data
          console.log('API fetch failed, trying mock data:', apiError);
          const mockHotel = allHotels.find(h => h.id === hotelId || h.id === String(hotelId));
          
          if (mockHotel) {
            setHotel(mockHotel);
          } else {
            setError('Hotel not found');
            toast.error('Hotel not found');
          }
        }
      } catch (err: any) {
        console.error('Error loading hotel:', err);
        setError('Failed to load hotel details');
        toast.error('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="hotel-details-page">
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading hotel details...</div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hotel-details-page">
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Hotel Not Found</h2>
          <p>{error || 'The hotel you are looking for does not exist.'}</p>
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

  const hotelUrl = `${window.location.origin}/hotels/${hotel.id}`;


  return (
    <div className="hotel-details-page">
      <div className="container">
        {/* Hotel Header */}
        <div className="hotel-header">
          <div className="hotel-title-section">
            <h1 className="hotel-name">{hotel.name}</h1>
            <div className="hotel-location">
              <FaMapMarkerAlt />
              <span>{hotel.location}</span>
            </div>
            <div className="hotel-rating">
              <FaStar />
              <span>{
                (() => {
                  const ratingValue = hotel.rating;
                  if (ratingValue == null) return 'N/A';
                  const numRating = typeof ratingValue === 'number' 
                    ? ratingValue 
                    : parseFloat(String(ratingValue));
                  return !isNaN(numRating) ? numRating.toFixed(1) : 'N/A';
                })()
              }</span>
              <span className="rating-text">{
                (() => {
                  const ratingValue = hotel.rating;
                  if (ratingValue == null) return '';
                  const numRating = typeof ratingValue === 'number' 
                    ? ratingValue 
                    : parseFloat(String(ratingValue));
                  if (isNaN(numRating)) return '';
                  if (numRating >= 4.5) return 'Excellent';
                  if (numRating >= 4.0) return 'Very Good';
                  if (numRating >= 3.5) return 'Good';
                  if (numRating >= 3.0) return 'Fair';
                  return 'Average';
                })()
              }</span>
            </div>
          </div>
          <div className="hotel-actions">
            <button className="action-btn favorite">
              <FaHeart />
              Save
            </button>
            <button className="action-btn share" onClick={() => setShowShareModal(true)}>
              <FaShare />
              Share
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        {hotel.images && hotel.images.length > 0 ? (
          <div className="image-gallery">
            <div className="main-image">
              <img src={hotel.images[0]} alt={hotel.name} />
            </div>
            {hotel.images.length > 1 && (
              <div className="thumbnail-images">
                {hotel.images.slice(1).map((image, index) => (
                  <img key={index} src={image} alt={`${hotel.name} ${index + 2}`} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="image-gallery">
            <div className="main-image">
              <img src={getDefaultHotelImage(hotel.id)} alt={hotel.name} />
            </div>
          </div>
        )}

        {/* Hotel Info */}
        <div className="hotel-content">
          <div className="hotel-main-info">
            <div className="description-section">
              <h2>About this hotel</h2>
              <p>{hotel.description}</p>
            </div>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="amenities-section">
                <h2>Hotel amenities</h2>
                <div className="amenities-grid">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      {typeof amenity === 'object' && amenity.icon ? (
                        <>
                          <amenity.icon />
                          <span>{amenity.name}</span>
                        </>
                      ) : (
                        <span>{typeof amenity === 'string' ? amenity : amenity.name || 'Amenity'}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hotel.policies && hotel.policies.length > 0 && (
              <div className="policies-section">
                <h2>Hotel policies</h2>
                <ul className="policies-list">
                  {hotel.policies.map((policy, index) => (
                    <li key={index}>{policy}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="map-section" style={{ padding: '20px 0' }}>
              <h2 style={{marginLeft: 20}}>Location</h2>
              <HotelMap 
                    latitude={hotel.latitude} 
                    longitude={hotel.longitude} 
                    name={hotel.name}
                />
                <p className="address-display">
                    <FaMapMarkerAlt /> {hotel.address}, {hotel.location}
                </p>
            </div>

            <div className="reviews-section-wrapper" style={{ padding: '20px 0' }}>
              <ReviewsSection hotelId={hotel.id} />
            </div>

          </div>

          <div className="booking-card">
            <div className="price-section">
              <div className="price">
                <span className="amount">R{hotel.pricePerNight}</span>
                <span className="unit">/night</span>
              </div>
              <div className="price-note">Prices may vary by date</div>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label>Check-in</label>
                <input
                 type="date"
                 className="form-input"
                 value={checkIn}
                 onChange={e => dispatch(setCheckIn(e.target.value))}
                 />
              </div>
              <div className="form-group">
                <label>Check-out</label>
                <input 
                 type="date" 
                 className="form-input"
                 value={checkOut}
                 onChange={e => dispatch(setCheckOut(e.target.value))}
                 />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <select className="form-input">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3+ Guests</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rooms</label>
                <select className="form-input">
                  <option>1 Room</option>
                  <option>2 Rooms</option>
                  <option>3+ Rooms</option>
                </select>
              </div>
              <Link to={`/booking/${hotel.id}`} className="book-btn">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        hotelName={hotel.name}
        hotelUrl={hotelUrl}
      />
    </div>
  );
};

export default HotelDetailsPage;

