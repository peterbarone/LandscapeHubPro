const { Client, Property } = require('../../db/models');
const { ApiError } = require('../middlewares/error');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

/**
 * Get all clients for a company
 */
const getClients = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { active, search, sortBy, sortOrder, limit = 20, page = 1 } = req.query;
    
    // Build query options
    const queryOptions = {
      where: { companyId },
      order: [[(sortBy || 'lastName'), (sortOrder || 'ASC')]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };
    
    // Add filters if provided
    if (active !== undefined) {
      queryOptions.where.isActive = active === 'true';
    }
    
    if (search) {
      queryOptions.where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get clients
    const { count, rows: clients } = await Client.findAndCountAll(queryOptions);
    
    res.json({
      clients,
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
 * Get client by ID
 */
const getClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { companyId } = req.user;
    
    const client = await Client.findOne({
      where: { id: clientId, companyId }
    });
    
    if (!client) {
      throw new ApiError('Client not found', 404);
    }
    
    res.json({ client });
  } catch (error) {
    next(error);
  }
};

/**
 * Create client
 */
const createClient = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      notes,
      billingFrequency
    } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName) {
      throw new ApiError('First name and last name are required', 400);
    }
    
    // Check if email is provided and already exists
    if (email) {
      const existingClient = await Client.findOne({
        where: { companyId, email }
      });
      
      if (existingClient) {
        throw new ApiError('A client with this email already exists', 409);
      }
    }
    
    // Create client
    const client = await Client.create({
      companyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      notes,
      billingFrequency
    });
    
    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update client
 */
const updateClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { companyId } = req.user;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      notes,
      billingFrequency,
      isActive
    } = req.body;
    
    const client = await Client.findOne({
      where: { id: clientId, companyId }
    });
    
    if (!client) {
      throw new ApiError('Client not found', 404);
    }
    
    // If email is changing, check for duplicates
    if (email && email !== client.email) {
      const existingClient = await Client.findOne({
        where: { companyId, email }
      });
      
      if (existingClient) {
        throw new ApiError('A client with this email already exists', 409);
      }
    }
    
    // Update client
    await client.update({
      firstName: firstName || client.firstName,
      lastName: lastName || client.lastName,
      email: email || client.email,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : client.phoneNumber,
      address: address !== undefined ? address : client.address,
      city: city !== undefined ? city : client.city,
      state: state !== undefined ? state : client.state,
      zipCode: zipCode !== undefined ? zipCode : client.zipCode,
      notes: notes !== undefined ? notes : client.notes,
      billingFrequency: billingFrequency || client.billingFrequency,
      isActive: isActive !== undefined ? isActive : client.isActive
    });
    
    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete client (soft delete)
 */
const deleteClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { companyId } = req.user;
    
    const client = await Client.findOne({
      where: { id: clientId, companyId }
    });
    
    if (!client) {
      throw new ApiError('Client not found', 404);
    }
    
    // Check if the client has properties
    const propertyCount = await Property.count({
      where: { clientId }
    });
    
    if (propertyCount > 0) {
      // Instead of hard delete, mark as inactive
      await client.update({ isActive: false });
      
      res.json({
        message: 'Client marked as inactive because they have associated properties',
        client
      });
    } else {
      // Soft delete the client
      await client.destroy();
      
      res.json({
        message: 'Client deleted successfully'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get client properties
 */
const getClientProperties = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { companyId } = req.user;
    
    // Verify client belongs to company
    const client = await Client.findOne({
      where: { id: clientId, companyId }
    });
    
    if (!client) {
      throw new ApiError('Client not found', 404);
    }
    
    // Get properties
    const properties = await Property.findAll({
      where: { clientId },
      order: [['name', 'ASC']]
    });
    
    res.json({ properties });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientProperties
};
