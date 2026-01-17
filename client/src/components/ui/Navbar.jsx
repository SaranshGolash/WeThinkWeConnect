import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ✅ FIX: Go up 2 levels (../../) to reach 'src', then into 'context'
import { useAuth } from '../../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="text-2xl font-display font-bold text-white tracking-tighter">
            WeThink<span className="text-secondary">WeConnect</span>
          </Link>
          <div className="flex items-center gap-6">
            
            {user ? (
              // If logged in
              <>
                <span className="hidden md:block text-sm text-gray-400">
                  Hello, {user.username || user.email?.split('@')[0]}
                </span>
                
                <Link 
                  to="/profile"
                  className="text-white hover:text-secondary transition text-sm font-bold"
                >
                  Dashboard
                </Link>

                <button 
                  onClick={handleLogout}
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              // If not logged in
              <Link 
                to="/login"
                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
              >
                Login
              </Link>
            )}
            
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;