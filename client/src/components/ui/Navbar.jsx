// client/src/components/ui/NavBar.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ROUTES } from '../../routes';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-7xl px-6 flex justify-between items-center pointer-events-auto">
        
        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full shadow-neon" />
          WeThinkWeConnect
        </Link>

        {/* Glass Pill Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-glass">
          <NavLink to={ROUTES.UNFINISHED} active={isActive(ROUTES.UNFINISHED)}>Unfinished</NavLink>
          <NavLink to={ROUTES.ECHOSWAP} active={isActive(ROUTES.ECHOSWAP)}>EchoSwap</NavLink>
          <NavLink to={ROUTES.CONFLICT} active={isActive(ROUTES.CONFLICT)}>Conflict</NavLink>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button onClick={logout} className="text-sm font-medium text-text-muted hover:text-white transition">
              Log Out
            </button>
          ) : (
            <Link to={ROUTES.LOGIN} className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Helper for Nav Items
const NavLink = ({ to, children, active }) => (
  <Link 
    to={to} 
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active ? 'bg-white/10 text-white shadow-inner' : 'text-text-muted hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;