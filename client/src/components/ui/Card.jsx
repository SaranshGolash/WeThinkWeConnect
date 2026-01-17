import React from 'react';

const Card = ({ children, className = '', glowColor = 'border-white/10' }) => {
  return (
    <div className={`
      relative group rounded-3xl p-px bg-gradient-to-b from-white/10 to-transparent 
      hover:from-primary/50 hover:to-secondary/50 transition-all duration-500
      ${className}
    `}>
      <div className="relative h-full bg-surface rounded-[23px] p-8 overflow-hidden">
        {/* Hover Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;