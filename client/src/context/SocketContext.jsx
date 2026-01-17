import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

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

  useEffect(() => {
    const URL = 'http://localhost:5000'; 
    
    console.log("Initializing Socket Connection to:", URL);

    const newSocket = io(URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting Socket...");
      newSocket.disconnect();
    };
  }, []);

  return (
    // Even if socket is null (loading), then it will pass null, not undefined.
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};