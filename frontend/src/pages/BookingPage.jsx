import { useState } from 'react';
import { Calendar, PlusCircle, Building2 } from 'lucide-react';
import LabSelection from '../components/teacher/BookingInterface/LabSelection';
import BookingCalendar from '../components/teacher/BookingInterface/BookingCalendar';
import BookingForm from '../components/teacher/BookingInterface/BookingForm';

const BookingPage = () => {
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSuccess = () => {
    setSelectedSlot(null);
    alert('Booking created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Laboratory Booking System
            </h1>
            <p className="text-gray-600 mt-2">
              Select a lab, choose your time slot, and submit your booking request
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${selectedLabId ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedLabId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm mt-2">Select Lab</span>
            </div>
            
            <div className={`w-16 h-1 ${selectedLabId ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${selectedSlot ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedSlot ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm mt-2">Select Time</span>
            </div>
            
            <div className={`w-16 h-1 ${selectedSlot ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-sm mt-2">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Lab Selection & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <LabSelection 
              onSelectLab={setSelectedLabId} 
              selectedLabId={selectedLabId}
            />
            
            {selectedLabId && (
              <BookingCalendar 
                labId={selectedLabId} 
                onBookingSelect={handleSlotSelect}
              />
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            {selectedLabId ? (
              <BookingForm 
                selectedSlot={selectedSlot}
                labId={selectedLabId}
                onSuccess={handleBookingSuccess}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Select a Laboratory
                </h3>
                <p className="text-gray-500 mb-6">
                  Please select a laboratory from the left panel to start booking
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <span className="text-sm">Choose a laboratory</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <span className="text-sm">Select available time slot</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <span className="text-sm">Fill booking details</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;