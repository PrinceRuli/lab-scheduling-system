import React, { useState, useEffect } from 'react';
import LabCard from '../components/landing/LabCard/LabCard';
import LabFilters from '../components/landing/LabFilters/LabFilters';
import LabModal from '../components/landing/LabModal/LabModal';
import { useNotification } from '../hooks/useNotification';
import labService from '../services/labService';

const LabsPage = () => {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    capacity: 'all',
    equipment: [],
    search: '',
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    filterLabs();
  }, [labs, filters]);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      // Simulated API call
      const mockLabs = [
        { 
          id: 1, 
          name: 'Computer Lab A', 
          type: 'computer', 
          capacity: 30, 
          status: 'available', 
          equipment: ['30 PCs', 'Projector', 'Whiteboard', 'Air Conditioning'], 
          description: 'Modern computer lab with high-speed internet and latest software installed. Perfect for programming classes and software development courses.',
          location: 'Building A, Room 101',
          contactPerson: 'Dr. Smith',
          contactEmail: 'smith@university.edu',
          images: ['lab1.jpg', 'lab2.jpg'],
          features: ['24/7 Access', 'High-speed Internet', 'Technical Support'],
          operatingHours: '08:00 - 20:00',
          bookingRules: 'Minimum 2 hours, Maximum 4 hours per booking'
        },
        { 
          id: 2, 
          name: 'Chemistry Lab', 
          type: 'science', 
          capacity: 25, 
          status: 'available', 
          equipment: ['Chemical Hoods', 'Safety Equipment', 'Microscopes', 'Lab Benches'], 
          description: 'Fully equipped chemistry laboratory with safety protocols and modern equipment for chemical experiments.',
          location: 'Building B, Room 201',
          contactPerson: 'Prof. Johnson',
          contactEmail: 'johnson@university.edu',
          images: ['chem1.jpg', 'chem2.jpg'],
          features: ['Safety Certified', 'Chemical Storage', 'Ventilation System'],
          operatingHours: '09:00 - 18:00',
          bookingRules: 'Safety training required'
        },
        { 
          id: 3, 
          name: 'Physics Lab', 
          type: 'science', 
          capacity: 20, 
          status: 'maintenance', 
          equipment: ['Optical Benches', 'Lasers', 'Electronic Instruments', 'Measurement Tools'], 
          description: 'Advanced physics laboratory equipped for optics, electronics, and modern physics experiments.',
          location: 'Building C, Room 301',
          contactPerson: 'Dr. Williams',
          contactEmail: 'williams@university.edu',
          images: ['physics1.jpg', 'physics2.jpg'],
          features: ['Dark Room', 'Optical Tables', 'Power Supply'],
          operatingHours: '09:00 - 17:00',
          bookingRules: 'Special training required for certain equipment'
        },
        { 
          id: 4, 
          name: 'Biology Lab', 
          type: 'science', 
          capacity: 25, 
          status: 'available', 
          equipment: ['Microscopes', 'Incubators', 'Centrifuges', 'Lab Glassware'], 
          description: 'Biology laboratory with facilities for microbiology, genetics, and cell biology research.',
          location: 'Building D, Room 401',
          contactPerson: 'Prof. Brown',
          contactEmail: 'brown@university.edu',
          images: ['bio1.jpg', 'bio2.jpg'],
          features: ['Incubation Room', 'Microscope Station', 'Sample Storage'],
          operatingHours: '08:00 - 19:00',
          bookingRules: 'Biosafety level 2 certification required'
        },
        { 
          id: 5, 
          name: 'Computer Lab B', 
          type: 'computer', 
          capacity: 40, 
          status: 'available', 
          equipment: ['40 PCs', '3D Printer', 'VR Equipment', 'Conference System'], 
          description: 'Advanced computing lab with 3D printing, VR equipment, and conference facilities for collaborative projects.',
          location: 'Building E, Room 501',
          contactPerson: 'Dr. Davis',
          contactEmail: 'davis@university.edu',
          images: ['lab3.jpg', 'lab4.jpg'],
          features: ['3D Printing', 'VR Station', 'Video Conferencing'],
          operatingHours: '08:00 - 22:00',
          bookingRules: 'VR equipment requires special booking'
        },
        { 
          id: 6, 
          name: 'Robotics Lab', 
          type: 'engineering', 
          capacity: 15, 
          status: 'booked', 
          equipment: ['Robotic Kits', 'Workstations', 'Testing Area', 'Prototyping Tools'], 
          description: 'Specialized robotics lab with equipment for building, programming, and testing robotic systems.',
          location: 'Building F, Room 601',
          contactPerson: 'Prof. Miller',
          contactEmail: 'miller@university.edu',
          images: ['robotics1.jpg', 'robotics2.jpg'],
          features: ['Testing Arena', 'Prototyping Area', 'Workshop Tools'],
          operatingHours: '10:00 - 18:00',
          bookingRules: 'Limited to engineering students'
        },
      ];
      
      setLabs(mockLabs);
      setFilteredLabs(mockLabs);
    } catch (error) {
      showNotification('error', 'Gagal memuat data laboratorium');
      console.error('Error fetching labs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLabs = () => {
    let result = [...labs];

    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(lab => lab.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(lab => lab.status === filters.status);
    }

    // Filter by capacity
    if (filters.capacity !== 'all') {
      if (filters.capacity === 'small') {
        result = result.filter(lab => lab.capacity < 20);
      } else if (filters.capacity === 'medium') {
        result = result.filter(lab => lab.capacity >= 20 && lab.capacity <= 30);
      } else if (filters.capacity === 'large') {
        result = result.filter(lab => lab.capacity > 30);
      }
    }

    // Filter by equipment
    if (filters.equipment.length > 0) {
      result = result.filter(lab =>
        filters.equipment.every(eq => 
          lab.equipment.some(labEq => 
            labEq.toLowerCase().includes(eq.toLowerCase())
          )
        )
      );
    }

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(lab =>
        lab.name.toLowerCase().includes(searchTerm) ||
        lab.description.toLowerCase().includes(searchTerm) ||
        lab.type.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredLabs(result);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      capacity: 'all',
      equipment: [],
      search: '',
    });
  };

  const handleBookLab = (labId) => {
    showNotification('info', `Membuka halaman booking untuk Lab ${labId}`);
    // Navigate to booking page
  };

  const handleViewDetails = (lab) => {
    setSelectedLab(lab);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data laboratorium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Laboratorium</h1>
        <p className="text-gray-600">
          Temukan dan booking laboratorium yang sesuai dengan kebutuhan pengajaran Anda
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <LabFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Labs Grid/List */}
        <div className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <p className="text-gray-600">
                Menampilkan <span className="font-semibold">{filteredLabs.length}</span> dari{' '}
                <span className="font-semibold">{labs.length}</span> laboratorium
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option>Urutkan berdasarkan</option>
                <option>Nama (A-Z)</option>
                <option>Kapasitas (Tinggi-Rendah)</option>
                <option>Status (Tersedia)</option>
              </select>
            </div>
          </div>

          {/* Labs Display */}
          {filteredLabs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">Laboratorium tidak ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah filter pencarian Anda</p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLabs.map((lab) => (
                    <LabCard
                      key={lab.id}
                      lab={lab}
                      onBook={() => handleBookLab(lab.id)}
                      onViewDetails={() => handleViewDetails(lab)}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredLabs.map((lab) => (
                    <LabCard
                      key={lab.id}
                      lab={lab}
                      onBook={() => handleBookLab(lab.id)}
                      onViewDetails={() => handleViewDetails(lab)}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lab Details Modal */}
      {selectedLab && (
        <LabModal
          lab={selectedLab}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBook={() => {
            setIsModalOpen(false);
            handleBookLab(selectedLab.id);
          }}
        />
      )}
    </div>
  );
};

export default LabsPage;