import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/AppContext';
import Header from './Header';

const Cart = () => {
  const { cartState, cartDispatch } = useCart();
  const navigate = useNavigate();

  const updateQuantity = (id, newQuantity) => {
    cartDispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity: newQuantity }
    });
  };

  const removeItem = (id) => {
    cartDispatch({
      type: 'REMOVE_FROM_CART',
      payload: id
    });
  };

  const getTotalPrice = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartState.items.length === 0) return;
    navigate('/checkout');
  };  return (
    <div className="min-h-screen bg-gray-50 w-full">      <Header 
        title="Your Cart" 
        backTo="/home" 
        backText="← Back to Restaurants" 
      />

      <main className="w-full px-8 py-8">
        {cartState.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Cart Items ({getTotalItems()})
              </h2>
                <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      {/* Food Item Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                            <span className="text-white text-2xl">🍽️</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-lg font-bold text-primary">
                                ₹{item.price}
                              </span>
                              <span className="text-sm text-gray-500">each</span>
                              {item.isVegetarian && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  🌿 Veg
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Quantity Controls and Total */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-600">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-800">
                              ₹{item.price * item.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total for {item.quantity} item{item.quantity > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{getTotalPrice()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₹50</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">₹{Math.round(getTotalPrice() * 0.18)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{getTotalPrice() + 50 + Math.round(getTotalPrice() * 0.18)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 btn-primary"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => navigate('/home')}
                  className="w-full mt-3 btn-secondary"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
