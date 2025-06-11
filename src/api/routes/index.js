const express = require('express');
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const clientRoutes = require('./clientRoutes');
const propertyRoutes = require('./propertyRoutes');
const jobRoutes = require('./jobRoutes');
const statusRoutes = require('./status');
const { notFoundHandler } = require('../middlewares/error');

const router = express.Router();

// API version
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
});

// Status dashboard route (accessible without API version prefix)
router.use('/status', statusRoutes);

// Set up API routes
router.use(`/${API_VERSION}/auth`, authRoutes);
router.use(`/${API_VERSION}/company`, companyRoutes);
router.use(`/${API_VERSION}/clients`, clientRoutes);
router.use(`/${API_VERSION}/properties`, propertyRoutes);
router.use(`/${API_VERSION}/jobs`, jobRoutes);

// Handle 404 errors for API routes
router.use('*', notFoundHandler);

module.exports = router;
