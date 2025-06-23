import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAddress } from '../context/AppContext';
import { addressAPI } from '../utils/api';
import Header from './Header';

const Addresses = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { addressState, addressDispatch } = useAddress();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  const [formData, setFormData] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: null,
    longitude: null,
    isDefault: false
  });

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [authState.isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAll();
      addressDispatch({
        type: 'SET_ADDRESSES',
        payload: response.data
      });
    } catch (error) {
      setError('Failed to load addresses');
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log form data to see what's being submitted
    console.log('Form data being submitted:', formData);    // Trim whitespace and check for empty fields
    const trimmedData = {
      label: formData.label?.trim(),
      street: formData.street?.trim(),
      city: formData.city?.trim(),
      state: formData.state?.trim(),
      zipCode: formData.zipCode?.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      isDefault: formData.isDefault
    };
    
    console.log('Trimmed form data:', trimmedData);
    
    if (!trimmedData.street || !trimmedData.city || !trimmedData.state || !trimmedData.zipCode) {
      setError('Please fill in all required fields (Street, City, State, ZIP Code)');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editingAddress) {
        const response = await addressAPI.update(editingAddress._id, trimmedData);
        addressDispatch({
          type: 'UPDATE_ADDRESS',
          payload: response.data
        });
      } else {
        const response = await addressAPI.create(trimmedData);
        addressDispatch({
          type: 'ADD_ADDRESS',
          payload: response.data
        });
      }      // Reset form
      setFormData({
        label: 'Home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: null,
        longitude: null,
        isDefault: false
      });
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      setError('Failed to save address. Please try again.');
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label || 'Home',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      isDefault: address.isDefault || false
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setLoading(true);
      await addressAPI.delete(addressId);
      addressDispatch({
        type: 'DELETE_ADDRESS',
        payload: addressId
      });
    } catch (error) {
      setError('Failed to delete address');
      console.error('Error deleting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsDefault = (address) => {
    addressDispatch({
      type: 'SELECT_ADDRESS',
      payload: address
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header 
        title="My Addresses" 
        backTo="/home" 
        backText="← Back to Home" 
      />

      <main className="w-full px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header with Add button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Delivery Addresses
              </h2>
              <p className="text-gray-600">
                Manage your saved delivery addresses
              </p>
            </div>            <button              onClick={() => {
                setShowForm(true);
                setEditingAddress(null);
                setFormData({
                  label: 'Home',
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  latitude: null,
                  longitude: null,
                  isDefault: false
                });
              }}
              className="btn-primary"
            >
              + Add New Address
            </button>
          </div>

          {/* Address Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Show validation errors */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>📝 Required fields:</strong> Please fill in Street Address, City, State, and ZIP Code to save your address.
                  </p>
                </div>                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Label *
                    </label>
                    <select
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code * <span className="text-red-500">📍</span>
                    </label>                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`form-input ${error && !formData.zipCode?.trim() ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="Enter ZIP code (e.g., 12345)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address * <span className="text-red-500">🏠</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={`form-input ${error && !formData.street?.trim() ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder="House/Flat no, Building name, Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City * <span className="text-red-500">🏙️</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-input ${error && !formData.city?.trim() ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State * <span className="text-red-500">🗺️</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`form-input ${error && !formData.state?.trim() ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="Enter state"
                      required
                    />
                  </div>                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddress(null);
                      setError('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          {loading && addressState.addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your addresses...</p>
            </div>
          ) : addressState.addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No addresses saved yet
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first delivery address to start ordering!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addressState.addresses.map((address) => (
                <div
                  key={address._id}
                  className={`bg-white rounded-lg shadow-md p-6 border-2 transition-colors ${
                    addressState.selectedAddress?._id === address._id
                      ? 'border-primary bg-red-50'
                      : 'border-gray-200'
                  }`}
                >                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {address.label === 'Home' ? '🏠' : 
                         address.label === 'Work' ? '🏢' : '📍'}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {address.label}
                      </span>
                      {addressState.selectedAddress?._id === address._id && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                    <div className="text-gray-600 mb-4">
                    <p className="mb-1">{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                  
                  {addressState.selectedAddress?._id !== address._id && (
                    <button
                      onClick={() => handleSetAsDefault(address)}
                      className="text-primary hover:text-red-600 text-sm font-medium"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Addresses;
