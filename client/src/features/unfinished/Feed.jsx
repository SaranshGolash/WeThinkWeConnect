import React, { useState, useEffect } from 'react';
import useSocket from '../../hooks/useSocket';
import PostInput from './PostInput';
import ThoughtCard from './ThoughtCard';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ThreadExpansion from './ThreadExpansion';

const Feed = () => {
  const socket = useSocket();
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for new thread replies to update continuation counts
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

    return () => {
      socket.off('new_thread_reply', handleNewReply);
    };
  }, [socket]);

  // Fetches thoughts on load
  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const res = await api.get(ENDPOINTS.THOUGHTS.GET_FEED);
        setThoughts(res.data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
        setError("Could not load thoughts. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchThoughts();
  }, []);

  // Handles the success callback from PostInput
  const handleNewPost = (newThought) => {
    // Adds the new thought to the TOP of the list immediately
    setThoughts((prev) => [newThought, ...prev]);
  };

  // Filter thoughts based on search query
  const filteredThoughts = thoughts.filter((thought) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const content = (thought.content || '').toLowerCase();
    const username = (thought.username || thought.author?.username || '').toLowerCase();
    
    return content.includes(query) || username.includes(query);
  });

  if (loading) return <div className="text-center py-20 animate-pulse text-text-muted">Gathering unfinished thoughts...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-white mb-2 font-display">
          Unfinished Feed
        </h1>
        <p className="text-text-muted">
          A stream of consciousness. No conclusions allowed.
        </p>
      </div>
      
      <PostInput onPostSuccess={handleNewPost} />

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search thoughts, topics, or users..."
            className="w-full bg-surface/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-text-muted">
            {filteredThoughts.length === 1 
              ? `Found 1 thought` 
              : `Found ${filteredThoughts.length} thoughts`}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {filteredThoughts.map((thought) => (
          <ThoughtCard key={thought.id} thought={thought} onExtend={() => setActiveThread(thought)}/>
        ))}
        
        {filteredThoughts.length === 0 && thoughts.length > 0 && (
          <div className="text-center py-10 text-gray-600 italic">
            No thoughts found matching "{searchQuery}". Try a different search term.
          </div>
        )}
        
        {thoughts.length === 0 && (
          <div className="text-center py-10 text-gray-600 italic">
            The void is empty. Start a thought above.
          </div>
        )}
      </div>
      
      <div className="h-20 flex items-center justify-center text-gray-700 text-xs font-mono mt-10 uppercase tracking-widest">
        ~ End of known thoughts ~
      </div>
      {activeThread && (<ThreadExpansion rootPost={activeThread} onClose={() => setActiveThread(null)}/>)}
    </div>
  );
};

export default Feed;