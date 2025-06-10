const logger = require('../../utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('API Error:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    user: req.user ? req.user.id : 'unauthenticated'
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Format the error response
  const errorResponse = {
    error: true,
    message: statusCode === 500 ? 'An unexpected error occurred' : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  };

  // Append validation errors if available
  if (err.errors) {
    errorResponse.errors = err.errors;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found error handler middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  ApiError,
  notFoundHandler
};
