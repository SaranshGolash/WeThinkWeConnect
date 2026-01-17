import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const PerspectiveInput = ({ onSubmit, isProcessing, aiFeedback }) => {
  const [attempt, setAttempt] = useState('');

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-12">
      <div className="flex-grow flex flex-col justify-center">
        
        <label className="text-text-muted text-sm mb-4">
          Rewrite the belief on the left as if it were your own:
        </label>
        
        <div className="relative group">
          <textarea
            value={attempt}
            onChange={(e) => setAttempt(e.target.value)}
            disabled={isProcessing}
            placeholder="I genuinely believe this because..."
            className={`
              w-full h-48 bg-transparent text-xl text-white font-serif leading-relaxed 
              focus:outline-none placeholder-white/10 resize-none
              border-l-2 pl-4 transition-colors duration-300
              ${aiFeedback ? 'border-red-500' : 'border-white/20 focus:border-primary'}
            `}
          />
          
          {/* AI Feedback Box */}
          {aiFeedback && (
            <div className="absolute top-full left-0 mt-4 w-full bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm text-red-300 animate-fade-in">
              <span className="font-bold block mb-1">Gemini Feedback:</span>
              "{aiFeedback}"
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <span className={`text-xs font-mono transition-colors ${attempt.length < 20 ? 'text-red-400' : 'text-green-400'}`}>
          {attempt.length} / 20 chars
        </span>
        
        <Button
          onClick={() => onSubmit(attempt)}
          disabled={isProcessing || attempt.length < 20}
          variant="secondary"
          isLoading={isProcessing}
        >
          {isProcessing ? 'Gemini is Judging...' : 'Submit Perspective'}
        </Button>
      </div>
    </div>
  );
};

export default PerspectiveInput;