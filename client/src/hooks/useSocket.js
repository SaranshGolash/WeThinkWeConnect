import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * Hook to access the global Socket.io instance.
 * Must be used within a <SocketProvider> component.
 * * Usage: 
 * const socket = useSocket();
 * socket.emit('event_name', data);
 */
const useSocket = () => {
  const socket = useContext(SocketContext);

  if (socket === undefined) {
    // Safety check in case you forgot to wrap App in the Provider
    // Ideally, we return null initially until connection is established, 
    // but throwing helps catch setup errors during dev.
    console.warn("useSocket must be used within a SocketProvider. Socket is currently undefined.");
  }

  return socket;
};

export default useSocket;