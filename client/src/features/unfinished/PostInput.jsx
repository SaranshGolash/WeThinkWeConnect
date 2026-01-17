// client/src/features/unfinished/PostInput.jsx
import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const PostInput = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!text) return;
    const forbidden = ["conclude", "therefore", "period.", "simple as that"];
    if (forbidden.some(word => text.toLowerCase().includes(word))) {
      alert("Let's keep it open-ended. Avoid conclusive words.");
      return;
    }
    onSubmit(text);
    setText("");
  };

  return (
    <div className={`
      relative w-full mb-12 rounded-2xl transition-all duration-500
      ${isFocused ? 'bg-surface border-fog shadow-glow-fog' : 'bg-surface/30 border-white/5'}
      border backdrop-blur-sm p-1
    `}>
      <div className="p-6">
        <label className={`block text-xs font-bold tracking-widest uppercase mb-4 transition-colors ${isFocused ? 'text-fog' : 'text-slate-500'}`}>
          Open a new loop
        </label>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-xl md:text-2xl font-serif text-white placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
          placeholder="I have a feeling that..."
          rows={3}
        />
      </div>

      <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-black/10 rounded-b-xl">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className={`w-1.5 h-1.5 rounded-full ${text.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
          <span>AI Moderation Ready</span>
        </div>
        
        <Button onClick={handleSubmit} variant={text.length > 0 ? 'fog' : 'ghost'} disabled={!text.length} size="sm">
          Leave Unfinished
        </Button>
      </div>
    </div>
  );
};

export default PostInput;