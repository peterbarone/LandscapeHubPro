const { User, Company } = require('../../db/models');
const { generateToken } = require('../middlewares/auth');
const { ApiError } = require('../middlewares/error');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');

/**
 * Login controller
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError('Your account has been deactivated', 403);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login timestamp
    await user.update({ lastLogin: new Date() });

    // Return success response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register company and admin user
 */
const register = async (req, res, next) => {
  try {
    const {
      companyName,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      city,
      state,
      zipCode
    } = req.body;

    // Validate input
    if (!companyName || !firstName || !lastName || !email || !password) {
      throw new ApiError('Missing required fields', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email is already in use', 409);
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      address,
      city,
      state,
      zipCode,
      phoneNumber,
      email
    });

    // Create admin user
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password, // Will be hashed via hook
      role: 'admin',
      companyId: company.id,
      phoneNumber
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return success response
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId
      },
      company: {
        id: company.id,
        name: company.name
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update password
 */
const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError('Current password and new password are required', 400);
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError('Current password is incorrect', 401);
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed via hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updatePassword
};
