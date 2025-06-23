import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/AppContext';
import { restaurantAPI, foodAPI } from '../utils/api';
import Header from './Header';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { cartState, cartDispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      const [restaurantResponse, foodResponse] = await Promise.all([
        restaurantAPI.getById(id),
        foodAPI.getByRestaurant(id)
      ]);
      
      setRestaurant(restaurantResponse.data);
      setFoodItems(foodResponse.data);
    } catch (error) {
      setError('Failed to load restaurant data');
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (foodItem) => {
    cartDispatch({
      type: 'ADD_TO_CART',
      payload: foodItem
    });
  };

  const getItemQuantity = (itemId) => {
    const item = cartState.items.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  const cartItemsCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header 
        title="Restaurant Menu" 
        backTo="/home" 
        backText="← Back to Restaurants" 
      />{/* Restaurant Header */}
      <div className="relative overflow-hidden restaurant-banner">
        {restaurant.image ? (
          <>
            <img 
              src={restaurant.image} 
              alt={restaurant.name}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </>
        ) : (
          <div className="bg-gradient-to-r from-orange-400 to-red-500 w-full h-full"></div>
        )}
        
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-8 text-white">
            <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">{restaurant.name}</h1>
            <p className="text-lg opacity-90 drop-shadow-md mb-3">{restaurant.description}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center">
                ⭐ {restaurant.rating || 4.5}
              </span>
              <span className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center">
                🕒 {restaurant.deliveryTime || '30-40 mins'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="w-full px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Menu</h2>
          <p className="text-gray-600">Choose from our delicious selection</p>
        </div>

        {foodItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No menu items available
            </h3>
            <p className="text-gray-500">
              This restaurant is updating their menu. Please check back later!
            </p>
          </div>
        ) : (          <div className="food-grid">
            {foodItems.map((item) => (
              <div key={item._id} className="food-item-card">
                {/* Food Item Image */}
                <div className="h-40 relative overflow-hidden rounded-t-lg">
                  {item.image ? (
                    <>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
                        style={{maxHeight: '160px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback if image fails */}
                      <div className="hidden h-40 bg-gradient-to-br from-yellow-400 to-orange-500 items-center justify-center rounded-t-lg">
                        <span className="text-white text-4xl">
                          {item.category === 'Main Course' ? '🍽️' :
                           item.category === 'Pizza' ? '🍕' :
                           item.category === 'Burger' ? '🍔' :
                           item.category === 'Dessert' ? '🧁' :
                           item.category === 'Beverage' ? '🥤' :
                           item.category === 'Sushi Roll' ? '🍣' :
                           item.category === 'Noodles' ? '🍜' :
                           item.category === 'BBQ' ? '🍖' :
                           item.category === 'Bowl' ? '🥗' :
                           item.category === 'Tacos' ? '🌮' :
                           item.category === 'Wrap' ? '🌯' :
                           item.category === 'Smoothie' ? '🥤' :
                           item.category === 'Sandwich' ? '🥪' :
                           item.category === 'Appetizer' ? '🍤' :
                           item.category === 'Sides' ? '🍟' :
                           item.category === 'Bread' ? '🥖' : '🍽️'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center rounded-t-lg">
                      <span className="text-white text-4xl">
                        {item.category === 'Main Course' ? '🍽️' :
                         item.category === 'Pizza' ? '🍕' :
                         item.category === 'Burger' ? '🍔' :
                         item.category === 'Dessert' ? '🧁' :
                         item.category === 'Beverage' ? '🥤' :
                         item.category === 'Sushi Roll' ? '🍣' :
                         item.category === 'Noodles' ? '🍜' :
                         item.category === 'BBQ' ? '🍖' :
                         item.category === 'Bowl' ? '🥗' :
                         item.category === 'Tacos' ? '🌮' :
                         item.category === 'Wrap' ? '🌯' :
                         item.category === 'Smoothie' ? '�' :
                         item.category === 'Sandwich' ? '🥪' :
                         item.category === 'Appetizer' ? '🍤' :
                         item.category === 'Sides' ? '🍟' :
                         item.category === 'Bread' ? '🥖' : '🍽️'}
                      </span>
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  {item.rating && (
                    <div className="absolute top-2 right-2">
                      <span className="rating-badge">
                        ⭐ {item.rating}
                      </span>
                    </div>
                  )}
                  
                  {/* Spice Level Badge */}
                  {item.spiceLevel && item.spiceLevel !== 'None' && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🌶️ {item.spiceLevel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Food Item Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-red-500 ml-2">
                      ${item.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Enhanced Item Details */}
                  <div className="space-y-2 mb-4">
                    {/* Dietary Info */}
                    <div className="flex flex-wrap gap-1">
                      {item.isVegetarian && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          🌱 Vegetarian
                        </span>
                      )}
                      {item.isVegan && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          🌿 Vegan
                        </span>
                      )}
                      {item.isGlutenFree && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          🌾 Gluten Free
                        </span>
                      )}
                    </div>
                    
                    {/* Nutrition & Prep Info */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center">
                        🕒 {item.preparationTime || '15 mins'}
                      </span>
                      {item.calories && (
                        <span className="flex items-center">
                          🔥 {item.calories} cal
                        </span>
                      )}
                      <span className="flex items-center">
                        🍽️ {item.servingSize || '1 portion'}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="keyword-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Section */}
                  <div className="flex items-center justify-between">
                    {getItemQuantity(item._id) > 0 ? (
                      <div className="flex items-center space-x-3">
                        <button
                          className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            cartDispatch({ type: 'REMOVE_FROM_CART', payload: item._id });
                          }}
                        >
                          -
                        </button>
                        <span className="font-bold text-lg min-w-[2rem] text-center">
                          {getItemQuantity(item._id)}
                        </span>
                        <button
                          className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        <span className="mr-1">🛒</span>
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantMenu;
