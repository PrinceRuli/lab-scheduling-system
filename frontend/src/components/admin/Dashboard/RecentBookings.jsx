import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  MoreVertical,
  User,
  Building2,
  BookOpen
} from 'lucide-react';

const RecentBookings = ({ bookings = [] }) => {
  const getStatusBadge = (status) => {
    const config = {
      'pending': { 
        icon: Clock, 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800',
        label: 'Pending' 
      },
      'approved': { 
        icon: CheckCircle, 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        label: 'Approved' 
      },
      'rejected': { 
        icon: XCircle, 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        label: 'Rejected' 
      },
      'completed': { 
        icon: CheckCircle, 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        label: 'Completed' 
      }
    };
    
    const { icon: Icon, bg, text, label } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Recent Booking Requests</h3>
          <p className="text-sm text-gray-500">Latest laboratory booking submissions</p>
        </div>
        <Link 
          to="/admin/bookings" 
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
        >
          View All
          <span className="text-lg">→</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Teacher</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Lab</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Course</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-800">{booking.teacher?.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{booking.lab?.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{booking.course}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-700">
                    {new Date(booking.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No booking requests found</p>
          <p className="text-sm mt-1">All booking requests are processed</p>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;