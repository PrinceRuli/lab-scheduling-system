import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { bookingService } from '../../../services/bookingService';
import { CalendarDays, Clock, CheckCircle, XCircle } from 'lucide-react';

const localizer = momentLocalizer(moment);

const BookingCalendar = ({ labId, onBookingSelect }) => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [labId]);

  const fetchBookings = async () => {
    try {
      const bookings = await bookingService.getLabBookings(labId);
      const calendarEvents = bookings.map(booking => ({
        id: booking._id,
        title: `${booking.course} - ${booking.teacher?.name}`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        resource: booking
      }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    const newSlot = { start, end };
    setSelectedSlot(newSlot);
    onBookingSelect(newSlot);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Booking Calendar</h3>
        </div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          views={['month', 'week', 'day']}
          defaultView="week"
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 17, 0, 0)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#10B981',
              borderRadius: '4px',
              border: 'none',
              color: 'white'
            }
          })}
        />
      </div>
      
      {selectedSlot && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-800">Selected Time Slot</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Start Time</p>
                <p className="font-medium text-gray-800">
                  {moment(selectedSlot.start).format('ddd, MMM D, YYYY h:mm A')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">End Time</p>
                <p className="font-medium text-gray-800">
                  {moment(selectedSlot.end).format('ddd, MMM D, YYYY h:mm A')}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedSlot(null)}
            className="mt-4 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;