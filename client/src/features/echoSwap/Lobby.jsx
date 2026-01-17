import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useSocket } from '../../hooks/useSocket'; // Assumption: You have this hook

const Lobby = () => {
  const navigate = useNavigate();
  // const socket = useSocket(); 
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!topic.trim()) return;
    
    setIsSearching(true);
    
    // Simulate Socket Emission
    console.log("Emitting: find_match", { mode: 'echo', topic });
    // socket.emit('find_match', { mode: 'echo', topic });

    // Mocking a match found after 2 seconds for UI demo
    setTimeout(() => {
        // In real app, socket listener triggers this navigation
        navigate('/echo/session', { state: { role: 'listener', topic: topic } }); 
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      
      {/* Hero Section */}
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-echo-a to-echo-b">
          Borrow Another Mind.
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-lg">
          To enter the session, you must first articulate a belief you hold strongly. 
          You will be paired with someone to practice <span className="text-white font-serif italic">radical perspective taking</span>.
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-xl bg-surface p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Loading Overlay */}
        {isSearching && (
          <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-echo-a border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-echo-a font-mono animate-pulse">Scanning the void for a partner...</p>
          </div>
        )}

        <label className="block text-left text-xs font-bold text-echo-a mb-2 uppercase tracking-widest">
          Your Strong Belief
        </label>
        
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Artificial Intelligence will replace creative jobs..."
          className="w-full h-32 bg-background/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-echo-a focus:ring-1 focus:ring-echo-a transition-all resize-none mb-6"
        />

        <button 
          onClick={handleSearch}
          disabled={!topic || isSearching}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
            !topic ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-echo-a to-blue-500 text-black shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]'
          }`}
        >
          {isSearching ? 'Searching...' : 'Enter Echo Chamber'}
        </button>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-xs text-gray-600 font-mono">
        *Sessions last 5 minutes. Rudeness results in an immediate ban.
      </p>
    </div>
  );
};

export default Lobby;