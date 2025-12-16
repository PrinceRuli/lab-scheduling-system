import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { bookingService } from '../../../services/bookingService';
import { useAuth } from '../../../hooks/useAuth';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Send, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const BookingForm = ({ selectedSlot, labId, onSuccess }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!selectedSlot) {
      alert('Please select a time slot first');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        lab: labId,
        teacher: user._id,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        course: data.course,
        className: data.className,
        studentCount: parseInt(data.studentCount),
        requirements: data.requirements,
        status: 'pending'
      };

      await bookingService.createBooking(bookingData);
      reset();
      onSuccess();
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-800">New Booking Request</h3>
      </div>

      <div className="space-y-4">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name *
          </label>
          <div className="relative">
            <input
              {...register('course', { required: 'Course name is required' })}
              placeholder="e.g., Data Structures, Web Programming"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          {errors.course && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.course.message}
            </p>
          )}
        </div>

        {/* Class Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Name *
          </label>
          <input
            {...register('className', { required: 'Class name is required' })}
            placeholder="e.g., TI-3A, SI-4B"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.className && (
            <p className="mt-1 text-sm text-red-600">{errors.className.message}</p>
          )}
        </div>

        {/* Number of Students */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Students *
          </label>
          <div className="relative">
            <input
              type="number"
              {...register('studentCount', { 
                required: 'Student count is required',
                min: { value: 1, message: 'Minimum 1 student' },
                max: { value: 50, message: 'Maximum 50 students' }
              })}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          {errors.studentCount && (
            <p className="mt-1 text-sm text-red-600">{errors.studentCount.message}</p>
          )}
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements
          </label>
          <div className="relative">
            <textarea
              {...register('requirements')}
              rows="3"
              placeholder="Any specific software or equipment needed..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedSlot}
        className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
          loading || !selectedSlot
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Booking Request
          </>
        )}
      </button>

      {!selectedSlot && (
        <p className="mt-3 text-sm text-orange-600 text-center">
          Please select a time slot from the calendar first
        </p>
      )}
    </form>
  );
};

export default BookingForm;