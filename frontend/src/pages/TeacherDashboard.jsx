import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Import Teacher Components
import Analytics from '../components/teacher/Analytics/Analytics';
import BookingHistory from '../components/teacher/BookingHistory/BookingHistory';
import LabUsageChart from '../components/teacher/LabUsageChart/LabUsageChart';
import ReportGenerator from '../components/teacher/ReportGenerator/ReportGenerator';
import TeachingSchedule from '../components/teacher/TeachingSchedule/TeachingSchedule';
import ArticleReport from '../components/teacher/ArticleReport/ArticleReport';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />;
      case 'booking':
        return <BookingHistory />;
      case 'usage':
        return <LabUsageChart />;
      case 'reports':
        return <ReportGenerator />;
      case 'schedule':
        return <TeachingSchedule />;
      case 'articles':
        return <ArticleReport />;
      default:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome back, {user?.name}!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-sm text-gray-500 mt-2">Active bookings</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-500 mt-2">Scheduled sessions</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Availability</h3>
                <p className="text-3xl font-bold text-purple-600">92%</p>
                <p className="text-sm text-gray-500 mt-2">Lab availability rate</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold mb-2">Lab Hours</h4>
                <p className="text-2xl font-bold text-blue-600">72 hrs</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold mb-2">Students</h4>
                <p className="text-2xl font-bold text-green-600">240</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold mb-2">Courses</h4>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold mb-2">Articles</h4>
                <p className="text-2xl font-bold text-yellow-600">4</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div>
      {/* Dashboard Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'booking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Booking History
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'usage' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Lab Usage
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-4 px-2 whitespace-nowrap ${
            activeTab === 'articles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
        >
          Articles
        </button>
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  );
};

export default TeacherDashboard;