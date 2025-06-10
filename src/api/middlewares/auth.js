const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');
const logger = require('../../utils/logger');

// Load environment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

/**
 * Generate a JWT token for a user
 * 
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * Authentication middleware to protect routes
 * Verifies the JWT token in Authorization header
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find the user
      const user = await User.findByPk(decoded.id);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      // Add user to request object
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        firstName: user.firstName,
        lastName: user.lastName
      };

      next();
    } catch (error) {
      logger.error('JWT Verification Error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    logger.error('Authentication Middleware Error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * Authorization middleware to check user roles
 * 
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  generateToken,
  authenticate,
  authorize
};
