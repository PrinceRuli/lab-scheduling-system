import { useState, useEffect } from 'react';
import { 
  Clock,
  RefreshCw
} from 'lucide-react';
import DashboardStats from './DashboardStats';
import RecentBookings from './RecentBookings';
import LabUsageChart from './LabUsageChart';
import UserActivity from './UserActivity';
import SystemAlerts from './SystemAlerts';
import { dashboardService } from '../../../services/dashboardService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const data = await dashboardService.getAdminDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of laboratory bookings and system analytics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Quick Stats - Updated dengan DashboardStats */}
        <div className="mt-6">
          <DashboardStats stats={dashboardData?.stats} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Lab Usage This Week</h3>
              <p className="text-sm text-gray-500">Hours booked vs total capacity</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <LabUsageChart data={dashboardData?.labUsage} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">User Activity Distribution</h3>
              <p className="text-sm text-gray-500">Breakdown of user actions</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <UserActivity data={dashboardData?.userActivity} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookings bookings={dashboardData?.recentBookings} />
        </div>
        <div>
          <SystemAlerts alerts={dashboardData?.alerts} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;