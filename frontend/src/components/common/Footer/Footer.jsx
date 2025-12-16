import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
              <span className="text-xl font-bold">LabScheduler</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Modern laboratory scheduling system for educational institutions. 
              Streamline lab bookings, manage resources, and enhance teaching efficiency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/labs" className="text-gray-400 hover:text-white transition-colors">Labs</Link></li>
              <li><Link to="/schedule" className="text-gray-400 hover:text-white transition-colors">Schedule</Link></li>
              <li><Link to="/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@labscheduler.edu</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 University St, Education City</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LabScheduler. All rights reserved.</p>
          <p className="mt-2 text-sm">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;