import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r  rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Simplify Your Lab Management
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Streamline laboratory scheduling, booking, and resource management for educational institutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-grey-50 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            to="/labs"
            className="border-2 text-white bg-cyan-500 hover:bg-cyan-600 font-bold py-3 px-8 rounded-full transition-colors"
          >
            Explore Labs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;