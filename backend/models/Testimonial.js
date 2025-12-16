// backend/models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Pengguna wajib diisi']
    },
    content: {
        type: String,
        required: [true, 'Testimoni wajib diisi'],
        minlength: [10, 'Testimoni minimal 10 karakter'],
        maxlength: [1000, 'Testimoni maksimal 1000 karakter']
    },
    rating: {
        type: Number,
        required: [true, 'Rating wajib diisi'],
        min: [1, 'Rating minimal 1'],
        max: [5, 'Rating maksimal 5']
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab'
    },
    images: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredOrder: {
        type: Number,
        default: 0
    },
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notHelpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update verifiedAt when isVerified changes
testimonialSchema.pre('save', function(next) {
    if (this.isModified('isVerified') && this.isVerified && !this.verifiedAt) {
        this.verifiedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Testimonial', testimonialSchema);