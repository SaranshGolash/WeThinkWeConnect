import React, { useState } from 'react';

const ConflictRoom = () => {
  // Corresponds to 'current_distance' in DB
  const [distance, setDistance] = useState(100); 

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h2 className="text-conflict font-bold tracking-widest text-2xl mb-8">
        THE MIDDLE GROUND
      </h2>

      {/* Visualizer of the Gap */}
      <div className="relative w-full h-64 flex justify-between items-center px-10 mb-8 bg-surface rounded-xl overflow-hidden border border-white/5">
        
        {/* User A Node */}
        <div 
            className="w-16 h-16 bg-echo-a rounded-full blur-sm transition-all duration-700"
            style={{ transform: `translateX(${100 - distance}px)` }} 
        />

        {/* The Connection Line */}
        <div className="h-0.5 bg-gray-700 absolute left-24 right-24 z-0" />

        {/* User B Node */}
        <div 
            className="w-16 h-16 bg-echo-b rounded-full blur-sm transition-all duration-700"
            style={{ transform: `translateX(-${100 - distance}px)` }} 
        />
        
        {/* Convergence Center */}
        <div className={`absolute left-1/2 -translate-x-1/2 w-1 h-full bg-conflict transition-opacity duration-500 ${distance < 20 ? 'opacity-100 shadow-[0_0_20px_orange]' : 'opacity-10'}`} />
      </div>

      {/* Control Surface */}
      <div className="w-full max-w-md bg-black/40 p-6 rounded-xl text-center">
        <p className="text-gray-400 text-sm mb-4">
          Distance: {distance}% <br/>
          <span className="text-xs opacity-50">Move closer to unlock chat</span>
        </p>
        
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={distance} 
          onChange={(e) => setDistance(e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-conflict"
        />
        
        <div className="mt-6">
            {distance < 20 ? (
                <button className="bg-conflict text-black font-bold px-8 py-3 rounded shadow-lg animate-pulse">
                    OPEN NEGOTIATION CHANNEL
                </button>
            ) : (
                <button disabled className="bg-gray-800 text-gray-500 font-bold px-8 py-3 rounded cursor-not-allowed">
                    GAP TOO WIDE
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ConflictRoom;