import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white shadow-neon hover:bg-primary/90",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md",
    gradient: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:brightness-110",
  };

  const combinedClass = `${baseStyle} ${variants[variant]} ${className}`;

  if (props.to) {
    return <Link to={props.to} className={combinedClass}>{children}</Link>;
  }

  return <button className={combinedClass} {...props}>{children}</button>;
};

export default Button;