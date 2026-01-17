import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Import the hook, not the Context

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // ✅ Use the hook
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;