import React, { useState, useEffect } from 'react';
import PostInput from './PostInput';
import ThoughtCard from './ThoughtCard';
// import api from '../../api/axios'; // Assumption: axios instance exists

const Feed = () => {
  const [thoughts, setThoughts] = useState([]);

  // Mock Data Fetch
  useEffect(() => {
    // In real app: const res = await api.get('/thoughts');
    const mockData = [
      { id: 1, username: 'saransh', content: 'I feel like we optimize for speed but lose meaning because', created_at: '2023-10-24', continuations: 4 },
      { id: 2, username: 'dev_guru', content: 'React hooks are great but sometimes I miss classes when', created_at: '2023-10-25', continuations: 12 },
      { id: 3, username: 'philosopher', content: 'Silence is not empty, it is actually full of', created_at: '2023-10-26', continuations: 8 },
    ];
    setThoughts(mockData);
  }, []);

  const handleNewPost = (content) => {
    const newThought = {
      id: Date.now(),
      username: 'me', // Replace with Auth Context user
      content,
      created_at: new Date().toISOString(),
      continuations: 0
    };
    setThoughts([newThought, ...thoughts]);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">Unfinished Thoughts</h1>
        <p className="text-gray-400 text-sm">A place where no sentence ever ends.</p>
      </div>

      <PostInput onSubmit={handleNewPost} />

      <div className="space-y-4">
        {thoughts.map((thought) => (
          <ThoughtCard key={thought.id} thought={thought} />
        ))}
      </div>
      
      {/* "Load More" Spacer */}
      <div className="h-20 flex items-center justify-center text-gray-600 text-sm font-mono mt-10">
        ~ End of known thoughts ~
      </div>
    </div>
  );
};

export default Feed;