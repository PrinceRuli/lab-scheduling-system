import { Clock, MapPin, Users, Radio } from 'lucide-react';

const TeachingSchedule = ({ schedule = [] }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentClass = () => {
    const now = new Date();
    return schedule.find(cls => {
      const start = new Date(cls.startTime);
      const end = new Date(cls.endTime);
      return now >= start && now <= end;
    });
  };

  const currentClass = getCurrentClass();

  return (
    <div>
      {currentClass && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-green-600 animate-pulse" />
              <h4 className="font-semibold text-green-800">Currently Teaching</h4>
            </div>
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              LIVE
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-green-600 mb-1">Course</p>
              <p className="font-bold text-gray-800">{currentClass.course}</p>
            </div>
            <div>
              <p className="text-sm text-green-600 mb-1">Laboratory</p>
              <p className="font-medium text-gray-800 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentClass.lab?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600 mb-1">Class</p>
              <p className="font-medium text-gray-800 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {currentClass.className}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600 mb-1">Time</p>
              <p className="font-medium text-gray-800 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(currentClass.startTime)} - {formatTime(currentClass.endTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No classes scheduled for today</p>
          </div>
        ) : (
          schedule.map((cls, index) => {
            const isCurrent = currentClass?._id === cls._id;
            const isUpcoming = new Date(cls.startTime) > new Date();
            const isPast = new Date(cls.endTime) < new Date();

            return (
              <div
                key={cls._id || index}
                className={`p-4 rounded-xl border ${
                  isCurrent
                    ? 'border-green-300 bg-green-50'
                    : isUpcoming
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500">
                        {formatTime(cls.startTime).split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTime(cls.startTime).split(' ')[1]}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div>
                      <h5 className="font-bold text-gray-800">{cls.course}</h5>
                      <p className="text-sm text-gray-600">
                        {cls.lab?.name} • {cls.className}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isCurrent
                        ? 'bg-green-100 text-green-800'
                        : isUpcoming
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isCurrent ? 'In Progress' : isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeachingSchedule;