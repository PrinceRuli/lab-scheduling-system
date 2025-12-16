// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const {
    generateBookingSummary,
    generateLabUtilization,
    generateUserActivity,
    getReports,
    getReport,
    downloadReport,
    deleteReport,
    getReportStats
} = require('../controllers/reportController');

const { protect, authorize } = require('../middleware/auth');

// All routes protected
router.use(protect);

// Report generation endpoints
router.post('/generate/booking-summary', authorize('admin'), generateBookingSummary);
router.post('/generate/lab-utilization', authorize('admin'), generateLabUtilization);
router.post('/generate/user-activity', authorize('admin'), generateUserActivity);

// Report management endpoints
router.route('/')
    .get(authorize('admin'), getReports);

router.route('/stats')
    .get(authorize('admin'), getReportStats);

router.route('/:id')
    .get(getReport)
    .delete(authorize('admin'), deleteReport);

router.route('/:id/download')
    .get(downloadReport);

module.exports = router;