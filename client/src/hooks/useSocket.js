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
    console.warn("useSocket must be used within a SocketProvider. Socket is currently undefined.");
  }

  return socket;
};

export default useSocket;