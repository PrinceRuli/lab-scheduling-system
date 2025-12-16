import { BookOpen, Clock, Users, Building2 } from 'lucide-react';

const TeacherStats = ({ stats }) => {
  const statItems = [
    {
      title: "Today's Classes",
      value: stats?.todayClasses || 0,
      icon: BookOpen,
      color: "from-green-500 to-emerald-600",
      textColor: "text-green-700"
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: Clock,
      color: "from-orange-500 to-amber-600",
      textColor: "text-orange-700"
    },
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-700"
    },
    {
      title: "Labs Used",
      value: stats?.labsUsed || 0,
      icon: Building2,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-lg font-bold ${stat.textColor}`}>
                {stat.value}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{stat.title}</h4>
            <p className="text-sm text-gray-500">
              {index === 0 && "Classes scheduled for today"}
              {index === 1 && "Awaiting approval"}
              {index === 2 && "Total students this month"}
              {index === 3 && "Different labs used"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherStats;