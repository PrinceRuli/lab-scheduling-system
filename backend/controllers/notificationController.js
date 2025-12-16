// backend/controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../config/email');

// Helper function to create notification
exports.createNotification = async (userId, title, message, type, data = {}) => {
    try {
        const notification = new Notification({
            user: userId,
            title,
            message,
            type,
            data,
            relatedTo: data.relatedTo,
            priority: data.priority || 'medium',
            expiresAt: data.expiresAt,
            actionUrl: data.actionUrl,
            actionLabel: data.actionLabel
        });
        
        await notification.save();
        
        // Send email notification if enabled
        if (data.sendEmail !== false) {
            const user = await User.findById(userId);
            if (user && user.email) {
                const emailTemplate = getEmailTemplate(type, { title, message, ...data });
                await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
            }
        }
        
        // TODO: Add WebSocket/Push notification here
        
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const { unreadOnly, type, limit = 20, page = 1 } = req.query;
        
        const filter = { user: req.user.id };
        
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }
        
        if (type) {
            filter.type = type;
        }
        
        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get unread count
        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            isRead: false
        });
        
        res.json({
            success: true,
            data: notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: await Notification.countDocuments(filter)
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            { isRead: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        const result = await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );
        
        res.json({
            success: true,
            message: `${result.modifiedCount} notifications marked as read`,
            data: { modifiedCount: result.modifiedCount }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Notification deleted',
            data: {}
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private/Admin
exports.getNotificationStats = async (req, res, next) => {
    try {
        const stats = await Notification.aggregate([
            {
                $group: {
                    _id: '$type',
                    total: { $sum: 1 },
                    unread: {
                        $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
                    }
                }
            }
        ]);
        
        const dailyStats = await Notification.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 7 }
        ]);
        
        res.json({
            success: true,
            data: {
                byType: stats,
                dailyStats,
                totalNotifications: stats.reduce((sum, s) => sum + s.total, 0),
                totalUnread: stats.reduce((sum, s) => sum + s.unread, 0)
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// Helper function to get email template
function getEmailTemplate(type, data) {
    const templates = {
        booking_created: {
            subject: `New Booking: ${data.booking?.title || 'Booking Created'}`,
            html: `
                <h2>New Booking Created</h2>
                <p>Your booking "${data.booking?.title}" has been created successfully.</p>
                <p>Status: ${data.booking?.status || 'Pending'}</p>
                ${data.actionUrl ? `<p><a href="${data.actionUrl}">View Booking</a></p>` : ''}
            `
        },
        booking_approved: {
            subject: `Booking Approved: ${data.booking?.title || 'Booking'}`,
            html: `
                <h2>Booking Approved ✅</h2>
                <p>Your booking "${data.booking?.title}" has been approved.</p>
                <p>Date: ${new Date(data.booking?.date).toLocaleDateString()}</p>
                <p>Time: ${data.booking?.startTime} - ${data.booking?.endTime}</p>
                ${data.actionUrl ? `<p><a href="${data.actionUrl}">View Details</a></p>` : ''}
            `
        },
        booking_reminder: {
            subject: `Reminder: Booking Tomorrow - ${data.booking?.title}`,
            html: `
                <h2>Booking Reminder ⏰</h2>
                <p>Reminder: You have a booking tomorrow.</p>
                <p><strong>${data.booking?.title}</strong></p>
                <p>Time: ${data.booking?.startTime} - ${data.booking?.endTime}</p>
                <p>Lab: ${data.booking?.lab?.name || 'N/A'}</p>
                ${data.actionUrl ? `<p><a href="${data.actionUrl}">View Details</a></p>` : ''}
            `
        },
        report_ready: {
            subject: `Report Ready: ${data.report?.title || 'Report'}`,
            html: `
                <h2>Report Ready 📊</h2>
                <p>Your report "${data.report?.title}" has been generated.</p>
                ${data.downloadUrl ? `<p><a href="${data.downloadUrl}">Download Report</a></p>` : ''}
            `
        }
    };
    
    return templates[type] || {
        subject: data.title || 'Notification',
        html: `<h2>${data.title || 'Notification'}</h2><p>${data.message || ''}</p>`
    };
}