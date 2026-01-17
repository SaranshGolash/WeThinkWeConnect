import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-black pt-16 pb-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND COLUMN */}
          <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-display font-bold text-white tracking-tighter">
            WeThink<span className="text-secondary">WeConnect</span>
          </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              The anti-social network designed for incomplete thoughts, radical empathy, and conflict resolution.
            </p>
          </div>

          {/* EXPLORE COLUMN */}
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li>
                <Link to={ROUTES.UNFINISHED} className="hover:text-primary transition-colors">Unfinished Thoughts</Link>
              </li>
              <li>
                <Link to={ROUTES.ECHOSWAP} className="hover:text-secondary transition-colors">EchoSwap</Link>
              </li>
              <li>
                <Link to={ROUTES.CONFLICT} className="hover:text-accent transition-colors">The Middle Ground</Link>
              </li>
            </ul>
          </div>

          {/* ACCOUNT COLUMN */}
          <div>
            <h4 className="text-white font-bold mb-6">Account</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li>
                <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Log In</Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">Create Account</Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD} className="hover:text-white transition-colors">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* LEGAL / SOCIAL */}
          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>GitHub</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">Open Source</span>
                </a>
              </li>
              <li>
                <span className="opacity-50 cursor-not-allowed">Twitter (Coming Soon)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted font-mono">
            &copy; {currentYear} WeThinkWeConnect. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-text-muted font-mono">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;