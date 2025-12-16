import React from 'react';

const TeachingSchedule = () => {
  const schedule = [
    { day: 'Monday', time: '09:00 - 11:00', course: 'Introduction to Programming', lab: 'Computer Lab A' },
    { day: 'Tuesday', time: '11:00 - 13:00', course: 'Data Structures', lab: 'Computer Lab B' },
    { day: 'Wednesday', time: '14:00 - 16:00', course: 'Database Systems', lab: 'Computer Lab A' },
    { day: 'Thursday', time: '10:00 - 12:00', course: 'Web Development', lab: 'Computer Lab B' },
    { day: 'Friday', time: '13:00 - 15:00', course: 'Software Engineering', lab: 'Computer Lab A' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Teaching Schedule</h3>
      <p className="text-gray-600 mb-6">Your weekly teaching schedule</p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lab
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.day}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.time}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{item.course}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.lab}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Scheduled
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total teaching hours this week: <span className="font-semibold">15 hours</span></p>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Export Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachingSchedule;