import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  // 1. Fix: Define stats state
  const [stats, setStats] = useState({ vulnerability: 0, empathy: 0, diplomat: 0 });
  
  // 2. Fix: Define dashboardData state to prevent ReferenceError
  const [dashboardData, setDashboardData] = useState({
    myThoughts: [],
    activeEchoSessions: []
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stats
        const statsRes = await api.get('/users/stats');
        setStats(statsRes.data);

        // Optional: Fetch recent activity here if you have endpoints for it
        // const thoughtsRes = await api.get('/thoughts/mine'); 
        // setDashboardData(prev => ({ ...prev, myThoughts: thoughtsRes.data }));

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* --- Header --- */}
      <div className="flex justify-between items-end pt-12 mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4 md:gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left flex-grow">
                <h1 className="text-3xl font-bold text-white">@{user?.username}</h1>
                <p className="text-gray-400 text-sm">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
            </div> 
        </div>

        <div className="flex flex-col items-end gap-2">
            <div className="text-center px-6 border-l border-white/10 hidden md:block">
                <div className="text-4xl font-bold text-white opacity-80">{user?.reputation_score || 0}</div>
                <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Reputation</div>
            </div>
            <button 
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-300 hover:underline transition-all mt-2"
            >
                Disconnect Session
            </button>
        </div>
      </div>

      {/* --- Dashboard Grid (Thoughts & Sessions) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* Column 1: YOUR THOUGHTS */}
        <section>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Recent Unfinished Thoughts
          </h3>
          <div className="space-y-4">
            {dashboardData.myThoughts.length > 0 ? (
              dashboardData.myThoughts.map((thought) => (
                <div key={thought.id} className="bg-surface/40 p-4 border-l-4 border-l-blue-500 rounded-r-xl border border-white/5">
                  <p className="text-gray-300 italic mb-2">"{thought.content}..."</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{new Date(thought.created_at).toLocaleDateString()}</span>
                    <span className="text-blue-400">{thought.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-sm italic p-4 bg-white/5 rounded-xl border border-white/5">
                You haven't posted any thoughts yet.
              </div>
            )}
            
            <Link 
                to="/feed" 
                className="block w-full text-center py-2 text-sm border border-white/10 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
            >
                View Feed
            </Link>
          </div>
        </section>

        {/* Column 2: ACTIVE SESSIONS */}
        <section>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Active Sessions
          </h3>
          <div className="space-y-4">
            {dashboardData.activeEchoSessions.length > 0 ? (
              dashboardData.activeEchoSessions.map((session) => (
                <div key={session.id} className="p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl">
                  <h4 className="font-bold text-cyan-400 text-sm mb-1">EchoSwap</h4>
                  <p className="text-gray-300 text-sm truncate">{session.topic}</p>
                  <Link to="/echoswap" className="inline-block mt-2 text-xs font-bold text-cyan-500 hover:underline">
                    Rejoin Session
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 bg-surface/20 rounded-xl text-center border border-white/5">
                <p className="text-gray-500 text-sm mb-4">No active debates.</p>
                <Link 
                    to="/echoswap" 
                    className="px-4 py-2 bg-secondary text-black text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                    Find a Partner
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* --- Emotional Status (Stats) --- */}
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