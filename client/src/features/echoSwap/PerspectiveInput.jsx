import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import useGeminiSpark from '../../hooks/useGeminiSpark';

const PerspectiveInput = ({ onSubmit, isProcessing, aiFeedback }) => {
  const [attempt, setAttempt] = useState('');
  
  const { suggestions, isSparking, triggerSpark, clearSparks } = useGeminiSpark();

  const applySuggestion = (text) => {
    const separator = attempt.endsWith(' ') ? '' : ' ';
    setAttempt(attempt + separator + text);
    clearSparks();
  };

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-12">
      <div className="flex-grow flex flex-col justify-center">
        
        <label className="text-text-muted text-sm mb-4">
          Rewrite the belief on the left as if it were your own:
        </label>
        
        <div className="relative group">
          <textarea
            value={attempt}
            onChange={(e) => { 
                setAttempt(e.target.value);
                if (suggestions.length > 0) clearSparks(); // Clear suggestions on manual type
            }}
            disabled={isProcessing}
            placeholder="I genuinely believe this because..."
            className={`
              w-full h-48 bg-transparent text-xl text-white font-serif leading-relaxed 
              focus:outline-none placeholder-white/10 resize-none
              border-l-2 pl-4 transition-colors duration-300
              ${aiFeedback ? 'border-red-500' : 'border-white/20 focus:border-primary'}
            `}
          />
          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 z-10 w-full flex flex-wrap gap-2 animate-fade-in-up bg-black/50 backdrop-blur-md p-2 rounded-lg border border-white/10">
                <span className="text-xs text-secondary font-bold w-full uppercase tracking-wider mb-1">Gemini Sparks:</span>
                {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="text-xs text-left bg-white/10 hover:bg-primary/20 hover:text-primary border border-white/10 rounded-lg px-3 py-2 transition-all text-gray-300"
                    >
                        "{s}..."
                    </button>
                ))}
            </div>
          )}

          {/* AI Feedback Box (Existing) */}
          {aiFeedback && !suggestions.length && (
            <div className="absolute top-full left-0 mt-4 w-full bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm text-red-300 animate-fade-in">
              <span className="font-bold block mb-1">Gemini Feedback:</span>
              "{aiFeedback}"
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        
        {/* Left Side: Char Count + Spark Button */}
        <div className="flex items-center gap-4">
            <span className={`text-xs font-mono transition-colors ${attempt.length < 20 ? 'text-red-400' : 'text-green-400'}`}>
            {attempt.length} / 20 chars
            </span>

            {/* Spark Button */}
            <button
                type="button"
                onClick={() => triggerSpark(attempt)}
                disabled={isSparking || !attempt.trim() || isProcessing}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all
                    ${isSparking ? 'text-primary animate-pulse' : 'text-gray-400 hover:text-primary'}`}
            >
                {isSparking ? (
                     <>Thinking...</> 
                ) : (
                     <><span className="text-lg">✨</span> Spark</>
                )}
            </button>
        </div>
        
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