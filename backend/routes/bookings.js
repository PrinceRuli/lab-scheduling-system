const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getUserBookings,
  getLabBookings,
  getBookingStats,
  checkAvailability
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/user/my-bookings')
  .get(getUserBookings);

router.route('/availability')
  .get(checkAvailability);

router.route('/stats')
  .get(getBookingStats);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

router.route('/:id/approve')
  .put(authorize('admin'), approveBooking);

router.route('/:id/reject')
  .put(authorize('admin'), rejectBooking);

router.route('/:id/cancel')
  .put(cancelBooking);

router.route('/lab/:labId')
  .get(getLabBookings);

module.exports = router;