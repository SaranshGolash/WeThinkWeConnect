import React from 'react';

const ThoughtCard = ({ thought }) => {
  return (
    <div className="group relative pl-8 py-2">
      
      {/* Timeline Line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 group-hover:via-fog transition-all duration-500" />
      
      {/* Timeline Dot */}
      <div className="absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-gray-600 border border-background group-hover:bg-fog group-hover:scale-150 transition-all duration-300" />

      {/* Card Content */}
      <div className="bg-surface/30 hover:bg-surface p-6 rounded-lg border border-transparent hover:border-white/5 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-fog to-purple-500 flex items-center justify-center text-[10px] text-black font-bold">
            {thought.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-400 font-mono">@{thought.username}</span>
          <span className="text-[10px] text-gray-600 px-2 py-0.5 border border-gray-700 rounded-full">
            {new Date(thought.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* The Thought */}
        <p className="text-lg text-gray-200 font-serif leading-relaxed italic opacity-90">
          "{thought.content}
          <span className="text-fog font-bold opacity-60">...</span>"
        </p>

        {/* Action Footer */}
        <div className="mt-6 flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-fog hover:text-black text-xs font-bold transition">
            <span>Extend Thread</span>
            <span className="bg-black/30 px-1.5 rounded text-[10px]">{thought.continuations || 0}</span>
          </button>
          
          <button className="px-3 py-1.5 rounded border border-white/10 hover:border-fog text-xs text-gray-400 hover:text-white transition">
            Ask Clarification
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThoughtCard;