const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            // Add your production domains here
            // 'https://yourfrontend.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Security headers configuration
const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
};

// Logging middleware
const requestLogger = morgan('combined', {
    skip: function (req, res) {
        // Skip logging for health checks
        return req.url === '/health' || req.url === '/api/health';
    }
});

// Request sanitization
const sanitizeInput = (req, res, next) => {
    // Remove any null bytes
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].replace(/\0/g, '');
        }
    }
    
    // Remove any null bytes from query parameters
    for (let key in req.query) {
        if (typeof req.query[key] === 'string') {
            req.query[key] = req.query[key].replace(/\0/g, '');
        }
    }
    
    next();
};

// Request ID middleware for tracking
const addRequestId = (req, res, next) => {
    req.id = Math.random().toString(36).substr(2, 9);
    res.setHeader('X-Request-ID', req.id);
    next();
};

// Response time middleware
const responseTime = (req, res, next) => {
    const start = Date.now();
    
    // Override res.end to calculate response time before sending
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = Date.now() - start;
        res.setHeader('X-Response-Time', `${duration}ms`);
        originalEnd.apply(res, args);
    };
    
    next();
};

// Content type validation
const validateContentType = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.is('application/json') && !req.is('multipart/form-data')) {
            return res.status(400).json({
                success: false,
                message: 'Content-Type must be application/json or multipart/form-data'
            });
        }
    }
    next();
};

module.exports = {
    corsOptions,
    helmetConfig,
    requestLogger,
    sanitizeInput,
    addRequestId,
    responseTime,
    validateContentType
};