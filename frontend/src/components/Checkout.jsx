import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAddress, useAuth } from '../context/AppContext';
import { addressAPI, orderAPI } from '../utils/api';
import Header from './Header';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: ''
  });

  const { cartState, cartDispatch } = useCart();
  const { addressState, addressDispatch } = useAddress();
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartState.items.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getAll();
      addressDispatch({
        type: 'SET_ADDRESSES',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addressAPI.create(newAddress);
      addressDispatch({
        type: 'ADD_ADDRESS',
        payload: response.data
      });
      setNewAddress({
        label: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: '',
        longitude: ''
      });
      setShowAddressForm(false);
    } catch (error) {
      setError('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const selectAddress = (address) => {
    addressDispatch({
      type: 'SELECT_ADDRESS',
      payload: address
    });
  };

  const getTotalPrice = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const deliveryFee = 50;
    const taxes = Math.round(subtotal * 0.18);
    return subtotal + deliveryFee + taxes;
  };

  const handlePlaceOrder = async () => {
    if (!addressState.selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartState.items,
        deliveryAddress: addressState.selectedAddress,
        totalAmount: getFinalTotal(),
        paymentMethod: 'cash' // For now, we'll use cash on delivery
      };

      await orderAPI.create(orderData);
      
      // Clear cart after successful order
      cartDispatch({ type: 'CLEAR_CART' });
      
      // Navigate to success page
      navigate('/order-success');
    } catch (error) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen bg-gray-50 w-full">      <Header 
        title="Checkout" 
        backTo="/cart" 
        backText="← Back to Cart" 
      />

      <main className="w-full px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Address Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Delivery Address
              </h2>

              {addressState.addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">No saved addresses found</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="btn-primary"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addressState.addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => selectAddress(address)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        addressState.selectedAddress?._id === address._id
                          ? 'border-primary bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {address.label}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        {addressState.selectedAddress?._id === address._id && (
                          <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
                  >
                    + Add New Address
                  </button>
                </div>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-4">Add New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="label"
                        placeholder="Address Label (e.g., Home, Office)"
                        value={newAddress.label}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={newAddress.zipCode}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                      >
                        Add Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {/* Food Item Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                          <span className="text-white text-sm">🍽️</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">
                              ₹{item.price} × {item.quantity}
                            </p>
                            {item.isVegetarian && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🌿
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="font-semibold text-primary">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes (18%)</span>
                  <span>₹{Math.round(getTotalPrice() * 0.18)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{getFinalTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !addressState.selectedAddress}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-all ${
                  loading || !addressState.selectedAddress
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-orange-600'
                }`}
              >
                {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
