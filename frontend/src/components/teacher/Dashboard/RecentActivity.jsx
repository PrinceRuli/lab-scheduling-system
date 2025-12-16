import { 
  CheckCircle, 
  Calendar, 
  FileText, 
  UserPlus,
  MessageSquare,
  Clock
} from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch(type) {
      case 'booking':
        return Calendar;
      case 'approval':
        return CheckCircle;
      case 'report':
        return FileText;
      case 'registration':
        return UserPlus;
      case 'message':
        return MessageSquare;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'booking':
        return 'text-blue-600 bg-blue-100';
      case 'approval':
        return 'text-green-600 bg-green-100';
      case 'report':
        return 'text-purple-600 bg-purple-100';
      case 'registration':
        return 'text-orange-600 bg-orange-100';
      case 'message':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p>No recent activity</p>
        </div>
      ) : (
        activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          
          return (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentActivity;