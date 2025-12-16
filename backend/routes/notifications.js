// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationStats
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middleware/auth');

// All routes protected
router.use(protect);

router.route('/')
    .get(getNotifications);

router.route('/read-all')
    .put(markAllAsRead);

router.route('/stats')
    .get(authorize('admin'), getNotificationStats);

router.route('/:id')
    .delete(deleteNotification);

router.route('/:id/read')
    .put(markAsRead);

module.exports = router;