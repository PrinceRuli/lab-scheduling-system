// backend/controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');
const { 
    createTestimonialValidation, 
    updateTestimonialValidation,
    toggleHelpfulValidation 
} = require('../validations/testimonialValidation');

// Helper untuk menghapus file
const deleteFile = (filePath) => {
    const fs = require('fs');
    const path = require('path');
    if (filePath && fs.existsSync(path.join(__dirname, '..', filePath))) {
        fs.unlinkSync(path.join(__dirname, '..', filePath));
    }
};

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
    try {
        // Build query
        let query;
        const reqQuery = { ...req.query };
        
        // Remove special fields
        const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'minRating'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        // Only show active testimonials for non-admin users
        if (!req.user || req.user.role !== 'admin') {
            reqQuery.isActive = true;
        }
        
        // Search functionality
        if (req.query.search) {
            reqQuery.content = { $regex: req.query.search, $options: 'i' };
        }
        
        // Filter by lab
        if (req.query.lab) {
            reqQuery.lab = req.query.lab;
        }
        
        // Filter by user
        if (req.query.user) {
            reqQuery.user = req.query.user;
        }
        
        // Filter by verified status
        if (req.query.verified) {
            reqQuery.isVerified = req.query.verified === 'true';
        }
        
        // Filter by featured status
        if (req.query.featured) {
            reqQuery.isFeatured = req.query.featured === 'true';
        }
        
        // Filter by minimum rating
        if (req.query.minRating) {
            reqQuery.rating = { $gte: parseInt(req.query.minRating) };
        }
        
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // Finding resource
        query = Testimonial.find(JSON.parse(queryStr))
            .populate('user', 'name email avatar')
            .populate('lab', 'name code')
            .populate('verifiedBy', 'name email');
        
        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        
        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-isFeatured -rating -createdAt');
        }
        
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        
        query = query.skip(startIndex).limit(limit);
        
        // Execute query
        const testimonials = await query;
        
        // Get total count
        const total = await Testimonial.countDocuments(JSON.parse(queryStr));
        
        // Pagination result
        const pagination = {};
        
        if (startIndex + limit < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }
        
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }
        
        // Calculate average rating
        const ratingStats = await Testimonial.aggregate([
            { $match: JSON.parse(queryStr) },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            success: true,
            count: testimonials.length,
            pagination,
            stats: {
                averageRating: ratingStats[0]?.averageRating || 0,
                totalRatings: ratingStats[0]?.totalRatings || 0
            },
            data: testimonials
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = async (req, res, next) => {
    try {
        // Validate input
        const { error } = createTestimonialValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        
        const { content, rating, lab } = req.body;
        
        // Check if user already submitted testimonial for this lab
        if (lab) {
            const existingTestimonial = await Testimonial.findOne({
                user: req.user.id,
                lab: lab
            });
            
            if (existingTestimonial) {
                return res.status(400).json({
                    success: false,
                    message: 'Anda sudah memberikan testimoni untuk laboratorium ini'
                });
            }
        }
        
        const testimonial = new Testimonial({
            user: req.user.id,
            content,
            rating: parseInt(rating),
            lab: lab || null
        });
        
        // Handle image uploads (if you add image upload later)
        // if (req.files && req.files.images) {
        //     testimonial.images = req.files.images.map(file => `/uploads/testimonials/${file.filename}`);
        // }
        
        await testimonial.save();
        
        // Populate data
        await testimonial.populate('user', 'name email avatar');
        if (lab) {
            await testimonial.populate('lab', 'name code');
        }
        
        res.status(201).json({
            success: true,
            message: 'Testimoni berhasil dikirim. Menunggu verifikasi admin.',
            data: testimonial
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = async (req, res, next) => {
    try {
        // Validate input
        const { error } = updateTestimonialValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        
        let testimonial = await Testimonial.findById(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimoni tidak ditemukan'
            });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && testimonial.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki izin untuk mengedit testimoni ini'
            });
        }
        
        // Handle admin-only updates
        const updateData = { ...req.body };
        
        if (req.user.role === 'admin') {
            if (updateData.isVerified !== undefined) {
                updateData.isVerified = updateData.isVerified === 'true';
                if (updateData.isVerified && !testimonial.verifiedBy) {
                    updateData.verifiedBy = req.user.id;
                }
            }
            
            if (updateData.isFeatured !== undefined) {
                updateData.isFeatured = updateData.isFeatured === 'true';
            }
            
            if (updateData.featuredOrder !== undefined) {
                updateData.featuredOrder = parseInt(updateData.featuredOrder);
            }
            
            if (updateData.isActive !== undefined) {
                updateData.isActive = updateData.isActive === 'true';
            }
        } else {
            // Remove admin-only fields for non-admin users
            delete updateData.isVerified;
            delete updateData.verifiedBy;
            delete updateData.isFeatured;
            delete updateData.featuredOrder;
            delete updateData.isActive;
        }
        
        // Update testimonial
        testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('user', 'name email avatar')
         .populate('lab', 'name code')
         .populate('verifiedBy', 'name email');
        
        res.json({
            success: true,
            message: 'Testimoni berhasil diperbarui',
            data: testimonial
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimoni tidak ditemukan'
            });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && testimonial.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki izin untuk menghapus testimoni ini'
            });
        }
        
        // Delete associated images
        if (testimonial.images && testimonial.images.length > 0) {
            testimonial.images.forEach(image => {
                deleteFile(image);
            });
        }
        
        await Testimonial.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Testimoni berhasil dihapus',
            data: {}
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle helpful status
// @route   PUT /api/testimonials/:id/helpful
// @access  Private
exports.toggleHelpful = async (req, res, next) => {
    try {
        // Validate input
        const { error } = toggleHelpfulValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        
        const testimonial = await Testimonial.findById(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimoni tidak ditemukan'
            });
        }
        
        // Check if testimonial is active
        if (!testimonial.isActive && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Testimoni tidak tersedia'
            });
        }
        
        const userId = req.user.id;
        const { isHelpful } = req.body;
        
        // Remove from opposite array first
        if (isHelpful) {
            // Remove from notHelpful if exists
            const notHelpfulIndex = testimonial.notHelpful.indexOf(userId);
            if (notHelpfulIndex !== -1) {
                testimonial.notHelpful.splice(notHelpfulIndex, 1);
            }
            
            // Toggle helpful
            const helpfulIndex = testimonial.helpful.indexOf(userId);
            if (helpfulIndex === -1) {
                testimonial.helpful.push(userId);
            } else {
                testimonial.helpful.splice(helpfulIndex, 1);
            }
        } else {
            // Remove from helpful if exists
            const helpfulIndex = testimonial.helpful.indexOf(userId);
            if (helpfulIndex !== -1) {
                testimonial.helpful.splice(helpfulIndex, 1);
            }
            
            // Toggle notHelpful
            const notHelpfulIndex = testimonial.notHelpful.indexOf(userId);
            if (notHelpfulIndex === -1) {
                testimonial.notHelpful.push(userId);
            } else {
                testimonial.notHelpful.splice(notHelpfulIndex, 1);
            }
        }
        
        await testimonial.save();
        
        res.json({
            success: true,
            message: 'Feedback berhasil disimpan',
            data: {
                helpfulCount: testimonial.helpful.length,
                notHelpfulCount: testimonial.notHelpful.length,
                isHelpful: testimonial.helpful.includes(userId),
                isNotHelpful: testimonial.notHelpful.includes(userId)
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get testimonial statistics
// @route   GET /api/testimonials/stats
// @access  Public
exports.getTestimonialStats = async (req, res, next) => {
    try {
        const { lab } = req.query;
        
        let matchStage = { isActive: true };
        
        if (lab) {
            matchStage.lab = lab;
        }
        
        const stats = await Testimonial.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalTestimonials: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    verifiedCount: {
                        $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
                    },
                    featuredCount: {
                        $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
                    }
                }
            }
        ]);
        
        // Get rating distribution
        const ratingDistribution = await Testimonial.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get recent testimonials
        const recentTestimonials = await Testimonial.find(matchStage)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name avatar')
            .populate('lab', 'name code');
        
        res.json({
            success: true,
            data: {
                ...(stats[0] || {
                    totalTestimonials: 0,
                    averageRating: 0,
                    verifiedCount: 0,
                    featuredCount: 0
                }),
                ratingDistribution,
                recentTestimonials
            }
        });
        
    } catch (error) {
        next(error);
    }
};