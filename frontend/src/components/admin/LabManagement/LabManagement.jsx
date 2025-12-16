import React, { useState } from 'react';

const LabManagement = () => {
  const [labs] = useState([
    { id: 1, name: 'Computer Lab A', type: 'computer', capacity: 30, status: 'active', equipment: '30 PCs, Projector' },
    { id: 2, name: 'Chemistry Lab', type: 'science', capacity: 25, status: 'active', equipment: 'Chemical hoods, Safety equipment' },
    { id: 3, name: 'Physics Lab', type: 'science', capacity: 20, status: 'maintenance', equipment: 'Optical benches, Lasers' },
    { id: 4, name: 'Biology Lab', type: 'science', capacity: 25, status: 'active', equipment: 'Microscopes, Incubators' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Lab Management</h1>
          <p className="text-gray-600">Manage all laboratory resources</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg">
          Add New Lab
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Total Labs</h3>
          <p className="text-3xl font-bold text-blue-600">{labs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Available</h3>
          <p className="text-3xl font-bold text-green-600">{labs.filter(l => l.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Under Maintenance</h3>
          <p className="text-3xl font-bold text-yellow-600">{labs.filter(l => l.status === 'maintenance').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Total Capacity</h3>
          <p className="text-3xl font-bold text-purple-600">{labs.reduce((sum, lab) => sum + lab.capacity, 0)}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lab Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
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
              {labs.map((lab) => (
                <tr key={lab.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lab.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{lab.type} lab</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lab.capacity} students</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{lab.equipment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      lab.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lab.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900 mr-4">Equipment</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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

export default LabManagement;