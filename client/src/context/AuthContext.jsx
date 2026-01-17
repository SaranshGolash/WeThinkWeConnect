import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load User from LocalStorage on startup
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); 
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate token with backend
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login Action (Updates State & Storage)
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Logout Action (Clears State & Storage)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};