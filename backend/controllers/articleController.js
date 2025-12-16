// backend/controllers/articleController.js
const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');
const { createArticleValidation, updateArticleValidation } = require('../validations/articleValidation');

// Helper untuk menghapus file
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(path.join(__dirname, '..', filePath))) {
        fs.unlinkSync(path.join(__dirname, '..', filePath));
    }
};

// @desc    Get all articles with advanced filtering
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res, next) => {
    try {
        // Build query
        let query;
        const reqQuery = { ...req.query };
        
        // Remove special fields
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        // Filter berdasarkan role
        if (req.user?.role !== 'admin') {
            reqQuery.isPublished = true;
        }
        
        // Search functionality
        if (req.query.search) {
            reqQuery.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } },
                { tags: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        // Filter by category
        if (req.query.category) {
            reqQuery.category = req.query.category;
        }
        
        // Filter by tag
        if (req.query.tag) {
            reqQuery.tags = { $in: [req.query.tag.toLowerCase()] };
        }
        
        // Filter by author
        if (req.query.author) {
            reqQuery.author = req.query.author;
        }
        
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // Finding resource
        query = Article.find(JSON.parse(queryStr))
            .populate('author', 'name email avatar');
        
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
            query = query.sort('-publishedAt -createdAt');
        }
        
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        
        query = query.skip(startIndex).limit(limit);
        
        // Execute query
        const articles = await query;
        
        // Get total count
        const total = await Article.countDocuments(JSON.parse(queryStr));
        
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
        
        res.json({
            success: true,
            count: articles.length,
            pagination,
            data: articles
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticleBySlug = async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
            .populate('author', 'name email avatar bio');
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Artikel tidak ditemukan'
            });
        }
        
        // Check if user can view unpublished article
        if (!article.isPublished && 
            (!req.user || req.user.role !== 'admin') && 
            article.author._id.toString() !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses ke artikel ini'
            });
        }
        
        // Increment view count
        article.views += 1;
        await article.save();
        
        res.json({
            success: true,
            data: article
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin,Teacher
exports.createArticle = async (req, res, next) => {
    try {
        // Validate input
        const { error } = createArticleValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        
        const { title, content, excerpt, category, tags, isPublished, metaTitle, metaDescription, metaKeywords } = req.body;
        
        // Parse tags
        let tagArray = [];
        if (tags) {
            tagArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim().toLowerCase()) : tags;
        }
        
        // Parse metaKeywords
        let keywordArray = [];
        if (metaKeywords) {
            keywordArray = typeof metaKeywords === 'string' ? metaKeywords.split(',').map(kw => kw.trim()) : metaKeywords;
        }
        
        const article = new Article({
            title,
            content,
            excerpt: excerpt || content.substring(0, 200) + '...',
            author: req.user.id,
            category: category || 'berita',
            tags: tagArray,
            isPublished: isPublished || false,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt || content.substring(0, 160),
            metaKeywords: keywordArray
        });
        
        // Handle featured image upload
        if (req.file) {
            article.featuredImage = `/uploads/articles/${req.file.filename}`;
        }
        
        await article.save();
        
        // Populate author
        await article.populate('author', 'name email avatar');
        
        res.status(201).json({
            success: true,
            message: 'Artikel berhasil dibuat',
            data: article
        });
        
    } catch (error) {
        // Clean up uploaded file if error
        if (req.file) {
            deleteFile(req.file.path);
        }
        next(error);
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin,Teacher
exports.updateArticle = async (req, res, next) => {
    try {
        // Validate input
        const { error } = updateArticleValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        
        let article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Artikel tidak ditemukan'
            });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki izin untuk mengedit artikel ini'
            });
        }
        
        // Handle featured image update
        if (req.file) {
            // Delete old featured image
            if (article.featuredImage) {
                deleteFile(article.featuredImage);
            }
            req.body.featuredImage = `/uploads/articles/${req.file.filename}`;
        }
        
        // Parse tags if provided
        if (req.body.tags) {
            req.body.tags = typeof req.body.tags === 'string' 
                ? req.body.tags.split(',').map(tag => tag.trim().toLowerCase())
                : req.body.tags;
        }
        
        // Parse metaKeywords if provided
        if (req.body.metaKeywords) {
            req.body.metaKeywords = typeof req.body.metaKeywords === 'string'
                ? req.body.metaKeywords.split(',').map(kw => kw.trim())
                : req.body.metaKeywords;
        }
        
        // Update article
        article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('author', 'name email avatar');
        
        res.json({
            success: true,
            message: 'Artikel berhasil diperbarui',
            data: article
        });
        
    } catch (error) {
        // Clean up uploaded file if error
        if (req.file) {
            deleteFile(req.file.path);
        }
        next(error);
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin,Teacher
exports.deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Artikel tidak ditemukan'
            });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki izin untuk menghapus artikel ini'
            });
        }
        
        // Delete associated files
        if (article.featuredImage) {
            deleteFile(article.featuredImage);
        }
        
        // Delete any images
        if (article.images && article.images.length > 0) {
            article.images.forEach(image => {
                deleteFile(image);
            });
        }
        
        // Delete any attachments
        if (article.attachments && article.attachments.length > 0) {
            article.attachments.forEach(attachment => {
                deleteFile(attachment.path);
            });
        }
        
        await Article.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Artikel berhasil dihapus',
            data: {}
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle like on article
// @route   PUT /api/articles/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Artikel tidak ditemukan'
            });
        }
        
        // Check if article is published
        if (!article.isPublished && req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Artikel tidak tersedia'
            });
        }
        
        const userId = req.user.id;
        const likeIndex = article.likes.indexOf(userId);
        
        if (likeIndex === -1) {
            // Add like
            article.likes.push(userId);
        } else {
            // Remove like
            article.likes.splice(likeIndex, 1);
        }
        
        await article.save();
        
        res.json({
            success: true,
            message: likeIndex === -1 ? 'Artikel disukai' : 'Like dihapus',
            data: {
                likesCount: article.likes.length,
                isLiked: likeIndex === -1
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get article statistics
// @route   GET /api/articles/stats
// @access  Private/Admin
exports.getArticleStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        let matchStage = {};
        
        // Date range filtering
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }
        
        // Only admin can see all stats
        if (req.user.role !== 'admin') {
            matchStage.isPublished = true;
        }
        
        const stats = await Article.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalArticles: { $sum: 1 },
                    totalViews: { $sum: '$views' },
                    totalLikes: { $sum: { $size: '$likes' } },
                    publishedArticles: {
                        $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                    }
                }
            }
        ]);
        
        // Get category distribution
        const categoryStats = await Article.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalViews: { $sum: '$views' }
                }
            }
        ]);
        
        // Get top articles by views
        const topArticles = await Article.find(matchStage)
            .sort({ views: -1, likes: -1 })
            .limit(5)
            .select('title slug views likes category createdAt')
            .populate('author', 'name');
        
        res.json({
            success: true,
            data: {
                ...(stats[0] || {
                    totalArticles: 0,
                    totalViews: 0,
                    totalLikes: 0,
                    publishedArticles: 0,
                    unpublishedArticles: 0
                }),
                categories: categoryStats,
                topArticles
            }
        });
        
    } catch (error) {
        next(error);
    }
};