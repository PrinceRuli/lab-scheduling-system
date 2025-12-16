import React from 'react';

const LabCard = ({ lab, onBook, onViewDetails, viewMode = 'grid' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'booked': return 'Dibooking';
      case 'maintenance': return 'Maintenance';
      default: return 'Tidak Diketahui';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'computer': return '💻';
      case 'science': return '🔬';
      case 'engineering': return '⚙️';
      default: return '🏫';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">{getTypeIcon(lab.type)}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{lab.name}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lab.status)}`}>
                  {getStatusText(lab.status)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lab.description}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-1">👥</span>
                  <span>Kapasitas: {lab.capacity} orang</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-1">📍</span>
                  <span>{lab.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-1">🔧</span>
                  <span>{lab.equipment.length} equipment</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBook}
              disabled={lab.status !== 'available'}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                lab.status === 'available'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Booking
            </button>
            <button
              onClick={onViewDetails}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Detail
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Status Bar */}
      <div className={`h-2 ${getStatusColor(lab.status).replace('100', '500').replace('text-', 'bg-')}`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{getTypeIcon(lab.type)}</span>
              <h3 className="font-bold text-lg text-gray-900">{lab.name}</h3>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lab.status)}`}>
              {getStatusText(lab.status)}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lab.description}</p>
        
        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">👥</span>
              <span className="text-sm">Kapasitas</span>
            </div>
            <span className="font-medium">{lab.capacity} orang</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">📍</span>
              <span className="text-sm">Lokasi</span>
            </div>
            <span className="font-medium text-sm">{lab.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">🔧</span>
              <span className="text-sm">Equipment</span>
            </div>
            <span className="font-medium">{lab.equipment.length} jenis</span>
          </div>
        </div>
        
        {/* Equipment Preview */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Equipment utama:</p>
          <div className="flex flex-wrap gap-2">
            {lab.equipment.slice(0, 3).map((eq, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {eq}
              </span>
            ))}
            {lab.equipment.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{lab.equipment.length - 3} lainnya
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onBook}
            disabled={lab.status !== 'available'}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              lab.status === 'available'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {lab.status === 'available' ? 'Booking Sekarang' : 'Tidak Tersedia'}
          </button>
          <button
            onClick={onViewDetails}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabCard;