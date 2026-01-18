import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ vulnerability: 0, empathy: 0, diplomat: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculate Level based on total interactions
  const totalScore = stats.vulnerability + stats.empathy + stats.diplomat;
  const level = Math.floor(totalScore / 10) + 1;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/10 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl font-bold text-black shadow-neon">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">@{user?.username}</h1>
            <p className="text-text-muted">Level {level} Connector</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="mt-4 md:mt-0 px-6 py-2 border border-white/10 rounded-full text-sm hover:bg-white/5 transition-colors text-red-400"
        >
          Disconnect Session
        </button>
      </div>

      {/* The Emotional Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Vulnerability Card (Feed) */}
        <div className="bg-surface/50 border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🟣</span>
          </div>
          <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Vulnerability Score</h3>
          <div className="text-5xl font-bold text-white mb-2">{stats.vulnerability}</div>
          <p className="text-sm text-gray-500">Unfinished thoughts released into the void.</p>
          <div className="h-1 w-full bg-gray-800 mt-6 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${Math.min(stats.vulnerability * 2, 100)}%` }} />
          </div>
        </div>

        {/* 2. Empathy Card (EchoSwap) */}
        <div className="bg-surface/50 border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-secondary/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">👁️</span>
          </div>
          <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Empathy Score</h3>
          <div className="text-5xl font-bold text-white mb-2">{stats.empathy}</div>
          <p className="text-sm text-gray-500">Perspectives reshaped and echoed.</p>
          <div className="h-1 w-full bg-gray-800 mt-6 rounded-full overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: `${Math.min(stats.empathy * 2, 100)}%` }} />
          </div>
        </div>

        {/* 3. Diplomat Card (MiddleGround) */}
        <div className="bg-surface/50 border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">⚔️</span>
          </div>
          <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Diplomat Score</h3>
          <div className="text-5xl font-bold text-white mb-2">{stats.diplomat}</div>
          <p className="text-sm text-gray-500">Conflicts engaged and negotiated.</p>
          <div className="h-1 w-full bg-gray-800 mt-6 rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${Math.min(stats.diplomat * 5, 100)}%` }} />
          </div>
        </div>

      </div>

      {/* Footer / Quote */}
      <div className="mt-16 text-center text-gray-600 italic font-serif">
        "We are the sum of our connections."
      </div>
    </div>
  );
};

export default Profile;