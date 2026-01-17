import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Feed from './features/unfinished/Feed';
import Lobby from './features/echoSwap/Lobby';
import ConflictRoom from './features/middleGround/ConflictRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-fog selection:text-black">
        {/* Navigation */}
        <nav className="p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            WeThinkWeConnect<span className="text-primary">.</span>
          </h1>
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-fog transition">Unfinished</Link>
            <Link to="/echo" className="hover:text-echo-a transition">EchoSwap</Link>
            <Link to="/conflict" className="hover:text-conflict transition">Middle Ground</Link>
          </div>
        </nav>

        {/* Routes */}
        <div className="container mx-auto p-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/echo" element={<Lobby />} />
            <Route path="/conflict" element={<ConflictRoom />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;