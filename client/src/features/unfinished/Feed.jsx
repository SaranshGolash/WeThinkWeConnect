import React, { useState, useEffect } from 'react';
import useSocket from '../../hooks/useSocket';
import PostInput from './PostInput';
import ThoughtCard from './ThoughtCard';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ThreadExpansion from './ThreadExpansion';

// Icons
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const Feed = () => {
  const socket = useSocket();
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Navigation & Filtering
  const [activeThread, setActiveThread] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const MOODS = ['All', 'Melancholic', 'Hopeful', 'Romantic', 'Dark', 'Whimsical', 'Neutral'];

  // Listen for new replies
  useEffect(() => {
    if (!socket) return;

    const handleNewReply = (replyData) => {
      const parentId = replyData.parentId;
      setThoughts((prev) =>
        prev.map((thought) =>
          thought.id == parentId || thought._id == parentId
            ? { ...thought, continuations: (thought.continuations || 0) + 1 }
            : thought
        )
      );
    };

    socket.on('new_thread_reply', handleNewReply);
    return () => socket.off('new_thread_reply', handleNewReply);
  }, [socket]);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        setLoading(true);
        // Construct URL with Query Param
        const moodParam = selectedMood !== 'All' ? `?mood=${selectedMood}` : '';
        const url = `${ENDPOINTS.THOUGHTS.GET_FEED}${moodParam}`;

        const res = await api.get(url);
        setThoughts(res.data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
        setError("Could not load thoughts. Is the server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchThoughts();
  }, [selectedMood]);

  const handleNewPost = (newThought) => {
    setThoughts((prev) => [newThought, ...prev]);
  };

  // Filter by Search Query (Client-side)
  const filteredThoughts = thoughts.filter((thought) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const content = (thought.content || '').toLowerCase();
    const username = (thought.username || thought.author?.username || '').toLowerCase();
    return content.includes(query) || username.includes(query);
  });

  if (loading && thoughts.length === 0) return <div className="text-center py-20 animate-pulse text-text-muted">Gathering unfinished thoughts...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-white mb-2 font-display">
          Unfinished Feed
        </h1>
        <p className="text-text-muted">
          A stream of consciousness. No conclusions allowed.
        </p>
      </div>
      
      <PostInput onPostSuccess={handleNewPost} />

      {/* --- Search & Filter Row --- */}
      <div className="mb-6 flex gap-3 relative z-20">
        
        {/* Search Bar (Flex Grow) */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search thoughts..."
            className="w-full bg-surface/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white transition-colors"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Filter Button & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`h-full px-4 rounded-xl border flex items-center gap-2 transition-all ${
              selectedMood !== 'All' 
                ? 'bg-secondary text-black border-secondary font-medium' 
                : 'bg-surface/60 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            <FilterIcon />
            <span className="hidden sm:inline">{selectedMood === 'All' ? 'Mood' : selectedMood}</span>
            {selectedMood !== 'All' && (
              <div 
                onClick={(e) => { e.stopPropagation(); setSelectedMood('All'); }} 
                className="hover:bg-black/20 rounded-full p-0.5 ml-1"
              >
                <XIcon />
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => {
                    setSelectedMood(mood);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    selectedMood === mood ? 'bg-secondary text-black font-bold' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Results Info --- */}
      {(searchQuery || selectedMood !== 'All') && (
        <p className="mb-4 text-sm text-text-muted">
          Showing {filteredThoughts.length} 
          {selectedMood !== 'All' && <span className="text-secondary font-bold"> {selectedMood}</span>} 
          thoughts
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </p>
      )}

      {/* --- List --- */}
      <div className="space-y-6">
        {filteredThoughts.map((thought) => (
          <ThoughtCard 
            key={thought.id} 
            thought={thought} 
            onExtend={() => setActiveThread(thought)}
            onMoodClick={(mood) => setSelectedMood(mood)}
          />
        ))}
        
        {filteredThoughts.length === 0 && (
          <div className="text-center py-10 text-gray-600 italic">
            No thoughts found. Try changing the mood or search terms.
          </div>
        )}
      </div>
      
      <div className="h-20 flex items-center justify-center text-gray-700 text-xs font-mono mt-10 uppercase tracking-widest">
        ~ End of known thoughts ~
      </div>
      
      {activeThread && (
        <ThreadExpansion rootPost={activeThread} onClose={() => setActiveThread(null)}/>
      )}
    </div>
  );
};

export default Feed;