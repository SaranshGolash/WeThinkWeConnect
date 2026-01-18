import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';

const PostInput = ({ onPostSuccess }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSparking, setIsSparking] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setAiError(null);
    setSuggestions([]); // Clear suggestions on submit

    try {
      const res = await api.post(ENDPOINTS.THOUGHTS.CREATE, { content: text });
      onPostSuccess(res.data);
      setText("");
    } catch (err) {
      console.error("FULL ERROR DETAILS:", err);
      
      let msg = "Something went wrong.";
      
      if (err.response) {
          msg = err.response.data?.error || err.response.data || "Server Error";
          if (typeof msg === 'object') msg = JSON.stringify(msg);
      } else if (err.request) {
          msg = "No response from server. Is the backend running?";
      } else {
          msg = err.message;
      }

      setAiError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpark = async () => {
    if (text.length < 5) {
        alert("Type at least 5 characters to get a spark!");
        return;
    }
    
    setIsSparking(true);
    setSuggestions([]);

    try {
        // Sending { content: text } because backend expects 'content' key
        const res = await api.post('/thoughts/spark', { content: text });
        setSuggestions(res.data.suggestions);
    } catch (err) {
        console.error(err);
    } finally {
        setIsSparking(false);
    }
  };

  const applySuggestion = (suggestion) => {
    // Add a space if missing
    const separator = text.endsWith(' ') ? '' : ' ';
    setText(text + separator + suggestion);
    setSuggestions([]); // Clear after picking
  };

  return (
    <div className={`
      relative w-full mb-12 rounded-2xl transition-all duration-500
      ${isFocused ? 'bg-surface border-primary shadow-neon' : 'bg-surface/30 border-white/5'}
      ${aiError ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
      border backdrop-blur-sm p-1
    `}>
      <div className="p-6">
        <label className={`block text-xs font-bold tracking-widest uppercase mb-4 transition-colors ${isFocused ? 'text-primary' : 'text-text-muted'}`}>
          {aiError ? <span className="text-red-400">AI Moderation Alert</span> : "Open a new loop"}
        </label>
        
        <textarea
          value={text}
          onChange={(e) => { 
              setText(e.target.value); 
              setAiError(null); 
              if(suggestions.length > 0) setSuggestions([]); // Clear suggestions if user types manually
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isAnalyzing}
          className="w-full bg-transparent text-xl md:text-2xl font-serif text-white placeholder-slate-600 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
          placeholder="I have a feeling that..."
          rows={3}
        />

        {/* Suggestions Area */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
              <span className="text-xs text-secondary font-bold w-full uppercase tracking-wider mb-1">Gemini Sparks:</span>
              {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applySuggestion(s)}
                    className="text-xs text-left bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 rounded-lg px-3 py-2 transition-all"
                  >
                      "{s}..."
                  </button>
              ))}
          </div>
        )}
        
        {/* Error Message Display */}
        {aiError && (
          <div className="mt-3 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-3 animate-fade-in">
             <span>🚫</span>
             {aiError}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-black/10 rounded-b-xl">
        
        {/* Left Side: Status + Spark Button */}
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-text-muted">
                <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-primary animate-ping' : 'bg-slate-600'}`} />
                <span className="hidden sm:inline">{isAnalyzing ? "Gemini is analyzing..." : "AI Ready"}</span>
            </div>
            <button
                type="button"
                onClick={handleSpark}
                disabled={isSparking || !text.trim() || isAnalyzing}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all
                    ${isSparking ? 'text-primary animate-pulse' : 'text-gray-400 hover:text-primary'}`}
            >
                {isSparking ? (
                     <>Running AI...</> 
                ) : (
                     <><span className="text-lg">✨</span> Spark</>
                )}
            </button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          variant={text.length > 0 ? 'primary' : 'secondary'} 
          disabled={!text.length || isAnalyzing} 
          size="sm"
          isLoading={isAnalyzing}
        >
          {isAnalyzing ? 'Checking...' : 'Leave Unfinished'}
        </Button>
      </div>
    </div>
  );
};

export default PostInput;