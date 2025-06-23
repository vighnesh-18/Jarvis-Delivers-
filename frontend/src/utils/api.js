import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Restaurant API calls
export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  getFoodItems: (restaurantId) => api.get(`/restaurants/${restaurantId}/food-items`),
};

// Food Items API calls
export const foodAPI = {
  getAll: () => api.get('/food-items'),
  getById: (id) => api.get(`/food-items/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/food-items/restaurant/${restaurantId}`),
};

// User Address API calls
export const addressAPI = {
  getAll: () => api.get('/addresses'),
  create: (addressData) => api.post('/addresses', addressData),
  update: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  delete: (id) => api.delete(`/addresses/${id}`),
};

// Orders API calls
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Chat API calls for AI agents
export const chatAPI = {
  processQuery: (queryData) => api.post('/chat/process', queryData),
  getRecommendations: (filters) => api.post('/chat/recommendations', filters),
  addToCart: (itemData) => api.post('/chat/add-to-cart', itemData),
};

export default api;
