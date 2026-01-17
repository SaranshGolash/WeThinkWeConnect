import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';

const Lobby = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !user) return;

    const handleMatchFound = (data) => {
      console.log("Match found!", data);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSearching(false);
      navigate('/echo/session', { 
        state: { 
          topic: data.topic || topic,
          roomId: data.roomId,
          mode: 'echo'
        } 
      });
    };

    socket.on('match_found', handleMatchFound);

    return () => {
      socket.off('match_found', handleMatchFound);
    };
  }, [socket, user, topic, navigate]);

  const handleSearch = () => {
    if (!topic.trim() || !socket || !user) return;
    
    setError(null);
    setIsSearching(true);
    
    console.log("Emitting: find_match", { userId: user.id, mode: 'echo', topic });
    
    socket.emit('find_match', { 
      userId: user.id, 
      mode: 'echo', 
      topic: topic.trim() 
    });

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Timeout after 30 seconds if no match
    timeoutRef.current = setTimeout(() => {
      setIsSearching((current) => {
        if (current) {
          setError("No match found. Try again with a different topic.");
          socket.emit('cancel_match', { mode: 'echo' });
        }
        return false;
      });
      timeoutRef.current = null;
    }, 30000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      
      {/* Hero Section */}
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Borrow Another Mind.
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-lg">
          To enter the session, you must first articulate a belief you hold strongly. 
          You will be paired with someone to practice <span className="text-white font-serif italic">radical perspective taking</span>.
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-xl bg-surface p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {isSearching && (
          <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-400 font-mono animate-pulse">Scanning the void for a partner...</p>
          </div>
        )}

        <label className="block text-left text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest">
          Your Strong Belief
        </label>
        
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Artificial Intelligence will replace creative jobs..."
          className="w-full h-32 bg-background/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none mb-6"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded">
            {error}
          </div>
        )}

        <button 
          onClick={handleSearch}
          disabled={!topic || isSearching}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
            !topic ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] hover:from-cyan-300 hover:to-blue-500'
          }`}
        >
          {isSearching ? 'Searching...' : 'Enter Echo Chamber'}
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-600 font-mono">
        *Sessions last 5 minutes. Rudeness results in an immediate ban.
      </p>
    </div>
  );
};

export default Lobby;