import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Bell, 
  TrendingUp,
  BookOpen,
  Clock,
  Users,
  Building2,
  Download,
  MessageSquare,
  Settings,
  Search
} from 'lucide-react';
import TeacherStats from './TeacherStats';
import UpcomingBookings from './UpcomingBookings';
import TeachingSchedule from './TeachingSchedule';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import { teacherService } from '../../../services/teacherService';
import { useAuth } from '../../../hooks/useAuth';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchTeacherDashboardData();
    }
  }, [user]);

  const fetchTeacherDashboardData = async () => {
    try {
      const data = await teacherService.getDashboardData(user._id);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6">
      {/* Top Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, <span className="text-green-600">{user?.name}</span>!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your teaching overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <TeacherStats stats={dashboardData?.stats} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
                <p className="text-sm text-gray-500">Your classes for today</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <TeachingSchedule schedule={dashboardData?.todaySchedule} />
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Bookings</h3>
                <p className="text-sm text-gray-500">Your future laboratory reservations</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                <Calendar className="w-4 h-4" />
                View All
              </button>
            </div>
            <UpcomingBookings bookings={dashboardData?.upcomingBookings} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </div>
            <QuickActions onActionComplete={fetchTeacherDashboardData} />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <RecentActivity activities={dashboardData?.recentActivities} />
          </div>

          {/* Download Report Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">Monthly Report</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Download your teaching activity report for this month
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs opacity-80">Classes</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs opacity-80">Hours</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;