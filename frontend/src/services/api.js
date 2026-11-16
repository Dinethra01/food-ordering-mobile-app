import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
export const BASE_URL = API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Clear invalid token if expired
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Can optionally trigger logout state if needed
      }
    }
    return Promise.reject(error);
  }
);

// High-quality fallback food photo in case of broken image URL
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

// Robust Image URL Resolver matching Mobile implementation
export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.trim() === '') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Already a full external URL (e.g. Unsplash, Cloudinary, AWS S3)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Local backend uploads path (e.g. /uploads/image.jpg)
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
};

// ==========================================
// Authentication Endpoints
// ==========================================
export const loginApi = (email, password) => 
  api.post('/auth/login', { email, password });

export const registerApi = (userData) => 
  api.post('/auth/register', userData);

export const getMeApi = () => 
  api.get('/auth/me');

// ==========================================
// Food Items Endpoints
// ==========================================
export const getFoodItemsApi = (params) => 
  api.get('/food-items', { params });

export const getFoodItemByIdApi = (id) => 
  api.get(`/food-items/${id}`);

export const createFoodItemApi = (formData) => {
  // If formData is an instance of FormData, send multipart/form-data
  if (formData instanceof FormData) {
    return api.post('/food-items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  // Otherwise send JSON
  return api.post('/food-items', formData);
};

export const updateFoodItemApi = (id, formData) => {
  if (formData instanceof FormData) {
    return api.put(`/food-items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.put(`/food-items/${id}`, formData);
};

export const deleteFoodItemApi = (id) => 
  api.delete(`/food-items/${id}`);

// ==========================================
// Order Endpoints
// ==========================================
export const createOrderApi = (orderData) => 
  api.post('/orders', orderData);

export const getOrdersApi = () => 
  api.get('/orders');

export const getOrderByIdApi = (id) => 
  api.get(`/orders/${id}`);

export const updateOrderStatusApi = (id, orderStatus) => 
  api.patch(`/orders/${id}/status`, { orderStatus });

export const cancelOrderApi = (id) => 
  api.delete(`/orders/${id}`);

export default api;
