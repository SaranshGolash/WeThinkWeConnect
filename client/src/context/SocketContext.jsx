import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

export const SocketContext = createContext(null);
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return; // Wait for user to be loaded
    
    const URL = 'http://localhost:5000'; 
    
    console.log("Initializing Socket Connection to:", URL, "User ID:", user.id);

    const newSocket = io(URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    // Send userId when connected
    newSocket.on('connect', () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit('authenticate', { userId: user.id });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting Socket...");
      newSocket.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};