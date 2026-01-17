import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSocket from '../../hooks/useSocket'; 
import PerspectiveInput from './PerspectiveInput';

const SplitScreenSession = () => {
  const location = useLocation();
  const socket = useSocket(); 
  
  // Fallback data
  const { topic, roomId } = location.state || { topic: "Technology creates isolation.", roomId: "test-room" };

  const [status, setStatus] = useState('active'); 
  const [aiFeedback, setAiFeedback] = useState(null);

  useEffect(() => {
    if (!socket) return; 

    socket.on('echo_processing', () => {
      setStatus('processing');
      setAiFeedback(null);
    });

    socket.on('echo_success', () => {
      setStatus('success');
    });

    socket.on('echo_failed', (data) => {
      setStatus('active');
      setAiFeedback(data.msg);
    });

    return () => {
      socket.off('echo_processing');
      socket.off('echo_success');
      socket.off('echo_failed');
    };
  }, [socket]);

  const handlePerspectiveSubmit = (text) => {
    // safe case for socket connection
    if (!socket) {
      console.warn("Socket not ready yet.");
      return;
    }

    socket.emit('echo_validate_attempt', { 
      roomId, 
      originalBelief: topic, 
      attemptText: text 
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] w-full flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-black">
      
      {/* Left Pannel */}
      <div className="md:w-1/2 bg-surface p-10 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/5 relative">
        <span className="absolute top-6 left-6 text-xs font-bold text-secondary tracking-[0.3em] opacity-50 uppercase">
          Target Belief
        </span>
        <div className="w-16 h-1 bg-gradient-to-r from-secondary to-purple-500 mb-8 rounded-full" />
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
          "{topic}"
        </h2>
        <div className="mt-8 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold">
          Argue FOR this. Do not refute.
        </div>
      </div>

      {/* Right Pannel */}
      <div className="md:w-1/2 bg-black/50 flex flex-col relative">
        <span className="absolute top-6 right-6 text-xs font-bold text-primary tracking-[0.3em] opacity-50 uppercase">
          Your Mirror
        </span>

        {/* Socket Connection Check */}
        {!socket ? (
          <div className="h-full flex flex-col items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"/>
            <p className="text-white/50 text-sm tracking-widest uppercase">Connecting to Neural Link...</p>
          </div>
        ) : status === 'success' ? (
          <div className="h-full flex flex-col items-center justify-center p-10 animate-fade-in">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400 text-4xl shadow-glow-echo">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Resonance Achieved</h3>
            <p className="text-text-muted text-center max-w-sm">
              Gemini confirmed your perspective alignment. The chat is now unlocked.
            </p>
          </div>
        ) : (
          <PerspectiveInput 
            onSubmit={handlePerspectiveSubmit} 
            isProcessing={status === 'processing'}
            aiFeedback={aiFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default SplitScreenSession;