import React, { useState } from 'react';

const PerspectiveInput = ({ onSubmit, isSubmitting }) => {
  const [attempt, setAttempt] = useState('');

  const handleSubmit = () => {
    if (attempt.length < 20) return;
    onSubmit(attempt);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow relative group">
        <textarea
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          placeholder="I understand that you believe... because..."
          className="w-full h-full bg-black/20 p-6 text-lg text-white font-serif leading-relaxed focus:outline-none placeholder-white/20 resize-none"
        />
        
        {/* Subtle border effect on focus */}
        <div className="absolute bottom-0 left-0 h-1 bg-echo-b w-0 group-focus-within:w-full transition-all duration-500" />
      </div>

      <div className="bg-surface p-4 border-t border-white/5 flex justify-between items-center">
        <span className={`text-xs ${attempt.length < 20 ? 'text-red-400' : 'text-green-400'}`}>
          {attempt.length} characters (min 20)
        </span>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || attempt.length < 20}
          className={`px-6 py-2 rounded font-bold text-sm transition-all ${
            attempt.length < 20 
              ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed' 
              : 'bg-echo-b text-black hover:bg-white hover:shadow-[0_0_15px_rgba(251,113,133,0.5)]'
          }`}
        >
          {isSubmitting ? 'Validating...' : 'Submit Perspective'}
        </button>
      </div>
    </div>
  );
};

export default PerspectiveInput;