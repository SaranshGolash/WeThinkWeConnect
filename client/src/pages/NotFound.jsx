import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-gray-800 select-none">404</h1>
      <h2 className="text-2xl text-white mt-4 font-serif">This thought remains unfinished.</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for does not exist, or perhaps it just hasn't been thought of yet.
      </p>
      <Link 
        to="/" 
        className="mt-8 px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition"
      >
        Return to Safety
      </Link>
    </div>
  );
};

export default NotFound;