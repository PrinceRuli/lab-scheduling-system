import React from 'react';

const ScheduleCards = () => {
  const schedules = [
    { id: 1, lab: 'Computer Lab A', time: '9:00 AM - 11:00 AM', status: 'Available' },
    { id: 2, lab: 'Chemistry Lab', time: '11:00 AM - 1:00 PM', status: 'Booked' },
    { id: 3, lab: 'Physics Lab', time: '2:00 PM - 4:00 PM', status: 'Available' },
    { id: 4, lab: 'Biology Lab', time: '4:00 PM - 6:00 PM', status: 'Available' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg text-gray-900">{schedule.lab}</h3>
            <span className={`text-xs px-3 py-1 rounded-full ${
              schedule.status === 'Available' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {schedule.status}
            </span>
          </div>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Time:</span> {schedule.time}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">Capacity:</span> 30 students
          </p>
          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2.5 rounded-full transition-colors">
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScheduleCards;