import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(ENDPOINTS.USERS.DASHBOARD);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading profile...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER STATS */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-surface/30 p-8 rounded-2xl border border-white/5">
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
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* COLUMN 1: YOUR THOUGHTS */}
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

        {/* COLUMN 2: ACTIVE SESSIONS */}
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
  );
};

export default Dashboard;