// backend/middleware/logger.js
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom Morgan token for request body (for debugging)
const morgan = require('morgan');
morgan.token('req-body', (req) => {
    if (req.body && req.method !== 'GET') {
        return JSON.stringify(req.body);
    }
    return '';
});

morgan.token('req-headers', (req) => {
    return JSON.stringify({
        'user-agent': req.get('user-agent'),
        referer: req.get('referer'),
        'content-type': req.get('content-type')
    });
});

// Create write streams for logs
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
    path.join(logsDir, 'error.log'),
    { flags: 'a' }
);

// Format strings
const accessFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';
const detailedFormat = ':method :url :status :response-time ms - :req-body';

// Create loggers
const accessLogger = morgan(accessFormat, { 
    stream: accessLogStream,
    skip: (req, res) => res.statusCode >= 400
});

const errorLogger = morgan(accessFormat, { 
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400
});

const consoleLogger = morgan(process.env.NODE_ENV === 'development' ? detailedFormat : 'combined');

// Custom logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.method !== 'GET' ? req.body : undefined
    });
    
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user?.id || 'anonymous'
        };
        
        // Log to appropriate stream
        if (res.statusCode >= 400) {
            errorLogStream.write(JSON.stringify(logEntry) + '\n');
        } else {
            accessLogStream.write(JSON.stringify(logEntry) + '\n');
        }
    });
    
    next();
};

module.exports = {
    accessLogger,
    errorLogger,
    consoleLogger,
    requestLogger
};