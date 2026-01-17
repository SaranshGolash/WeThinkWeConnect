import React, { useState } from 'react';

const PostInput = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!text) return;
    // Basic Client-side check for conclusions
    const forbidden = ["conclude", "therefore", "period."];
    if (forbidden.some(word => text.toLowerCase().includes(word))) {
      alert("No conclusions allowed!");
      return;
    }
    onSubmit(text);
    setText("");
  };

  return (
    <div className={`
      relative w-full mb-12 rounded-xl transition-all duration-500 border
      ${isFocused ? 'bg-surface border-fog shadow-[0_0_30px_rgba(165,180,252,0.1)]' : 'bg-surface/50 border-white/5'}
    `}>
      <div className="p-6">
        <label className="block text-xs font-bold text-fog tracking-widest uppercase mb-4">
          Open a new loop
        </label>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-xl md:text-2xl font-serif text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed"
          placeholder="I have a feeling that..."
          rows={3}
        />
      </div>

      {/* Bottom Bar */}
      <div className="px-6 py-4 bg-black/20 border-t border-white/5 rounded-b-xl flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-fog animate-pulse"/>
          <span>AI Moderation Active</span>
        </div>
        
        <button 
          onClick={handleSubmit}
          className="px-6 py-2 bg-fog hover:bg-white text-black font-bold text-sm rounded transition-colors"
        >
          Leave Unfinished
        </button>
      </div>
    </div>
  );
};

export default PostInput;