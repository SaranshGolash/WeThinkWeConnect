import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Import our configured axios instance
import { ENDPOINTS } from '../api/endpoints';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token and get latest profile data
          const res = await api.get(ENDPOINTS.USERS.PROFILE);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token invalid or expired");
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      
      // 1. Save Token
      localStorage.setItem('token', res.data.token);
      
      // 2. Update State
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data || "Login failed" 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post(ENDPOINTS.AUTH.REGISTER, { username, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data || "Registration failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    // Optional: Redirect to login handled by components or router
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};