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

      <div className="space-y-6">
        {thoughts.map((thought) => (
          <ThoughtCard key={thought.id} thought={thought} onExtend={() => setActiveThread(thought)}/>
        ))}
        
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