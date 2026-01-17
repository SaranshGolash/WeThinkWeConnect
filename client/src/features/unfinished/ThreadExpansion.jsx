import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';

const Icons = {
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  CornerDownRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
  )
};

const ThreadExpansion = ({ rootPost, onClose }) => {
  const socket = useSocket();
  const { user } = useAuth();
  
  const [replyText, setReplyText] = useState("");
  const [threadChain, setThreadChain] = useState([rootPost]);
  const [loading, setLoading] = useState(true);

  // Load existing continuations from database on mount
  useEffect(() => {
    const loadContinuations = async () => {
      try {
        const thoughtId = rootPost.id || rootPost._id;
        const res = await api.get(`/thoughts/${thoughtId}/continuations`);
        setThreadChain([rootPost, ...res.data]);
      } catch (err) {
        console.error("Failed to load continuations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContinuations();
  }, [rootPost]);

  // Listen for new replies via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewReply = (newReply) => {
      if (newReply.parentId === rootPost._id || newReply.parentId === rootPost.id) {
        setThreadChain((prev) => {
          if (prev.some(p => (p._id || p.id) === (newReply._id || newReply.id))) {
            return prev;
          }
          return [...prev, newReply];
        });
      }
    };

    socket.on('new_thread_reply', handleNewReply);

    return () => {
      socket.off('new_thread_reply', handleNewReply);
    };
  }, [socket, rootPost]);

  const handleSendReply = () => {
    if (!replyText.trim() || !socket) return;

    // Create the reply object locally
    const newReplyPayload = {
      _id: `temp-${Date.now()}`, 
      parentId: rootPost._id || rootPost.id, 
      content: replyText,
      username: user?.username || 'You', 
      author: { username: user?.username || 'You' },
      createdAt: new Date().toISOString()
    };

    setThreadChain((prev) => [...prev, newReplyPayload]);

    socket.emit('create_thread_reply', {
      parentId: rootPost._id || rootPost.id,
      content: replyText,
    });

    setReplyText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 rounded-t-2xl">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-secondary">#</span> Thread Extension
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <Icons.X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-0">
          {threadChain.map((post, index) => {
            const isLast = index === threadChain.length - 1;
            const uniqueKey = post._id || post.id || `temp-${index}-${Date.now()}`;
            const displayUsername = post.username || post.author?.username || "Anonymous";
            const initial = (displayUsername[0] || '?').toUpperCase();

            return (
              <div key={uniqueKey} className="flex gap-4 relative">
                
                <div className="flex flex-col items-center min-w-[40px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10 z-10 ${index === 0 ? 'bg-secondary text-black' : 'bg-surface text-white'}`}>
                    {initial}
                  </div>
                  
                  {!isLast && (
                    <div className="w-0.5 flex-grow bg-white/10 my-1"></div>
                  )}
                </div>

                <div className="pb-8 w-full">
                  <div className="bg-surface border border-white/5 rounded-xl p-4 hover:border-white/10 transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-gray-300">
                        @{displayUsername}
                      </span>
                      <span className="text-xs text-gray-500">
                         {post.createdAt ? new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40 rounded-b-2xl">
          <div className="flex items-start gap-4">
            <div className="pt-2 text-gray-500">
              <Icons.CornerDownRight />
            </div>
            
            <div className="flex-1 relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Extend this thought..."
                className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none h-24"
              />
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="absolute bottom-3 right-3 p-2 bg-secondary text-black rounded-full hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-4 h-4">
                  <Icons.Send />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThreadExpansion;