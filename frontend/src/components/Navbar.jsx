import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart, useAddress } from '../context/AppContext';
import { addressAPI } from '../utils/api';

const Navbar = () => {
  const { authState, logout } = useAuth();
  const { cartState } = useCart();
  const { addressState, addressDispatch } = useAddress();
  const navigate = useNavigate();

  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate total items in cart
  const totalItems = cartState.items.reduce((total, item) => total + item.quantity, 0);

  // Fetch user addresses when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && addressState.addresses.length === 0) {
      fetchAddresses();
    }
  }, [authState.isAuthenticated]);

  const fetchAddresses = async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await addressAPI.getAll();
      addressDispatch({
        type: 'SET_ADDRESSES',
        payload: response.data
      });
      
      // Set first address as selected if none selected
      if (response.data.length > 0 && !addressState.selectedAddress) {
        addressDispatch({
          type: 'SELECT_ADDRESS',
          payload: response.data[0]
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    addressDispatch({
      type: 'SELECT_ADDRESS',
      payload: address
    });
    setShowAddressDropdown(false);
  };

  const handleLogout = () => {
    logout();
    addressDispatch({ type: 'SET_ADDRESSES', payload: [] });
    addressDispatch({ type: 'SELECT_ADDRESS', payload: null });
    navigate('/login');
  };
  return (
    <>      <nav className="navbar sticky top-0 z-50 px-4 py-4 mb-6">
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Link to="/home" className="navbar-brand flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🍕</span>
            </div>
            <span>Jarvis Delivers</span>
          </Link>

          {/* Right Side Controls - Positioned at far right */}
          {authState.isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Address Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                  className="flex items-center justify-between px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 border-3 text-base"
                  style={{
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                    borderColor: '#ff6b6b',
                    boxShadow: '0 20px 40px rgba(255, 154, 158, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                    minHeight: '48px',
                    minWidth: '280px'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl animate-pulse">📍</span>
                    <div className="text-left">
                      {loading ? (
                        <span className="text-purple-800 font-bold text-base">🔄 Loading addresses...</span>
                      ) : addressState.selectedAddress ? (
                        <>
                          <div className="text-base font-bold text-purple-900 truncate max-w-48">
                            {addressState.selectedAddress.label || 'Address'}
                          </div>
                          <div className="text-sm text-purple-700 truncate max-w-48 font-medium">
                            {addressState.selectedAddress.street}, {addressState.selectedAddress.city}
                          </div>
                        </>
                      ) : (
                        <span className="text-purple-800 text-base font-bold">📍 Select delivery address</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xl text-purple-700 animate-bounce">▼</span>
                </button>

                {/* Address dropdown */}
                {showAddressDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto w-80">
                    {addressState.addresses.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-gray-500 mb-2">No addresses found</p>
                        <button
                          onClick={() => {
                            setShowAddressDropdown(false);
                            navigate('/addresses');
                          }}
                          className="text-white font-bold text-base px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 hover:-rotate-1"
                          style={{
                            background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 15px 35px rgba(132, 250, 176, 0.4)',
                            minWidth: '160px',
                            height: '48px'
                          }}
                        >
                          🏠 Add New Address
                        </button>
                      </div>
                    ) : (
                      <>
                        {addressState.addresses.map((address) => (
                          <button
                            key={address._id}
                            onClick={() => handleAddressSelect(address)}
                            className={`w-full p-4 text-left transition-all duration-300 rounded-xl border-2 my-1 shadow-lg hover:shadow-xl transform hover:scale-102 ${
                              addressState.selectedAddress?._id === address._id 
                                ? 'border-pink-400 shadow-pink-200' 
                                : 'border-transparent hover:border-orange-300'
                            }`}
                            style={{
                              background: addressState.selectedAddress?._id === address._id 
                                ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
                                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-xl mt-1">📍</span>
                              <div className="flex-1">
                                <div className="text-base font-bold text-gray-800">
                                  {address.label || 'Address'}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                  {address.street}, {address.city}, {address.state} {address.zipCode}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        <div className="p-4 border-t-2 border-gray-200">
                          <button
                            onClick={() => {
                              setShowAddressDropdown(false);
                              navigate('/addresses');
                            }}
                            className="text-white font-bold text-base px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-1"
                            style={{
                              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                              border: '2px solid rgba(255,255,255,0.3)',
                              boxShadow: '0 15px 35px rgba(132, 250, 176, 0.4)',
                              minWidth: '160px',
                              height: '48px'
                            }}
                          >
                            ➕ Add New Address
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
                {/* Cart Button with Red Gradient */}
              <Link 
                to="/cart" 
                className="relative text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-2 hover:rotate-1 flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 25px 50px rgba(220, 38, 38, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                  minWidth: '120px',
                  height: '48px'
                }}
              >
                <span className="text-xl">🛒</span>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-black border-2 border-white shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>              {/* User Profile & Logout */}
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium text-sm bg-black bg-opacity-20 px-3 py-2 rounded-lg">
                  👋 {authState.user?.name || authState.user?.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-white px-6 py-3 rounded-xl transition-all duration-300 font-bold text-base shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 25%, #dc2626 50%, #ef4444 75%, #f87171 100%)',
                    border: '3px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 25px 50px rgba(127, 29, 29, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
                    minWidth: '130px',
                    height: '50px'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                  </span>
                  {/* Hover effect overlay */}                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {showAddressDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAddressDropdown(false)}
        />
      )}
    </>
  );
};

export default Navbar;
