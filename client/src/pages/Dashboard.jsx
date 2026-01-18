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
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-white">@{user?.username}</h1>
          <p className="text-gray-400 text-sm">Member since {new Date(user?.created_at).getFullYear()}</p>
        </div> 
        <div className="text-center px-8 border-l border-white/10">
          <div className="text-4xl font-bold text-fog">{user?.reputation_score || 0}</div>
          <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Reputation</div>
        </div>
        <button 
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 hover:underline transition-all mb-1"
        >
          Disconnect Session
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Column 1: YOUR THOUGHTS */}
        <section>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fog"></span>
            Recent Unfinished Thoughts
          </h3>
          <div className="space-y-4">
            {dashboardData?.myThoughts?.length > 0 ? (
              dashboardData.myThoughts.map((thought) => (
                <Card key={thought.id} className="p-4 border-l-4 border-l-fog">
                  <p className="text-gray-300 italic mb-2">"{thought.content}..."</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{new Date(thought.created_at).toLocaleDateString()}</span>
                    <span className="text-fog">{thought.status}</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-gray-600 text-sm italic">You haven't posted any thoughts yet.</div>
            )}
            <Button to="/unfinished" variant="outline" size="sm" className="w-full">View Feed</Button>
          </div>
        </section>

        {/* Column 2: ACTIVE SESSIONS */}
        <section>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-echo-a"></span>
            Active Sessions
          </h3>
          <div className="space-y-4">
            {dashboardData?.activeEchoSessions?.length > 0 ? (
              dashboardData.activeEchoSessions.map((session) => (
                <Card key={session.id} className="p-4 bg-echo-a/5 border-echo-a/20">
                  <h4 className="font-bold text-echo-a text-sm mb-1">EchoSwap</h4>
                  <p className="text-gray-300 text-sm truncate">{session.topic}</p>
                  <Button to="/echo" size="sm" variant="ghost" className="mt-2 text-xs">Rejoin Session</Button>
                </Card>
              ))
            ) : (
              <div className="p-6 bg-surface/20 rounded-lg text-center">
                <p className="text-gray-500 text-sm mb-4">No active debates.</p>
                <Button to="/echo" variant="echo" size="sm">Find a Partner</Button>
              </div>
            )}
          </div>
        </section>
      </div>

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