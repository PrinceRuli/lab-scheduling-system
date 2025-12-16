import React, { useState } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maxBookingDays: 30,
    bookingStartTime: '08:00',
    bookingEndTime: '18:00',
    autoApprove: false,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system preferences and parameters</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Booking Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Booking Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Booking Days Ahead
                </label>
                <input
                  type="number"
                  name="maxBookingDays"
                  value={settings.maxBookingDays}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  min="1"
                  max="365"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Start Time
                </label>
                <input
                  type="time"
                  name="bookingStartTime"
                  value={settings.bookingStartTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking End Time
                </label>
                <input
                  type="time"
                  name="bookingEndTime"
                  value={settings.bookingEndTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
          
          {/* System Preferences */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">System Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="autoApprove"
                  checked={settings.autoApprove}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Auto-approve bookings (requires manual approval if disabled)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Enable email notifications for bookings
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Maintenance mode (disable booking during maintenance)
                </label>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;