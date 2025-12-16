import { useState, useEffect } from 'react';
import { labService } from '../../../services/labService';
import { 
  Building2, 
  MapPin, 
  Users, 
  Monitor, 
  Cpu,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const LabSelection = ({ onSelectLab, selectedLabId }) => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const labsData = await labService.getAllLabs();
      setLabs(labsData.filter(lab => lab.status === 'active'));
    } catch (error) {
      console.error('Error fetching labs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'occupied':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Select Laboratory</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labs.map(lab => (
          <div
            key={lab._id}
            onClick={() => onSelectLab(lab._id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedLabId === lab._id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            {/* Lab Header */}
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg text-gray-800">{lab.name}</h4>
              <div className="flex items-center gap-1">
                {getAvailabilityIcon(lab.availability)}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  lab.availability === 'available'
                    ? 'bg-green-100 text-green-800'
                    : lab.availability === 'occupied'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {lab.availability}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">{lab.location}</p>
            </div>

            {/* Capacity & Computers */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-medium">{lab.capacity} students</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Computers</p>
                  <p className="font-medium">{lab.computerCount}</p>
                </div>
              </div>
            </div>

            {/* Equipment Tags */}
            <div className="flex flex-wrap gap-2">
              {lab.equipment?.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  <Cpu className="w-3 h-3" />
                  {item}
                </span>
              ))}
              {lab.equipment?.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{lab.equipment.length - 3} more
                </span>
              )}
            </div>

            {/* Select Indicator */}
            {selectedLabId === lab._id && (
              <div className="mt-4 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Selected
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {labs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No laboratories available at the moment</p>
        </div>
      )}
    </div>
  );
};

export default LabSelection;