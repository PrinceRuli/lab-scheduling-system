import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Admin navigation items
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/labs', label: 'Lab Management', icon: '🔬' },
    { path: '/admin/bookings', label: 'Booking Management', icon: '📅' },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'System Settings', icon: '⚙️' },
  ];

  // Teacher navigation items
  const teacherNavItems = [
    { path: '/teacher', label: 'Dashboard', icon: '📊' },
    { path: '/teacher/schedule', label: 'My Schedule', icon: '📅' },
    { path: '/teacher/book-lab', label: 'Book Lab', icon: '🔬' },
    { path: '/teacher/booking-history', label: 'Booking History', icon: '📋' },
    { path: '/teacher/resources', label: 'Resources', icon: '📚' },
    { path: '/teacher/profile', label: 'Profile', icon: '👤' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : teacherNavItems;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">LS</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">LabScheduler</h1>
            <p className="text-xs text-gray-400 capitalize">{user?.role} Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive || location.pathname.startsWith(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;