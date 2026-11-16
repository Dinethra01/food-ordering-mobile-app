import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi, getMeApi } from '../services/api';
import { getStoredBackendUrl, API_BASE_URL } from '../config/apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore stored user session on startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          setUserToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error restoring auth token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      const { token, ...userData } = response.data.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUserToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log('Login error:', error.message, error.response?.data);
      if (!error.response) {
        const activeUrl = await getStoredBackendUrl();
        return {
          success: false,
          error: `Cannot reach server at ${activeUrl}. Please ensure your backend is running on port 5001 and your phone and Mac are on the same Wi-Fi.`,
          isNetworkError: true,
        };
      }
      const message = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await registerApi({ name, email, password, role });
      const { token, ...userData } = response.data.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUserToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log('Register error:', error.message, error.response?.data);
      if (!error.response) {
        const activeUrl = await getStoredBackendUrl();
        return {
          success: false,
          error: `Cannot reach server at ${activeUrl}. Please ensure your backend is running on port 5001 and your phone and Mac are on the same Wi-Fi.`,
          isNetworkError: true,
        };
      }
      const message = error.response?.data?.message || 'Registration failed. Please check inputs.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
