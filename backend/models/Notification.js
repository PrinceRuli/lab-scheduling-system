// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    type: {
        type: String,
        enum: [
            'booking_created',
            'booking_approved', 
            'booking_rejected',
            'booking_cancelled',
            'booking_reminder',
            'system_alert',
            'announcement',
            'report_ready'
        ],
        required: true
    },
    relatedTo: {
        model: {
            type: String,
            enum: ['Booking', 'Lab', 'Article', 'Report', 'User']
        },
        id: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    data: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    expiresAt: {
        type: Date
    },
    actionUrl: {
        type: String
    },
    actionLabel: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
    const seconds = Math.floor((new Date() - this.createdAt) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
});

module.exports = mongoose.model('Notification', notificationSchema);