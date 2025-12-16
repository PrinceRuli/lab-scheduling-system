// backend/middleware/errorHandler.js
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Log error for development
    console.error(err.stack);
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Duplicate field value: ${field} '${value}' already exists`;
        error = new ErrorResponse(message, 400);
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = `Validation failed: ${messages.join(', ')}`;
        error = new ErrorResponse(message, 400);
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ErrorResponse(message, 401);
    }
    
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new ErrorResponse(message, 401);
    }
    
    // Multer file upload errors
    if (err.name === 'MulterError') {
        let message;
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'File size too large. Maximum size is 5MB';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected file field';
                break;
            default:
                message = 'File upload error';
        }
        error = new ErrorResponse(message, 400);
    }
    
    // Custom error response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    });
};

module.exports = errorHandler;