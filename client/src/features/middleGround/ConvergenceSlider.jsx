import React from 'react';

const ConvergenceSlider = ({ distance, setDistance, locked }) => {

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl mb-8 relative overflow-hidden">
      <div className="relative h-32 mb-8 flex items-center justify-between px-12 bg-background/50 rounded-xl inner-shadow">
        
        {/* User A */}
        <div 
          className="absolute w-12 h-12 bg-echo-a rounded-full blur-md transition-all duration-700 ease-out z-10"
          style={{ left: `${50 - (distance / 2)}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-full h-full bg-echo-a rounded-full opacity-50 animate-pulse" />
        </div>

        {/* User B*/}
        <div 
          className="absolute w-12 h-12 bg-echo-b rounded-full blur-md transition-all duration-700 ease-out z-10"
          style={{ right: `${50 - (distance / 2)}%`, transform: 'translateX(50%)' }}
        >
           <div className="w-full h-full bg-echo-b rounded-full opacity-50 animate-pulse" />
        </div>

        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -z-0" />
        
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-32 bg-conflict transition-all duration-500 blur-xl ${
            distance < 20 ? 'opacity-100 w-32' : 'opacity-0 w-1'
          }`} 
        />
      </div>

      <div className="text-center">
        <div className="flex justify-between text-xs font-bold tracking-widest text-gray-500 mb-2">
          <span>TOTAL DISAGREEMENT</span>
          <span className={distance < 20 ? 'text-conflict' : ''}>CONVERGENCE</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={distance}
          onChange={(e) => !locked && setDistance(Number(e.target.value))}
          disabled={locked}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-conflict disabled:opacity-50"
        />

        <p className="mt-4 text-sm font-mono text-gray-400">
          Current Distance: <span className="text-white text-lg">{distance}%</span>
        </p>
      </div>
    </div>
  );
};

export default ConvergenceSlider;