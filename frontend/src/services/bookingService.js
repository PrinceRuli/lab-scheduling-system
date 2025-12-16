import api from './api';

const bookingService = {
  getAllBookings: async (params = {}) => {
    try {
      return await api.get('/bookings', { params });
    } catch (error) {
      throw error;
    }
  },

  getMyBookings: async () => {
    try {
      return await api.get('/bookings/my');
    } catch (error) {
      throw error;
    }
  },

  getBookingById: async (id) => {
    try {
      return await api.get(`/bookings/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      return await api.post('/bookings', bookingData);
    } catch (error) {
      throw error;
    }
  },

  updateBooking: async (id, bookingData) => {
    try {
      return await api.put(`/bookings/${id}`, bookingData);
    } catch (error) {
      throw error;
    }
  },

  deleteBooking: async (id) => {
    try {
      return await api.delete(`/bookings/${id}`);
    } catch (error) {
      throw error;
    }
  },

  approveBooking: async (id) => {
    try {
      return await api.patch(`/bookings/${id}/approve`);
    } catch (error) {
      throw error;
    }
  },

  rejectBooking: async (id, reason) => {
    try {
      return await api.patch(`/bookings/${id}/reject`, { reason });
    } catch (error) {
      throw error;
    }
  },

  checkAvailability: async (labId, startTime, endTime) => {
    try {
      return await api.post('/bookings/check-availability', {
        labId,
        startTime,
        endTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default bookingService;