import React, { useState } from 'react';

const LabFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = {
    types: [
      { value: 'all', label: 'Semua Jenis' },
      { value: 'computer', label: 'Computer Lab' },
      { value: 'science', label: 'Science Lab' },
      { value: 'engineering', label: 'Engineering Lab' },
    ],
    status: [
      { value: 'all', label: 'Semua Status' },
      { value: 'available', label: 'Tersedia' },
      { value: 'booked', label: 'Dibooking' },
      { value: 'maintenance', label: 'Maintenance' },
    ],
    capacity: [
      { value: 'all', label: 'Semua Kapasitas' },
      { value: 'small', label: 'Kecil (< 20 orang)' },
      { value: 'medium', label: 'Medium (20-30 orang)' },
      { value: 'large', label: 'Besar (> 30 orang)' },
    ],
    equipment: [
      { value: 'pc', label: 'PC/Komputer' },
      { value: 'projector', label: 'Projector' },
      { value: 'microscope', label: 'Microscope' },
      { value: '3dprinter', label: '3D Printer' },
      { value: 'vr', label: 'VR Equipment' },
      { value: 'laser', label: 'Laser' },
    ],
  };

  const handleEquipmentToggle = (equipment) => {
    const newEquipment = filters.equipment.includes(equipment)
      ? filters.equipment.filter(e => e !== equipment)
      : [...filters.equipment, equipment];
    
    onFilterChange({ equipment: newEquipment });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filter</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset Semua
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cari Laboratorium
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Nama lab, deskripsi..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Laboratorium
        </label>
        <div className="space-y-2">
          {filterOptions.types.map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={filters.type === type.value}
                onChange={(e) => onFilterChange({ type: e.target.value })}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {filterOptions.status.map((status) => (
            <label key={status.value} className="flex items-center">
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={filters.status === status.value}
                onChange={(e) => onFilterChange({ status: e.target.value })}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Capacity Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kapasitas
        </label>
        <div className="space-y-2">
          {filterOptions.capacity.map((capacity) => (
            <label key={capacity.value} className="flex items-center">
              <input
                type="radio"
                name="capacity"
                value={capacity.value}
                checked={filters.capacity === capacity.value}
                onChange={(e) => onFilterChange({ capacity: e.target.value })}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{capacity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Equipment Filter - Collapsible */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
        >
          <span>Equipment</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="space-y-2 mt-2">
            {filterOptions.equipment.map((eq) => (
              <label key={eq.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.equipment.includes(eq.value)}
                  onChange={() => handleEquipmentToggle(eq.value)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{eq.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(filters.type !== 'all' || 
        filters.status !== 'all' || 
        filters.capacity !== 'all' || 
        filters.equipment.length > 0 ||
        filters.search) && (
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Filter Aktif:</p>
          <div className="flex flex-wrap gap-2">
            {filters.type !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {filterOptions.types.find(t => t.value === filters.type)?.label}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {filterOptions.status.find(s => s.value === filters.status)?.label}
              </span>
            )}
            {filters.capacity !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {filterOptions.capacity.find(c => c.value === filters.capacity)?.label}
              </span>
            )}
            {filters.equipment.map(eq => (
              <span key={eq} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {filterOptions.equipment.find(e => e.value === eq)?.label}
              </span>
            ))}
            {filters.search && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Pencarian: "{filters.search}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabFilters;