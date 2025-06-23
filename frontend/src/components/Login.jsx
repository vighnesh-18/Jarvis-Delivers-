import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { authAPI } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setError('');    try {
      const response = await authAPI.login(formData);
      login(response.data);
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen w-full gradient-bg">
      <div className="w-full h-screen flex">        {/* Left Side - Welcome Content */}
        <div className="hidden lg-flex lg-w-half items-center justify-center text-white p-12">
          <div className="text-center">
            <div className="text-8xl mb-6">🍕</div>
            <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl opacity-90 mb-8">Sign in to continue your delicious journey with Jarvis Delivers!</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-semibold">Quick Orders</div>
                <div className="text-sm opacity-75">Reorder favorites</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold">Personalized</div>
                <div className="text-sm opacity-75">Just for you</div>
              </div>
            </div>
          </div>
        </div>        {/* Right Side - Login Form */}
        <div className="w-full lg-w-half auth-form-container p-8 lg-p-12">
          <div className="auth-form-wrapper">            <div className="form-container text-center">
              {/* Logo and Title */}
              <div className="mb-8 text-center flex flex-col items-center justify-center">
                <div className="lg-hidden text-6xl mb-4">🍕</div>
                <h1 className="text-3xl lg-text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2 text-center">
                  Jarvis Delivers
                </h1>
                <p className="text-gray-600 text-lg text-center">
                  Your favorite food, delivered with love 💝
                </p>
              </div>

          {/* Welcome Message */}
          <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-red-400 text-center flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center">Welcome Back! 👋</h2>
            <p className="text-gray-600 text-center">Sign in to continue your food journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg text-center">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">❌</span>
                {error}
              </div>
            </div>
          )}{/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email address"
              />
            </div>

            <div className="text-center">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-3"></div>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Sign In & Start Ordering
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Don't have an account yet? 🤔</p>
            <Link
              to="/register"
              className="btn-secondary inline-block py-3 px-8 text-lg font-semibold"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">✨</span>
                Create New Account
              </span>
            </Link>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
