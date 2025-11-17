import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'; 
import { RootState } from '../store/index'; 
import { FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';
import { userAPI, hotelsAPI } from '../services/api';
import toast from 'react-hot-toast';
import './HotelsPage.css';
import HotelsPageImage from '../assets/Hotel1.jpg';
import HotelsPageImage1 from '../assets/Capital.jpg';
import HotelsPageImage2 from '../assets/Max.jpg';
import HotelsPageImage3 from '../assets/Sky.jpg';
import HotelsPageImage4 from '../assets/Pretoria.jpg';
import HotelsPageImage5 from '../assets/Prime.jpg';

// Helper function to get a unique default image for each hotel based on ID
const getDefaultHotelImage = (hotelId: string | number | undefined): string => {
  const defaultImages = [
    HotelsPageImage,   // Hotel1.jpg
    HotelsPageImage1,  // Capital.jpg
    HotelsPageImage2,  // Max.jpg
    HotelsPageImage3,  // Sky.jpg
    HotelsPageImage4,  // Pretoria.jpg
    HotelsPageImage5,  // Prime.jpg
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

const FavoritesPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [favoriteHotels, setFavoriteHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites();
      const favoritesData = response.data?.favorites || response.favorites || [];
      
      if (favoritesData.length === 0) {
        setFavoriteHotels([]);
        setLoading(false);
        return;
      }

      // Fetch hotel details for each favorite
      const hotelPromises = favoritesData.map(async (favorite: any) => {
        const hotelId = favorite.hotel_id || favorite.hotelId || favorite.id;
        try {
          const hotelResponse = await hotelsAPI.getById(hotelId);
          return hotelResponse.data || hotelResponse;
        } catch (error) {
          console.error(`Failed to load hotel ${hotelId}:`, error);
          return null;
        }
      });

      const hotels = await Promise.all(hotelPromises);
      setFavoriteHotels(hotels.filter((hotel) => hotel !== null));
    } catch (error: any) {
      console.error('Failed to load favorites:', error);
      toast.error('Failed to load favorite hotels');
      setFavoriteHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, location.pathname, loadFavorites]); // Reload when navigating to this page

  const handleRemoveFavorite = async (hotelId: string) => {
    try {
      await userAPI.removeFavorite(hotelId);
      setFavoriteHotels(prev => prev.filter(hotel => {
        const id = hotel.id?.toString() || hotel.hotel_id?.toString();
        return id !== hotelId;
      }));
      toast.success('Removed from favorites');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove favorite');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>Your Favorite Hotels</h1>
        <p className="no-favorites-message">
          Please login to view your favorite hotels. 💔
        </p>
        <Link to="/login" className="btn-browse-hotels">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Your Favorite Hotels</h1>
        <p>Loading your favorites...</p>
      </div>
    );
  }

  if (favoriteHotels.length === 0) {
    return (
      <div className="container">
        <h1>Your Favorite Hotels</h1>
        <p className="no-favorites-message">
          You haven't added any hotels to your favorites yet. 💔
        </p>
        <Link to="/hotels" className="btn-browse-hotels">Browse Hotels</Link>
      </div>
    );
  }

  return (
    <div className="hotels-page">
      <div className="container">
           
        <div className="hotels-heading" style={{marginBottom: 20}}>
            <h2>
                Your Favorite Hotels ({favoriteHotels.length})
            </h2>
        </div>

          <div className="hotels-grid">
            {favoriteHotels.map((hotel) => {
              const hotelId = hotel.id?.toString() || hotel.hotel_id?.toString();
              const hotelName = hotel.name || 'Unknown Hotel';
              const hotelLocation = hotel.location || hotel.city || hotel.province || 'Location not specified';
              const hotelRating = hotel.rating || 0;
              const hotelPrice = hotel.price_per_night || hotel.price || 0;
              const hotelImages = Array.isArray(hotel.images) && hotel.images.length > 0 
                ? hotel.images 
                : hotel.image 
                  ? [hotel.image] 
                  : [];

              return (
                <div key={hotelId} className="hotel-card">
                  <div className="hotel-image">
                    <img 
                      src={hotelImages.length > 0 ? hotelImages[0] : getDefaultHotelImage(hotelId)} 
                      alt={hotelName} 
                    />
                    <button 
                      className="favorite-btn active"
                      onClick={() => handleRemoveFavorite(hotelId)}
                      title="Remove from favorites"
                    >
                      <FaHeart />
                    </button>
                  </div>
                  
                  <div className="hotel-info">
                    <div className="hotel-rating">
                      <FaStar />
                      <span>{
                        (() => {
                          const ratingValue = hotelRating;
                          if (ratingValue == null) return 'N/A';
                          const numRating = typeof ratingValue === 'number' 
                            ? ratingValue 
                            : parseFloat(String(ratingValue));
                          return !isNaN(numRating) ? numRating.toFixed(1) : 'N/A';
                        })()
                      }</span>
                    </div>

                    <h3 className="hotel-name">{hotelName}</h3>

                    <p className="hotel-location">
                      <FaMapMarkerAlt />
                      {hotelLocation}
                    </p>

                    {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                      <div className="hotel-amenitiese">
                        {hotel.amenities.slice(0, 4).map((amenity: string, index: number) => (
                          <span key={index} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="hotel-footer">
                      <Link to={`/hotels/${hotelId}`} className="view-btn" style={{background: '#5CC1FF'}}>
                        View Details
                      </Link>
                      <div className="hotel-price">
                        <span className="price" style={{color: '#333'}}>
                          <small>R {hotelPrice}</small>
                        </span>
                        <span className="price-unit">per night</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default FavoritesPage;