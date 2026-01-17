import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
  const [thoughts, setThoughts] = useState([]);
  const [input, setInput] = useState("");

  // Fetch thoughts on load
  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        setThoughts([
          { id: 1, username: 'saransh', content: 'I feel like learning coding is actually making me less creative because...', continuations: 2 },
          { id: 2, username: 'anon', content: 'Friendship in 2026 feels transactional, almost like...', continuations: 5 }
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchThoughts();
  }, []);

  return (
    <div>
      {/* Input Area */}
      <div className="mb-12 bg-surface p-6 rounded-lg border border-white/5 shadow-xl">
        <label className="text-fog text-xs font-bold tracking-widest uppercase mb-2 block">
          Start an incomplete thought
        </label>
        <textarea
          className="w-full bg-black/20 text-white text-lg font-serif p-4 rounded focus:outline-none focus:ring-1 focus:ring-fog resize-none placeholder-gray-600"
          rows="2"
          placeholder="I have been wondering if..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500">No conclusions allowed.</span>
          <button className="bg-fog text-black font-bold px-6 py-2 rounded hover:bg-white transition">
            Release
          </button>
        </div>
      </div>

      {/* The Feed */}
      <div className="space-y-6">
        {thoughts.map((t) => (
          <div key={t.id} className="group relative pl-8 border-l-2 border-gray-700 hover:border-fog transition-colors duration-300">
            {/* Design Element: Little dot on the timeline */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-background border-2 border-gray-700 rounded-full group-hover:border-fog transition-colors" />
            
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">@{t.username}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                {t.status || 'incomplete'}
              </span>
            </div>
            
            <p className="text-xl font-serif text-gray-200 leading-relaxed italic opacity-90 group-hover:opacity-100">
              "{t.content}..."
            </p>

            <div className="mt-4 flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <button className="text-xs font-bold text-fog hover:underline">
                Extend ({t.continuations})
              </button>
              <button className="text-xs font-bold text-gray-400 hover:text-white">
                Clarify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;