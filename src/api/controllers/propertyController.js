const { Property, Client } = require('../../db/models');
const { ApiError } = require('../middlewares/error');
const logger = require('../../utils/logger');
const { s3, bucketName } = require('../../config/storage');
const { Op } = require('sequelize');

/**
 * Get all properties for a company
 */
const getProperties = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { clientId, propertyType, active, search, sortBy, sortOrder, limit = 20, page = 1 } = req.query;
    
    // Build query options
    const queryOptions = {
      include: [
        {
          model: Client,
          where: { companyId },
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [[(sortBy || 'address'), (sortOrder || 'ASC')]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };
    
    // Add filters if provided
    if (clientId) {
      queryOptions.where = { ...queryOptions.where, clientId };
    }
    
    if (propertyType) {
      queryOptions.where = { ...queryOptions.where, propertyType };
    }
    
    if (active !== undefined) {
      queryOptions.where = { ...queryOptions.where, isActive: active === 'true' };
    }
    
    if (search) {
      queryOptions.where = { 
        ...queryOptions.where,
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    // Get properties
    const { count, rows: properties } = await Property.findAndCountAll(queryOptions);
    
    res.json({
      properties,
      pagination: {
        total: count,
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get property by ID
 */
const getProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { companyId } = req.user;
    
    const property = await Property.findOne({
      include: [
        {
          model: Client,
          where: { companyId },
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ],
      where: { id: propertyId }
    });
    
    if (!property) {
      throw new ApiError('Property not found', 404);
    }
    
    res.json({ property });
  } catch (error) {
    next(error);
  }
};

/**
 * Create property
 */
const createProperty = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const {
      clientId,
      name,
      address,
      city,
      state,
      zipCode,
      propertyType,
      lotSize,
      lawnArea,
      latitude,
      longitude,
      notes,
      features
    } = req.body;
    
    // Validate required fields
    if (!clientId || !address || !city || !state || !zipCode) {
      throw new ApiError('Client ID, address, city, state, and zip code are required', 400);
    }
    
    // Check if client exists and belongs to the company
    const client = await Client.findOne({
      where: { id: clientId, companyId }
    });
    
    if (!client) {
      throw new ApiError('Client not found', 404);
    }
    
    // Create property
    const property = await Property.create({
      clientId,
      name,
      address,
      city,
      state,
      zipCode,
      propertyType,
      lotSize,
      lawnArea,
      latitude,
      longitude,
      notes,
      features: features || {},
      zones: {}
    });
    
    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update property
 */
const updateProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { companyId } = req.user;
    const {
      name,
      address,
      city,
      state,
      zipCode,
      propertyType,
      lotSize,
      lawnArea,
      latitude,
      longitude,
      notes,
      features,
      isActive
    } = req.body;
    
    // Find property
    const property = await Property.findOne({
      include: [
        {
          model: Client,
          where: { companyId },
          attributes: ['id']
        }
      ],
      where: { id: propertyId }
    });
    
    if (!property) {
      throw new ApiError('Property not found', 404);
    }
    
    // Update property
    await property.update({
      name: name !== undefined ? name : property.name,
      address: address || property.address,
      city: city || property.city,
      state: state || property.state,
      zipCode: zipCode || property.zipCode,
      propertyType: propertyType || property.propertyType,
      lotSize: lotSize !== undefined ? lotSize : property.lotSize,
      lawnArea: lawnArea !== undefined ? lawnArea : property.lawnArea,
      latitude: latitude !== undefined ? latitude : property.latitude,
      longitude: longitude !== undefined ? longitude : property.longitude,
      notes: notes !== undefined ? notes : property.notes,
      features: features || property.features,
      isActive: isActive !== undefined ? isActive : property.isActive
    });
    
    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete property (soft delete)
 */
const deleteProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { companyId } = req.user;
    
    // Find property
    const property = await Property.findOne({
      include: [
        {
          model: Client,
          where: { companyId },
          attributes: ['id']
        }
      ],
      where: { id: propertyId }
    });
    
    if (!property) {
      throw new ApiError('Property not found', 404);
    }
    
    // Soft delete the property
    await property.destroy();
    
    res.json({
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload satellite image
 */
const uploadSatelliteImage = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { companyId } = req.user;
    
    // Find property
    const property = await Property.findOne({
      include: [
        {
          model: Client,
          where: { companyId },
          attributes: ['id']
        }
      ],
      where: { id: propertyId }
    });
    
    if (!property) {
      throw new ApiError('Property not found', 404);
    }
    
    if (!req.file) {
      throw new ApiError('No image uploaded', 400);
    }
    
    // Generate a unique file name
    const fileName = `properties/${propertyId}/satellite/${Date.now()}_${req.file.originalname}`;
    
    // Upload to MinIO
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };
    
    await s3.upload(params).promise();
    
    // Get the URL for the uploaded file
    const satelliteImageUrl = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    
    // Update property with new image URL
    await property.update({ satelliteImageUrl });
    
    res.json({
      message: 'Satellite image uploaded successfully',
      satelliteImageUrl
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update property zones
 */
const updateZones = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { companyId } = req.user;
    const { zones } = req.body;
    
    if (!zones) {
      throw new ApiError('Zones data is required', 400);
    }
    
    // Find property
    const property = await Property.findOne({
      include: [
        {
          model: Client,
          where: { companyId },
          attributes: ['id']
        }
      ],
      where: { id: propertyId }
    });
    
    if (!property) {
      throw new ApiError('Property not found', 404);
    }
    
    // Update property zones
    await property.update({ zones });
    
    res.json({
      message: 'Property zones updated successfully',
      property
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadSatelliteImage,
  updateZones
};
