import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../context/AppContext';
import { restaurantAPI } from '../utils/api';
import Header from './Header';
import ChatBot from './ChatBot';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      setError('Failed to load restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMenu = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
        <p className="ml-4 text-lg font-medium text-gray-600">Loading delicious restaurants...</p>
      </div>
    );
  }  return (
    <div className="w-full min-h-screen">
      {/* Header with address selection for authenticated users */}
      {authState.isAuthenticated && (
        <Header 
          title="Jarvis Delivers" 
          backTo="/login" 
          backText="← Logout" 
        />
      )}

      {/* Hero Section */}
      <div className="hero-section text-center py-16 px-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Hungry? We've got you covered! 🍕
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Delicious food from your favorite restaurants, delivered fast to your door
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            Fast Delivery
          </span>
          <span className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            Fresh Food
          </span>
          <span className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            Best Prices
          </span>
        </div>
      </div>

      <div className="w-full px-8 py-8">

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Restaurants Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          🍽️ Choose Your Restaurant
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Browse through our collection of amazing restaurants
        </p>
      </div>      {/* Restaurant Grid */}
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-card cursor-pointer group"
            onClick={() => handleViewMenu(restaurant._id)}
          >{/* Restaurant Image/Header */}
            <div className="h-40 relative overflow-hidden rounded-t-lg">
              {restaurant.image ? (
                <>
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    style={{maxHeight: '160px', objectFit: 'cover'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback gradient if image fails */}
                  <div className="hidden h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">
                        {restaurant.cuisine?.includes('Italian') ? '🍝' :
                         restaurant.cuisine?.includes('Indian') ? '🍛' :
                         restaurant.cuisine?.includes('Mexican') ? '🌮' :
                         restaurant.cuisine?.includes('Japanese') ? '🍣' :
                         restaurant.cuisine?.includes('American') ? '🍔' :
                         restaurant.cuisine?.includes('Chinese') ? '🥡' :
                         restaurant.cuisine?.includes('Dessert') ? '🧁' :
                         restaurant.cuisine?.includes('BBQ') ? '🔥' :
                         restaurant.cuisine?.includes('Coffee') ? '☕' : '🍽️'}
                      </div>
                      <h3 className="text-white text-2xl font-bold text-center px-4 drop-shadow-lg">
                        {restaurant.name}
                      </h3>
                    </div>
                  </div>
                </>
              ) : (
                /* Default gradient background if no image */
                <div className="h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">
                      {restaurant.cuisine?.includes('Italian') ? '🍝' :
                       restaurant.cuisine?.includes('Indian') ? '🍛' :
                       restaurant.cuisine?.includes('Mexican') ? '🌮' :
                       restaurant.cuisine?.includes('Japanese') ? '🍣' :
                       restaurant.cuisine?.includes('American') ? '🍔' :
                       restaurant.cuisine?.includes('Chinese') ? '🥡' :
                       restaurant.cuisine?.includes('Dessert') ? '🧁' :
                       restaurant.cuisine?.includes('BBQ') ? '🔥' :
                       restaurant.cuisine?.includes('Coffee') ? '☕' : '🍽️'}
                    </div>
                    <h3 className="text-white text-2xl font-bold text-center px-4 drop-shadow-lg">
                      {restaurant.name}
                    </h3>
                  </div>
                </div>
              )}
              
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              
              {/* Restaurant name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white text-xl font-bold drop-shadow-lg">
                  {restaurant.name}
                </h3>
              </div>
              
              {/* Rating Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  ⭐ {restaurant.rating || 4.5}
                </span>
              </div>
            </div>
            
            {/* Restaurant Info */}
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-500 transition-colors">
                {restaurant.name}
              </h4>
              
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                {restaurant.description}
              </p>
                {/* Restaurant Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-500">
                    <span className="mr-1">🕒</span>
                    {restaurant.deliveryTime || '25-30 min'}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <span className="mr-1">🚚</span>
                    ${restaurant.deliveryFee || 'Free'} delivery
                  </span>
                </div>
                
                {/* Price Range */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-500">
                    <span className="mr-1">💰</span>
                    {restaurant.priceRange || '$$'} • Min: ${restaurant.minimumOrder || 15}
                  </span>
                  <span className="flex items-center text-green-600 font-medium">
                    <span className="mr-1">⭐</span>
                    {restaurant.rating || 4.5}
                  </span>
                </div>
                
                {/* Special Offers */}
                {restaurant.specialOffers && restaurant.specialOffers.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs">
                    <span className="flex items-center text-yellow-700 font-medium">
                      <span className="mr-1">🎉</span>
                      {restaurant.specialOffers[0]}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {restaurant.cuisine?.slice(0, 3).map((type, index) => (
                    <span key={index} className="badge badge-category text-xs">
                      {type}
                    </span>
                  ))}
                  <span className={`badge text-xs ${restaurant.isOpen !== false ? 'badge-available' : 'badge-unavailable'}`}>
                    {restaurant.isOpen !== false ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                className="btn-primary w-full group-hover:shadow-xl transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewMenu(restaurant._id);
                }}
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">👀</span>
                  View Menu & Order
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {restaurants.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🍽️</div>          <h3 className="text-2xl font-bold text-gray-600 mb-4">
            No restaurants available right now
          </h3>
          <p className="text-gray-500 text-lg">
            Check back later for delicious options! 🚀          </p>
        </div>
      )}
      </div>

      {/* AI Chatbot */}
      {authState.isAuthenticated && <ChatBot />}
    </div>
  );
};

export default Home;
