import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';
import ConvergenceSlider from './ConvergenceSlider';
import NegotiationChat from './NegotiationChat';

const ConflictRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  
  const { topic, roomId } = location.state || { topic: "Sample disagreement topic", roomId: null };
  
  // State
  const [distance, setDistance] = useState(100);
  const [opponentDistance, setOpponentDistance] = useState(100);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Logic
  const effectiveDistance = (distance + opponentDistance) / 2;
  const isUnlocked = effectiveDistance < 20;

  useEffect(() => {
    if (!roomId) {
      // Redirect to lobby if no roomId
      navigate('/conflict');
      return;
    }

    if (!socket) {
      return;
    }

    // Join room
    socket.emit('join_room', { roomId });

    // Initialize conflict session
    socket.emit('conflict_start_session', { roomId, topic, userId: user?.id });

    // Listen for opponent movements
    socket.on('conflict_opponent_moved', (data) => {
      setOpponentDistance(data.distance);
    });

    // Listen for convergence notifications
    socket.on('conflict_convergence_reached', (data) => {
      console.log('Convergence reached:', data.message);
    });

    // Listen for messages
    socket.on('conflict_message', (data) => {
      setMessages((prev) => [...prev, {
        text: data.text,
        isMe: data.userId === user?.id,
        username: data.username || 'Opponent'
      }]);
    });

    // Listen for session initialization
    socket.on('conflict_session_initialized', () => {
      setIsConnected(true);
    });

    return () => {
      socket.off('conflict_opponent_moved');
      socket.off('conflict_convergence_reached');
      socket.off('conflict_message');
      socket.off('conflict_session_initialized');
    };
  }, [socket, roomId, topic, user?.id, navigate]);

  const handleDistanceChange = (newDist) => {
    setDistance(newDist);
    if (socket && roomId) {
      socket.emit('conflict_update_position', {
        roomId,
        newDistance: newDist,
        userId: user?.id
      });
    }
  };

  const handleSendMessage = (text) => {
    if (!socket || !roomId || !text.trim()) return;
    
    const newMessage = { text, isMe: true, username: user?.username || 'You' };
    setMessages((prev) => [...prev, newMessage]);

    // Send to other user
    socket.emit('conflict_send_message', {
      roomId,
      text,
      userId: user?.id,
      username: user?.username
    });
  };

  if (!roomId || !socket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-conflict border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-400">Connecting to conflict room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">The Middle Ground</h2>
        <p className="text-gray-400">Move closer to speak. Move apart to silence.</p>
        {topic && (
          <p className="text-sm text-gray-500 mt-2 italic">"{topic}"</p>
        )}
        {!isConnected && (
          <p className="text-xs text-yellow-400 mt-2 animate-pulse">Waiting for opponent...</p>
        )}
      </div>

      <ConvergenceSlider 
        distance={effectiveDistance} 
        setDistance={handleDistanceChange} 
        locked={!isConnected} 
      />

      <NegotiationChat 
        isUnlocked={isUnlocked} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default ConflictRoom;