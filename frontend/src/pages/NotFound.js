import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4 py-10">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
