const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const Connect = require('./config/Db');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { corsOptions, helmetConfig, requestLogger, sanitizeInput, addRequestId, responseTime } = require('./middleware/securityMiddleware');
const { limiter } = require('./middleware/rateLimitMiddleware');

// Import routes
const apiRoutes = require('./router/index');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database
Connect();

// Security middleware
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));

// General middleware
app.use(requestLogger);
app.use(addRequestId);
app.use(responseTime);
app.use(limiter);
app.use(sanitizeInput);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});



