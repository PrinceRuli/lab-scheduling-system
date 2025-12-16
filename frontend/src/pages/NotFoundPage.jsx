import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-9xl font-bold text-gray-300">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-4 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;