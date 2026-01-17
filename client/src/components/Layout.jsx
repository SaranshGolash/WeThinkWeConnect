import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-fog selection:text-black flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition">
            WeThinkWeConnect<span className="text-primary">.</span>
          </Link>

          {/* Nav Links */}
          <div className="flex gap-8 text-sm font-medium">
            <NavLink to="/" label="Unfinished" active={isActive('/')} color="hover:text-fog" />
            <NavLink to="/echo" label="EchoSwap" active={isActive('/echo')} color="hover:text-echo-a" />
            <NavLink to="/conflict" label="Middle Ground" active={isActive('/conflict')} color="hover:text-conflict" />
          </div>

          {/* User Profile / Auth Placeholder */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xs font-mono">
              SG
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-6 py-8 max-w-5xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-gray-600 text-xs">
        &copy; 2026 Continuum Engine. Built for empathy.
      </footer>
    </div>
  );
};

// Helper Sub-component for Links
const NavLink = ({ to, label, active, color }) => (
  <Link 
    to={to} 
    className={`transition-colors duration-200 ${active ? 'text-white font-bold' : 'text-gray-400'} ${color}`}
  >
    {label}
  </Link>
);

export default Layout;