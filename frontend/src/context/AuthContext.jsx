import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(() => localStorage.getItem('foodie_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate or refresh session on initial load
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('foodie_token');
      if (token) {
        try {
          const response = await getMeApi();
          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem('foodie_user', JSON.stringify(response.data.data));
          }
        } catch (error) {
          console.warn('Session verification failed, using cached session or clearing:', error);
          // If token expired, clear
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      const { token, ...userData } = response.data.data;

      localStorage.setItem('foodie_token', token);
      localStorage.setItem('foodie_user', JSON.stringify(userData));

      setUserToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await registerApi({ name, email, password, role });
      const { token, ...userData } = response.data.data;

      localStorage.setItem('foodie_token', token);
      localStorage.setItem('foodie_user', JSON.stringify(userData));

      setUserToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('foodie_token');
    localStorage.removeItem('foodie_user');
    setUserToken(null);
    setUser(null);
  };

  const isAuthenticated = !!userToken;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
