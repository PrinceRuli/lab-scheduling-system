// backend/routes/testimonials.js
const express = require('express');
const router = express.Router();
const {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleHelpful,
    getTestimonialStats
} = require('../controllers/testimonialController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
    .get(getTestimonials);

router.route('/stats')
    .get(getTestimonialStats);

// Protected routes
router.use(protect);

router.route('/')
    .post(createTestimonial);

router.route('/:id/helpful')
    .put(toggleHelpful);

// Admin routes
router.route('/:id')
    .put(authorize('admin'), updateTestimonial)
    .delete(authorize('admin'), deleteTestimonial);

module.exports = router;