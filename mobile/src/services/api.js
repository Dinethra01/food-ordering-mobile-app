import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const loginApi = (email, password) => api.post('/auth/login', { email, password });
export const registerApi = (userData) => api.post('/auth/register', userData);
export const getMeApi = () => api.get('/auth/me');

// Food Items API calls
export const getFoodItemsApi = (params) => api.get('/food-items', { params });
export const getFoodItemByIdApi = (id) => api.get(`/food-items/${id}`);
export const createFoodItemApi = (formData) =>
  api.post('/food-items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateFoodItemApi = (id, formData) =>
  api.put(`/food-items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteFoodItemApi = (id) => api.delete(`/food-items/${id}`);

// Order API calls
export const createOrderApi = (orderData) => api.post('/orders', orderData);
export const getOrdersApi = () => api.get('/orders');
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);
export const updateOrderStatusApi = (id, orderStatus) => api.patch(`/orders/${id}/status`, { orderStatus });
export const cancelOrderApi = (id) => api.delete(`/orders/${id}`);

export default api;
