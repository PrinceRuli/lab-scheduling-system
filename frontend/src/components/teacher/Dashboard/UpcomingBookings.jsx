import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';

const UpcomingBookings = ({ bookings = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No upcoming bookings</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{booking.course}</h4>
                    <p className="text-sm text-gray-600">{booking.className}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-sm">{booking.lab?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-sm">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-sm">{booking.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white rounded-lg">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Requirements:</span> {booking.requirements || 'No special requirements'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingBookings;