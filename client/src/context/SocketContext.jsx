import React, { createContext, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create the Context object
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  // useRef keeps the socket object stable across renders without causing re-renders
  const socket = useRef();

  useEffect(() => {
    // 1. Initialize connection
    // Ensure this matches your backend URL
    socket.current = io('http://localhost:5000', {
        auth: {
            token: localStorage.getItem('token')
        }
    });

    // 2. Setup global listeners (optional)
    socket.current.on('connect', () => {
      console.log('Connected to Continuum Server:', socket.current.id);
    });

    socket.current.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err.message);
    });

    // 3. Cleanup on unmount (app close)
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    // We export socket.current so consumers get the actual client instance
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};