import React, { useState } from 'react';

const LabModal = ({ lab, isOpen, onClose, onBook }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen) return null;

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
      case 'computer': return '💻 Computer Lab';
      case 'science': return '🔬 Science Lab';
      case 'engineering': return '⚙️ Engineering Lab';
      default: return '🏫 General Lab';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{lab.name}</h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(lab.status)}`}>
                    {getStatusText(lab.status)}
                  </span>
                </div>
                <p className="text-gray-600">{getTypeIcon(lab.type)} • {lab.location}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'details' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Detail
              </button>
              <button
                onClick={() => setActiveTab('equipment')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'equipment' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Equipment
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'rules' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Aturan & Jadwal
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
                  <p className="text-gray-600">{lab.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Informasi Utama</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kapasitas</span>
                        <span className="font-medium">{lab.capacity} orang</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lokasi</span>
                        <span className="font-medium">{lab.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kontak</span>
                        <span className="font-medium">{lab.contactPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{lab.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Fasilitas</h3>
                    <div className="space-y-2">
                      {lab.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'equipment' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Daftar Equipment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lab.equipment.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-blue-600">🔧</span>
                      </div>
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="text-sm text-gray-600">Equipment tersedia</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Jam Operasional</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{lab.operatingHours}</p>
                    <p className="text-sm text-gray-600 mt-1">Senin - Jumat</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Aturan Booking</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800">{lab.bookingRules}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Persyaratan</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Registrasi pengguna terverifikasi</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Booking minimal 2 jam sebelumnya</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Laporan penggunaan wajib diisi setelah selesai</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">
                  Status: <span className="font-medium">{getStatusText(lab.status)}</span>
                </p>
                {lab.status === 'available' && (
                  <p className="text-sm text-green-600 mt-1">Siap digunakan untuk booking</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    onBook();
                    onClose();
                  }}
                  disabled={lab.status !== 'available'}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    lab.status === 'available'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabModal;