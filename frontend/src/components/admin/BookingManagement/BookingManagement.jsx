import React, { useState } from 'react';

const BookingManagement = () => {
  const [bookings] = useState([
    { id: 1, lab: 'Computer Lab A', user: 'Dr. Smith', date: '2024-01-15', time: '09:00 - 11:00', status: 'approved' },
    { id: 2, lab: 'Chemistry Lab', user: 'Prof. Johnson', date: '2024-01-15', time: '11:00 - 13:00', status: 'pending' },
    { id: 3, lab: 'Physics Lab', user: 'Dr. Williams', date: '2024-01-15', time: '14:00 - 16:00', status: 'approved' },
    { id: 4, lab: 'Biology Lab', user: 'Prof. Brown', date: '2024-01-16', time: '09:00 - 11:00', status: 'rejected' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage and approve lab bookings</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.lab}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                        <button className="text-red-600 hover:text-red-900 mr-4">Reject</button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;