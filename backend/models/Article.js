// backend/models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Judul artikel wajib diisi'],
        trim: true,
        maxlength: [200, 'Judul maksimal 200 karakter']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: [true, 'Konten artikel wajib diisi'],
        minlength: [100, 'Konten minimal 100 karakter']
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Ringkasan maksimal 500 karakter']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['tutorial', 'berita', 'penelitian', 'tips', 'lainnya'],
        default: 'berita'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    featuredImage: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    attachments: [{
        filename: String,
        originalname: String,
        path: String,
        mimetype: String,
        size: Number
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate slug before saving
articleSchema.pre('save', async function(next) {
    if (!this.isModified('title')) {
        return next();
    }
    
    const slug = this.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    
    // Make slug unique
    let uniqueSlug = slug;
    let counter = 1;
    
    while (true) {
        const existing = await mongoose.model('Article').findOne({ slug: uniqueSlug });
        if (!existing || existing._id.equals(this._id)) {
            break;
        }
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }
    
    this.slug = uniqueSlug;
    
    // Auto-publish if admin
    if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    next();
});

// Indexes
articleSchema.index({ slug: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ views: -1 });

module.exports = mongoose.model('Article', articleSchema);