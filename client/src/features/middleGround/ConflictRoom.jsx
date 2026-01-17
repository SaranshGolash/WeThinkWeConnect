import React, { useState, useEffect } from 'react';
import ConvergenceSlider from './ConvergenceSlider';
import NegotiationChat from './NegotiationChat';
// import { useSocket } from '../../hooks/useSocket';

const ConflictRoom = () => {
  // State
  const [distance, setDistance] = useState(100);
  const [messages, setMessages] = useState([]);
  
  // Logic
  const isUnlocked = distance < 20;

  // Mock Socket Logic (Replace with useSocket hook)
  const handleDistanceChange = (newDist) => {
    setDistance(newDist);
    // socket.emit('conflict_update_position', { newDistance: newDist });
  };

  const handleSendMessage = (text) => {
    const newMessage = { text, isMe: true };
    setMessages((prev) => [...prev, newMessage]);
    // socket.emit('conflict_send_message', newMessage);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">The Middle Ground</h2>
        <p className="text-gray-400">Move closer to speak. Move apart to silence.</p>
      </div>

      <ConvergenceSlider 
        distance={distance} 
        setDistance={handleDistanceChange} 
        locked={false} 
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