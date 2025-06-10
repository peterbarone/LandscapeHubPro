require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./api/middlewares/error');
const apiRoutes = require('./api/routes');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Set up middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Setup request logging
if (process.env.NODE_ENV === 'production') {
  // Create logs directory if it doesn't exist
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Log all requests to access.log
  app.use(morgan('combined', {
    stream: fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' })
  }));
} else {
  // In development, log to console
  app.use(morgan('dev'));
}

// Set up API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to LandscapeHub Pro API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/docs',
    health: '/api/health',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint (directly accessible without /api prefix)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
