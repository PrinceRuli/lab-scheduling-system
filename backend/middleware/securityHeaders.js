// backend/middleware/securityHeaders.js
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

// Enhanced security headers
const securityHeaders = (app) => {
    // Use helmet with custom configuration
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    
    // Prevent HTTP Parameter Pollution
    app.use(hpp());
    
    // Prevent XSS attacks
    app.use(xss());
    
    // Prevent clickjacking
    app.use(helmet.frameguard({ action: 'deny' }));
    
    // Hide X-Powered-By header
    app.disable('x-powered-by');
};

module.exports = securityHeaders;