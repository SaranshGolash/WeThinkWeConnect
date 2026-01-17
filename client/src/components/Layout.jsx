import React from 'react';
import Navbar from './ui/Navbar';
import Footer from './ui/Footer'; // <--- Import the new Footer

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white">
      
      {/* Navbar sits on top */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col">
        {children}
      </main>

      {/* The New Footer */}
      <Footer /> 
    </div>
  );
};

export default Layout;