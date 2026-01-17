import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PerspectiveInput from './PerspectiveInput';

const SplitScreenSession = () => {
  const location = useLocation();
  // In a real app, this data comes from Socket 'match_found' event
  const { topic } = location.state || { topic: "Technology creates isolation." };

  const [status, setStatus] = useState('active'); // active, waiting_validation, success
  const [feedback, setFeedback] = useState(null);

  const handlePerspectiveSubmit = (text) => {
    setStatus('waiting_validation');
    
    // Simulate waiting for socket response from opponent
    setTimeout(() => {
      // Mocking a successful validation
      setStatus('success');
      setFeedback("The other user confirmed you understood them perfectly.");
    }, 3000);
  };

  return (
    <div className="h-[calc(100vh-140px)] w-full flex rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      
      {/* --- LEFT PANEL: THE SUBJECT (THEIR BELIEF) --- */}
      <div className="w-1/2 bg-surface p-10 flex flex-col justify-center items-center text-center border-r border-white/5 relative overflow-hidden">
        {/* Decorative Background Text */}
        <span className="absolute top-4 left-4 text-xs font-bold text-echo-a tracking-[0.3em] opacity-50">
          TARGET SUBJECT
        </span>
        
        <div className="relative z-10">
          <div className="w-16 h-1 w-16 bg-echo-a mb-6 mx-auto rounded-full" />
          <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
            "{topic}"
          </h2>
          <p className="mt-6 text-gray-400 text-sm">
            Argue FOR this specific statement. <br/> Do not insert your own opinion yet.
          </p>
        </div>

        {/* Status Indicator for Left Panel */}
        {status === 'waiting_validation' && (
          <div className="absolute bottom-10 left-0 w-full text-center animate-pulse text-echo-a text-sm">
            Waiting for opponent to validate...
          </div>
        )}
      </div>

      {/* --- RIGHT PANEL: THE MIRROR (YOUR REWRITE) --- */}
      <div className="w-1/2 bg-background flex flex-col relative">
        <span className="absolute top-4 right-4 text-xs font-bold text-echo-b tracking-[0.3em] opacity-50">
          YOUR MIRROR
        </span>

        {status === 'success' ? (
          // Success State View
          <div className="h-full flex flex-col items-center justify-center p-10 bg-green-900/10">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Resonance Achieved</h3>
            <p className="text-gray-400 text-center">{feedback}</p>
            <button className="mt-8 px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition">
              Open Chat
            </button>
          </div>
        ) : (
          // Input State View
          <PerspectiveInput 
            onSubmit={handlePerspectiveSubmit} 
            isSubmitting={status === 'waiting_validation'} 
          />
        )}
      </div>

      {/* VS Badge in Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 z-20">
        VS
      </div>
    </div>
  );
};

export default SplitScreenSession;