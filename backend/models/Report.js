// backend/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Judul laporan wajib diisi'],
        trim: true,
        maxlength: [200, 'Judul maksimal 200 karakter']
    },
    description: {
        type: String,
        maxlength: [1000, 'Deskripsi maksimal 1000 karakter']
    },
    type: {
        type: String,
        enum: [
            'booking_summary',
            'lab_utilization', 
            'user_activity',
            'financial',
            'equipment_usage',
            'custom'
        ],
        required: true
    },
    format: {
        type: String,
        enum: ['pdf', 'excel', 'csv', 'json'],
        default: 'pdf'
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parameters: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    filters: {
        startDate: Date,
        endDate: Date,
        lab: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lab'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: String,
        category: String
    },
    fileUrl: {
        type: String
    },
    fileSize: {
        type: Number
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed', 'cancelled'],
        default: 'processing'
    },
    schedule: {
        isScheduled: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
        },
        nextRun: Date,
        lastRun: Date
    },
    accessLevel: {
        type: String,
        enum: ['private', 'department', 'public'],
        default: 'private'
    },
    tags: [{
        type: String,
        lowercase: true
    }],
    metadata: {
        generatedAt: {
            type: Date,
            default: Date.now
        },
        processingTime: Number,
        recordCount: Number,
        fileFormat: String
    },
    error: {
        message: String,
        stack: String,
        occurredAt: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ 'filters.startDate': 1, 'filters.endDate': 1 });
reportSchema.index({ 'schedule.nextRun': 1 });

// Virtual for download URL
reportSchema.virtual('downloadUrl').get(function() {
    if (this.fileUrl) {
        return `/api/reports/${this._id}/download`;
    }
    return null;
});

module.exports = mongoose.model('Report', reportSchema);