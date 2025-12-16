// backend/server.js - VERSI LENGKAP SETELAH PERBAIKAN LOGGING
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// ========== IMPORT ROUTES ==========
const auth = require('./routes/auth');
const users = require('./routes/users');
const labs = require('./routes/labs');
const bookings = require('./routes/bookings');
const articles = require('./routes/articles');
const testimonials = require('./routes/testimonials');
const reports = require('./routes/reports');
const notifications = require('./routes/notifications');

// ========== IMPORT MIDDLEWARE ==========
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const securityHeaders = require('./middleware/securityHeaders');
const { consoleLogger, requestLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ========== DATABASE CONNECTION & SERVER INITIALIZATION (FIXED LOGIC) ==========

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_scheduling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
    // KONEKSI DB BERHASIL

    console.log('✅ MongoDB Connected Successfully');

    // ========== MIDDLEWARE SETUP (Tetap di sini sebelum server listening) ==========

    // Security headers
    if (process.env.NODE_ENV === 'production') {
      securityHeaders(app);
    } else {
      app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
      }));
    }

    // CORS configuration
    app.use(cors({
      origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Request logging
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }
    app.use(requestLogger);
    app.use(consoleLogger);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    app.use('/api/', apiLimiter);
    app.use('/api/auth', authLimiter);

    // Serve static files
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // ========== MOUNT API ROUTES ==========
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/labs', labs);
    app.use('/api/bookings', bookings);
    app.use('/api/articles', articles);
    app.use('/api/testimonials', testimonials);
    app.use('/api/reports', reports);
    app.use('/api/notifications', notifications);

    // ========== BASIC ROUTES ==========

    // API Welcome endpoint
    app.get('/api', (req, res) => {
      res.json({ 
        success: true,
        message: '🚀 Lab Scheduling System API v1.0',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          labs: '/api/labs',
          bookings: '/api/bookings',
          articles: '/api/articles',
          testimonials: '/api/testimonials',
          reports: '/api/reports',
          notifications: '/api/notifications',
          health: '/api/health'
        }
      });
    });

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      const health = {
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'development',
        memory: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
        }
      };
      
      res.status(200).json(health);
    });

    // Root redirect
    app.get('/', (req, res) => {
      res.json({
        message: 'Lab Scheduling System API',
        health: '/api/health',
        api: '/api'
      });
    });

    // Debug endpoint (tanpa swagger)
    app.get('/debug', (req, res) => {
      res.json({
        success: true,
        server: 'running',
        timestamp: new Date().toISOString(),
        endpoints: [
          '/api',
          '/api/health',
          '/debug'
        ]
      });
    });

    // ========== ERROR HANDLING ==========

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ 
        success: false,
        message: 'Route not found',
        requestedUrl: req.originalUrl,
        timestamp: new Date().toISOString(),
        suggestions: [
          '/api',
          '/api/health',
          '/debug'
        ]
      });
    });

    // Global error handler
    app.use(errorHandler);

    // ========== SERVER INITIALIZATION ==========

    // SERVER LISTENING DIMULAI SETELAH KONEKSI DB BERHASIL
    const server = app.listen(PORT, () => {
        // Log startup akan dicetak dengan status koneksi DB yang valid
      console.log(`
🚀 ===========================================
🚀 Lab Scheduling System API
🚀 ===========================================
🚀 Port: ${PORT}
🚀 Environment: ${process.env.NODE_ENV || 'development'}
🚀 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected (Logic Error)'}
🚀 ===========================================
      `);
    });

    // ========== ERROR HANDLING LANJUTAN & GRACEFUL SHUTDOWN ==========

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error('\n❌ Unhandled Rejection at:', promise);
      console.error('Error:', err.message);
      console.error(err.stack);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('\n❌ Uncaught Exception:');
      console.error(err.message);
      console.error(err.stack);
      process.exit(1);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n🔄 Received shutdown signal, closing connections...');
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        });
      });
      
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

})
.catch(err => {
    // KONEKSI DB GAGAL
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
});

module.exports = app;