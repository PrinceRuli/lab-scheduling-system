import React from 'react';

const LabUsageChart = () => {
  const usageData = [
    { lab: 'Computer Lab A', usage: 85 },
    { lab: 'Chemistry Lab', usage: 70 },
    { lab: 'Physics Lab', usage: 60 },
    { lab: 'Biology Lab', usage: 75 },
    { lab: 'Computer Lab B', usage: 90 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Lab Usage Statistics</h3>
      <p className="text-gray-600 mb-6">Usage percentage of different labs</p>
      
      <div className="space-y-4">
        {usageData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.lab}</span>
              <span className="text-sm font-medium text-gray-900">{item.usage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  item.usage >= 80 ? 'bg-green-500' :
                  item.usage >= 60 ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}
                style={{ width: `${item.usage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Low Usage (&lt; 60%)</span>
          <span>Medium Usage (60-80%)</span>
          <span>High Usage (&gt; 80%)</span>
        </div>
      </div>
    </div>
  );
};

export default LabUsageChart;