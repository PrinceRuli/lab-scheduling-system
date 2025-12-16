import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../hooks/useNotification';
import { X } from 'lucide-react';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showNotification('success', 'Logged out successfully');
    navigate('/login');
  };

  // Public navigation items tanpa icon
  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Labs', path: '/labs' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Articles', path: '/articles' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${
      !user ? 'fixed top-0 left-0 right-0 z-50' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo dengan warna cyan */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LS</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">LabScheduler</span>
                {user && (
                  <p className="text-xs text-gray-500 capitalize">Welcome, {user.role}</p>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Tanpa icons */}
          {!user && (
            <nav className="hidden lg:flex items-center space-x-8">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isProfileMenuOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Login/Signup - Button rounded-full */}
                <div className="hidden lg:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-cyan-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-sm hover:shadow"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile Menu Button - Hanya icon X untuk close */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu for Public Users - Tanpa icons */}
        {!user && isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slideDown">
            <div className="flex flex-col space-y-3">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-cyan-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-full mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-2.5 rounded-full shadow-sm hover:shadow"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS untuk animasi */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;