import React from 'react';
import { useNavigate } from 'react-router-dom';

function ThoughtCard ({ thought, onExtend, onMoodClick }) {
  const navigate = useNavigate();
  const username = thought.author?.username || thought.username || "Anonymous";
  const mood = thought.mood || "Neutral";
  const initial = username.charAt(0).toUpperCase();
  const dateDisplay = thought.created_at 
    ? new Date(thought.created_at).toLocaleDateString() 
    : "Just now";

  const getMoodColor = (m) => {
    switch(m) {
      case 'Melancholic': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'Hopeful': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'Dark': return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
      case 'Romantic': return 'text-pink-400 border-pink-400/30 bg-pink-400/10';
      case 'Whimsical': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  }

  // Navigate to Conflict
  const handleChallenge = (e) => {
    e.stopPropagation();
    navigate('/conflict', { 
      state: { prefilledTopic: thought.content } 
    });
  };

  // Navigate to EchoSwap
  const handleEcho = (e) => {
    e.stopPropagation();
    navigate('/echo', { 
      state: { starterThought: thought.content } 
    });
  };

  return (
    <div className="group relative pl-8 py-2">
      
      {/* Timeline Line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-surface via-white/10 to-surface group-hover:via-primary transition-all duration-500" />
      
      <div className="absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-surface-highlight border border-white/10 group-hover:bg-primary group-hover:shadow-neon transition-all duration-300" />

      {/* Card Content */}
      <div className="relative group rounded-2xl p-px bg-gradient-to-b from-white/5 to-transparent hover:from-primary/30 transition-all duration-500">
        <div className="bg-surface/60 backdrop-blur-md rounded-[15px] p-6 hover:bg-surface/80 transition-colors">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-xs text-white font-bold">
              {initial}
            </div>
            <span className="text-xs text-primary font-mono tracking-wide">@{username}</span>
            <span className="text-[10px] text-text-muted px-2 py-0.5 border border-white/5 rounded-full">
              {dateDisplay}
            </span>
            
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering parent clicks
                if (onMoodClick) onMoodClick(mood);
              }}
              className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider 
                hover:opacity-80 hover:scale-105 transition-all cursor-pointer ${getMoodColor(mood)}`}
            >
               {mood}
             </button>

          </div>

          {/* The Thought */}
          <p className="text-lg text-text-main font-serif leading-relaxed italic opacity-90">
            "{thought.content}
            <span className="text-primary font-bold opacity-60">...</span>"
          </p>

          {/* Action Footer */}
          <div className="mt-6 flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <button onClick={onExtend} className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-primary hover:text-white text-xs font-bold transition">
              <span>Extend Thread</span>
              <span className="bg-black/30 px-1.5 rounded text-[10px]">{thought.continuations || 0}</span>
            </button>
            {/* Bridge to other UseCases/Features */}
            <div className="flex gap-4">
               <button 
                 onClick={handleChallenge}
                 className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:underline transition-all"
                 title="Take this to the Conflict Room"
               >
                 <span>⚔️</span> Challenge
               </button>

               <button 
                 onClick={handleEcho}
                 className="flex items-center gap-1.5 text-xs text-secondary hover:text-cyan-300 hover:underline transition-all"
                 title="Swap perspectives in Echo Room"
               >
                 <span>👁️</span> Echo
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtCard;