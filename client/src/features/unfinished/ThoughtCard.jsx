import React from 'react';

const ThoughtCard = ({ thought, onExtend }) => {
  console.log("Thought Data:", thought);
  const username = thought.author?.username || thought.username || "Anonymous";
  const initial = username.charAt(0).toUpperCase();
  const dateDisplay = thought.created_at 
    ? new Date(thought.created_at).toLocaleDateString() 
    : "Just now";

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtCard;