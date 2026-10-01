import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Set EXPO_PUBLIC_API_URL to the deployed backend URL. The scheme and /api path
// are added when omitted so a Railway hostname alone is also accepted.
const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const normalizeApiUrl = (url) => {
  let normalizedUrl = url.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }
  if (!/\/api$/i.test(normalizedUrl)) {
    normalizedUrl += '/api';
  }
  return normalizedUrl;
};

const API_BASE_URL = configuredApiUrl
  ? normalizeApiUrl(configuredApiUrl)
  : (
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api'
  );

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to attach Authorization Bearer token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error fetching token from storage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
