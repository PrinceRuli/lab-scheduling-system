// backend/routes/articles.js
const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    toggleLike,
    getArticleStats
} = require('../controllers/articleController');

const { protect, authorize } = require('../middleware/auth');
const { uploadArticleImage } = require('../middleware/upload');

// Public routes
router.route('/')
    .get(getArticles);

router.route('/stats')
    .get(getArticleStats);

router.route('/:slug')
    .get(getArticleBySlug);

// Protected routes
router.use(protect);

router.route('/')
    .post(authorize('admin', 'teacher'), uploadArticleImage, createArticle);

router.route('/:id/like')
    .put(toggleLike);

// Admin/Teacher routes
router.route('/:id')
    .put(authorize('admin', 'teacher'), uploadArticleImage, updateArticle)
    .delete(authorize('admin', 'teacher'), deleteArticle);

module.exports = router;