import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Cpu, 
  AlertCircle
} from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: '+12%',
      isPositive: true,
      icon: Calendar,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: '+5%',
      isPositive: true,
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Lab Utilization',
      value: `${stats?.labUtilization || 0}%`,
      change: '+3%',
      isPositive: true,
      icon: Cpu,
      color: 'from-orange-500 to-amber-600'
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      change: '-2%',
      isPositive: false,
      icon: AlertCircle,
      color: 'from-red-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                  <span className="text-gray-500 text-xs">from last week</span>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{stat.title}</h4>
            <p className="text-sm text-gray-500">
              {index === 0 && "Total bookings this month"}
              {index === 1 && "Active teachers & staff"}
              {index === 2 && "Average lab usage rate"}
              {index === 3 && "Requests awaiting approval"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;