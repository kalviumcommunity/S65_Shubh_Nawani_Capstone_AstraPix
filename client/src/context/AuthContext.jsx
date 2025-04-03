import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      setUser(response.data);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (token, userData = null) => {
    try {
      localStorage.setItem('token', token);
      
      if (!userData) {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userData = response.data;
      }

      setUser(userData);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userData;
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // ...existing code...
    } catch (error) {
      // ...existing code...
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    handleOAuthLogin: login // Simplified OAuth login handling
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 sm:h-16 sm:w-16"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;