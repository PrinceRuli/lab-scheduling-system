import { useNavigate } from 'react-router-dom';
import { 
  CalendarPlus, 
  CalendarDays, 
  FileText, 
  UserCircle,
  Settings,
  MessageSquare,
  Download,
  Bell
} from 'lucide-react';

const QuickActions = ({ onActionComplete }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'New Booking',
      description: 'Book a laboratory',
      icon: CalendarPlus,
      action: () => navigate('/booking'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'View Calendar',
      description: 'Check your schedule',
      icon: CalendarDays,
      action: () => navigate('/schedule'),
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Generate Report',
      description: 'Create usage report',
      icon: FileText,
      action: () => navigate('/reports'),
      color: 'from-orange-500 to-amber-600'
    },
    {
      title: 'Update Profile',
      description: 'Edit your information',
      icon: UserCircle,
      action: () => navigate('/profile'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Notifications',
      description: 'View all notifications',
      icon: Bell,
      action: () => navigate('/notifications'),
      color: 'from-red-500 to-rose-600'
    },
    {
      title: 'Settings',
      description: 'Account settings',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'from-gray-500 to-gray-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={action.action}
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4 hover:border-transparent hover:shadow-lg transition-all duration-300"
          >
            {/* Background Gradient on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} w-fit mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
              <p className="text-xs text-gray-500">{action.description}</p>
              
              {/* Arrow Indicator */}
              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">→</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;