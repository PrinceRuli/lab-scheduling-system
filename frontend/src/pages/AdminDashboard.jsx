import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Import Admin Components
import UserManagement from '../components/admin/UserManagement/UserManagement';
import LabManagement from '../components/admin/LabManagement/LabManagement';
import BookingManagement from '../components/admin/BookingManagement/BookingManagement';
import ReportView from '../components/admin/ReportView/ReportView';
import SystemSettings from '../components/admin/SystemSettings/SystemSettings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'labs':
        return <LabManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'reports':
        return <ReportView />;
      case 'settings':
        return <SystemSettings />;
      default:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome back, {user?.name}!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Users</h3>
                <p className="text-3xl font-bold text-blue-600">156</p>
                <p className="text-sm text-gray-500 mt-2">Total registered users</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Labs</h3>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-500 mt-2">Available laboratories</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Bookings</h3>
                <p className="text-3xl font-bold text-purple-600">48</p>
                <p className="text-sm text-gray-500 mt-2">This month's bookings</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div>
      {/* Dashboard Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 px-2 ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-2 ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`pb-4 px-2 ${activeTab === 'labs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Labs
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-2 ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-4 px-2 ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 px-2 ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Settings
        </button>
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;