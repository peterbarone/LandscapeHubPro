const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register company and admin user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/v1/auth/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', authenticate, authController.updatePassword);

module.exports = router;
