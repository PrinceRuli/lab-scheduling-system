import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  ChevronRight,
  Bell
} from 'lucide-react';

const SystemAlerts = ({ alerts = [] }) => {
  const getAlertConfig = (type) => {
    switch(type) {
      case 'error':
        return {
          icon: XCircle,
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100'
        };
      case 'success':
        return {
          icon: CheckCircle,
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">System Alerts</h3>
            <p className="text-sm text-gray-500">Recent system notifications</p>
          </div>
        </div>
        {alerts.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            {alerts.length} New
          </span>
        )}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">All systems operational</p>
            <p className="text-sm text-gray-500 mt-1">No alerts at the moment</p>
          </div>
        ) : (
          alerts.map((alert, index) => {
            const config = getAlertConfig(alert.type);
            const Icon = config.icon;
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${config.bg} ${config.border} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.iconBg}`}>
                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-medium ${config.text} mb-1`}>
                        {alert.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                      View details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {alerts.length > 0 && (
        <button className="w-full mt-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-colors">
          View All Alerts
        </button>
      )}
    </div>
  );
};

export default SystemAlerts;