import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ vulnerability: 0, empathy: 0, diplomat: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch Profile Stats
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

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* Header*/}
      <div className="flex justify-between items-end pt-12 mb-12 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-text-muted text-sm uppercase tracking-widest mb-1">Overview</h2>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">@{user?.username}</span>
          </h1>
        </div>
        
        <button 
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 hover:underline transition-all mb-1"
        >
          Disconnect Session
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        {/* Feed Action */}
        <Link to="/feed" className="group relative bg-surface border border-white/5 p-8 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1">
          <div className="absolute top-4 right-4 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">🟣</div>
          <h3 className="text-xl font-bold text-white mb-2">Unfinished Feed</h3>
          <p className="text-text-muted text-sm mb-4">Share raw thoughts and see who resonates.</p>
          <span className="text-primary text-xs font-bold uppercase tracking-wider group-hover:underline">Enter the Void &rarr;</span>
        </Link>

        {/* EchoSwap Action */}
        <Link to="/echoswap" className="group relative bg-surface border border-white/5 p-8 rounded-2xl hover:border-secondary/50 transition-all hover:-translate-y-1">
          <div className="absolute top-4 right-4 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">👁️</div>
          <h3 className="text-xl font-bold text-white mb-2">Echo Swap</h3>
          <p className="text-text-muted text-sm mb-4">Step into someone else's perspective.</p>
          <span className="text-secondary text-xs font-bold uppercase tracking-wider group-hover:underline">Start Swapping &rarr;</span>
        </Link>

        {/* Conflict Action */}
        <Link to="/conflict" className="group relative bg-surface border border-white/5 p-8 rounded-2xl hover:border-red-500/50 transition-all hover:-translate-y-1">
          <div className="absolute top-4 right-4 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">⚔️</div>
          <h3 className="text-xl font-bold text-white mb-2">Middle Ground</h3>
          <p className="text-text-muted text-sm mb-4">Resolve disagreements through distance.</p>
          <span className="text-red-400 text-xs font-bold uppercase tracking-wider group-hover:underline">Find Resolution &rarr;</span>
        </Link>

      </div>

      {/* Emotional Status */}
      <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        Your Connection Impact
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Vulnerability Score */}
        <div className="bg-black/20 border border-white/5 p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl text-primary">
            🟣
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.vulnerability || 0}</div>
            <div className="text-xs text-text-muted uppercase tracking-wide">Thoughts Released</div>
          </div>
        </div>

        {/* Empathy Score */}
        <div className="bg-black/20 border border-white/5 p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-xl text-secondary">
            👁️
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.empathy || 0}</div>
            <div className="text-xs text-text-muted uppercase tracking-wide">Perspectives Echoed</div>
          </div>
        </div>

        {/* Diplomat Score */}
        <div className="bg-black/20 border border-white/5 p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-xl text-red-500">
            ⚔️
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.diplomat || 0}</div>
            <div className="text-xs text-text-muted uppercase tracking-wide">Conflicts Negotiated</div>
          </div>
        </div>

      </div>

      {/* Footer Motivation */}
      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <p className="text-gray-600 text-sm italic font-serif">
          "You are building bridges in a digital world."
        </p>
      </div>

    </div>
  );
};

export default Dashboard;