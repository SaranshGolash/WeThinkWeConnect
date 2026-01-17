import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, // 1. Extract isLoading here
  to,                // 2. Extract 'to' here so it doesn't go to the button
  ...props           // 3. 'props' now contains everything ELSE (like onClick, type, etc)
}) => {
  
  const baseStyle = "relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-white shadow-neon hover:bg-primary/90",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md",
    gradient: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:brightness-110",
    fog: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white",
    ghost: "text-text-muted hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white"
  };

  const combinedClass = `${baseStyle} ${variants[variant] || variants.primary} ${className}`;

  // Content with Loading Spinner
  const content = (
    <>
      {isLoading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </>
  );

  // Render Logic
  if (to) {
    return <Link to={to} className={combinedClass}>{content}</Link>;
  }

  return (
    <button 
      className={combinedClass} 
      disabled={isLoading || props.disabled} 
      {...props} // Now safe to spread because isLoading is removed
    >
      {content}
    </button>
  );
};

export default Button;