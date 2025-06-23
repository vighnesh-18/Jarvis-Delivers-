import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { authAPI } from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone      });
      login(response.data);
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen w-full gradient-bg">
      <div className="w-full h-screen flex">
        {/* Left Side - Welcome Content */}
        <div className="hidden lg:flex w-1/2 items-center justify-center text-white p-12">
          <div className="text-center">
            <div className="text-8xl mb-6">🍕</div>
            <h1 className="text-5xl font-bold mb-4">Welcome to Jarvis Delivers!</h1>
            <p className="text-xl opacity-90 mb-8">Join thousands of food lovers and get your favorite meals delivered fast!</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-semibold">Fast Delivery</div>
                <div className="text-sm opacity-75">15-30 mins</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🍽️</div>
                <div className="font-semibold">Quality Food</div>
                <div className="text-sm opacity-75">From top restaurants</div>
              </div>
            </div>
          </div>
        </div>        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 auth-form-container p-8 lg:p-12">
          <div className="auth-form-wrapper">            <div className="form-container text-center">
              <div className="text-center mb-6 flex flex-col items-center justify-center">
                <div className="lg:hidden text-5xl mb-3">🍕</div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2 text-center">
                  Join Jarvis Delivers
                </h1>
                <p className="text-gray-600 text-center">Create your account to get started 🚀</p>
              </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg text-center">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">❌</span>
                {error}
              </div>
            </div>
          )}<form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="text-center">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="text-center">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="text-center">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Create a password"
              />
            </div>

            <div className="text-center">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-3"></div>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  Create Account
                </span>
              )}
            </button>
          </form>          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-red-500 hover:text-red-600 font-medium underline">
                Sign In
              </Link>
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
