const { Company, User } = require('../../db/models');
const { ApiError } = require('../middlewares/error');
const logger = require('../../utils/logger');
const { s3, bucketName } = require('../../config/storage');

/**
 * Get company details
 */
const getCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      throw new ApiError('Company not found', 404);
    }
    
    res.json({ company });
  } catch (error) {
    next(error);
  }
};

/**
 * Update company details
 */
const updateCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { 
      name, 
      address, 
      city, 
      state, 
      zipCode, 
      phoneNumber, 
      email, 
      website, 
      description 
    } = req.body;
    
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      throw new ApiError('Company not found', 404);
    }
    
    // Only allow admins or managers to update company details
    if (!['admin', 'manager'].includes(req.user.role)) {
      throw new ApiError('You do not have permission to update company details', 403);
    }
    
    // Update company
    await company.update({
      name: name || company.name,
      address: address || company.address,
      city: city || company.city,
      state: state || company.state,
      zipCode: zipCode || company.zipCode,
      phoneNumber: phoneNumber || company.phoneNumber,
      email: email || company.email,
      website: website || company.website,
      description: description || company.description
    });
    
    res.json({ 
      message: 'Company updated successfully',
      company 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload company logo
 */
const uploadLogo = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    
    // Only allow admins to upload logo
    if (req.user.role !== 'admin') {
      throw new ApiError('You do not have permission to upload company logo', 403);
    }
    
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      throw new ApiError('Company not found', 404);
    }
    
    if (!req.file) {
      throw new ApiError('No file uploaded', 400);
    }
    
    // Generate a unique file name
    const fileName = `companies/${companyId}/logo/${Date.now()}_${req.file.originalname}`;
    
    // Upload to MinIO
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };
    
    await s3.upload(params).promise();
    
    // Get the URL for the uploaded file
    const logoUrl = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    
    // Update company with new logo URL
    await company.update({ logoUrl });
    
    res.json({ 
      message: 'Logo uploaded successfully',
      logoUrl 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get company team members
 */
const getTeamMembers = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    
    const users = await User.findAll({
      where: { companyId },
      attributes: { exclude: ['passwordHash'] },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });
    
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * Invite team member
 */
const inviteTeamMember = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { email, firstName, lastName, role } = req.body;
    
    // Only allow admins to invite team members
    if (req.user.role !== 'admin') {
      throw new ApiError('You do not have permission to invite team members', 403);
    }
    
    if (!email || !firstName || !lastName || !role) {
      throw new ApiError('Missing required fields', 400);
    }
    
    // Check if role is valid
    const validRoles = ['admin', 'manager', 'crew', 'client'];
    if (!validRoles.includes(role)) {
      throw new ApiError('Invalid role', 400);
    }
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError('User with this email already exists', 409);
    }
    
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create user
    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      companyId,
      passwordHash: tempPassword, // Will be hashed via hook
      isActive: true
    });
    
    // In a real application, send an invitation email with a link to set password
    // For now, we'll just return the temporary password (not secure for production)
    
    res.status(201).json({ 
      message: 'Team member invited successfully',
      tempPassword, // In production, don't return this
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompany,
  updateCompany,
  uploadLogo,
  getTeamMembers,
  inviteTeamMember
};
