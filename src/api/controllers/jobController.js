const { Job, Property, Client } = require('../../db/models');
const { ApiError } = require('../middlewares/error');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');
const { s3, bucketName } = require('../../config/storage');

/**
 * Get all jobs for a company
 */
const getJobs = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { 
      clientId, 
      propertyId, 
      status, 
      jobType, 
      startDate, 
      endDate, 
      search,
      sortBy = 'scheduledDate',
      sortOrder = 'DESC',
      limit = 20, 
      page = 1 
    } = req.query;
    
    // Build query options
    const queryOptions = {
      where: { companyId },
      include: [
        {
          model: Property,
          attributes: ['id', 'name', 'address', 'city', 'state', 'zipCode']
        },
        {
          model: Client,
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };
    
    // Add filters if provided
    if (clientId) {
      queryOptions.where.clientId = clientId;
    }
    
    if (propertyId) {
      queryOptions.where.propertyId = propertyId;
    }
    
    if (status) {
      queryOptions.where.status = status;
    }
    
    if (jobType) {
      queryOptions.where.jobType = jobType;
    }
    
    // Date range filter
    if (startDate && endDate) {
      queryOptions.where.scheduledDate = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      queryOptions.where.scheduledDate = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      queryOptions.where.scheduledDate = {
        [Op.lte]: endDate
      };
    }
    
    // Search filter
    if (search) {
      queryOptions.where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get jobs
    const { count, rows: jobs } = await Job.findAndCountAll(queryOptions);
    
    res.json({
      jobs,
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
 * Get job by ID
 */
const getJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { companyId } = req.user;
    
    const job = await Job.findOne({
      where: {
        id: jobId,
        companyId
      },
      include: [
        {
          model: Property,
          attributes: ['id', 'name', 'address', 'city', 'state', 'zipCode']
        },
        {
          model: Client,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ]
    });
    
    if (!job) {
      throw new ApiError('Job not found', 404);
    }
    
    res.json({ job });
  } catch (error) {
    next(error);
  }
};

/**
 * Create job
 */
const createJob = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const {
      propertyId,
      clientId,
      title,
      description,
      status,
      jobType,
      scheduledDate,
      scheduledStartTime,
      scheduledEndTime,
      estimatedDuration,
      isRecurring,
      recurringPattern,
      priority,
      assignedTo,
      notes,
      estimatedCost,
      serviceItems
    } = req.body;
    
    // Validate required fields
    if (!propertyId || !clientId || !title || !jobType || !scheduledDate) {
      throw new ApiError('Property ID, client ID, title, job type, and scheduled date are required', 400);
    }
    
    // Verify property belongs to client and client belongs to company
    const property = await Property.findOne({
      where: { id: propertyId },
      include: [
        {
          model: Client,
          where: { id: clientId, companyId }
        }
      ]
    });
    
    if (!property) {
      throw new ApiError('Property not found or does not belong to the specified client', 404);
    }
    
    // Create job
    const job = await Job.create({
      companyId,
      propertyId,
      clientId,
      title,
      description,
      status: status || 'draft',
      jobType,
      scheduledDate,
      scheduledStartTime,
      scheduledEndTime,
      estimatedDuration,
      isRecurring: isRecurring || false,
      recurringPattern,
      priority: priority || 'medium',
      assignedTo,
      notes,
      estimatedCost,
      serviceItems
    });
    
    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update job
 */
const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { companyId } = req.user;
    const {
      title,
      description,
      status,
      jobType,
      scheduledDate,
      scheduledStartTime,
      scheduledEndTime,
      actualStartTime,
      actualEndTime,
      estimatedDuration,
      isRecurring,
      recurringPattern,
      priority,
      assignedTo,
      notes,
      estimatedCost,
      actualCost,
      serviceItems,
      weatherConditions,
      completionNotes
    } = req.body;
    
    // Find job
    const job = await Job.findOne({
      where: {
        id: jobId,
        companyId
      }
    });
    
    if (!job) {
      throw new ApiError('Job not found', 404);
    }
    
    // Update job
    await job.update({
      title: title || job.title,
      description: description !== undefined ? description : job.description,
      status: status || job.status,
      jobType: jobType || job.jobType,
      scheduledDate: scheduledDate || job.scheduledDate,
      scheduledStartTime: scheduledStartTime !== undefined ? scheduledStartTime : job.scheduledStartTime,
      scheduledEndTime: scheduledEndTime !== undefined ? scheduledEndTime : job.scheduledEndTime,
      actualStartTime: actualStartTime !== undefined ? actualStartTime : job.actualStartTime,
      actualEndTime: actualEndTime !== undefined ? actualEndTime : job.actualEndTime,
      estimatedDuration: estimatedDuration !== undefined ? estimatedDuration : job.estimatedDuration,
      isRecurring: isRecurring !== undefined ? isRecurring : job.isRecurring,
      recurringPattern: recurringPattern !== undefined ? recurringPattern : job.recurringPattern,
      priority: priority || job.priority,
      assignedTo: assignedTo !== undefined ? assignedTo : job.assignedTo,
      notes: notes !== undefined ? notes : job.notes,
      estimatedCost: estimatedCost !== undefined ? estimatedCost : job.estimatedCost,
      actualCost: actualCost !== undefined ? actualCost : job.actualCost,
      serviceItems: serviceItems !== undefined ? serviceItems : job.serviceItems,
      weatherConditions: weatherConditions !== undefined ? weatherConditions : job.weatherConditions,
      completionNotes: completionNotes !== undefined ? completionNotes : job.completionNotes
    });
    
    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete job (soft delete)
 */
const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { companyId } = req.user;
    
    // Find job
    const job = await Job.findOne({
      where: {
        id: jobId,
        companyId
      }
    });
    
    if (!job) {
      throw new ApiError('Job not found', 404);
    }
    
    // Soft delete the job
    await job.destroy();
    
    res.json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update job status
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { companyId } = req.user;
    const { status, actualStartTime, actualEndTime, completionNotes } = req.body;
    
    // Validate required fields
    if (!status) {
      throw new ApiError('Status is required', 400);
    }
    
    // Validate status
    const validStatuses = ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold'];
    if (!validStatuses.includes(status)) {
      throw new ApiError('Invalid status', 400);
    }
    
    // Find job
    const job = await Job.findOne({
      where: {
        id: jobId,
        companyId
      }
    });
    
    if (!job) {
      throw new ApiError('Job not found', 404);
    }
    
    // Update status and related fields
    const updateData = { status };
    
    // If status is in_progress, set actualStartTime
    if (status === 'in_progress' && !job.actualStartTime) {
      updateData.actualStartTime = actualStartTime || new Date();
    }
    
    // If status is completed, set actualEndTime and completionNotes
    if (status === 'completed') {
      updateData.actualEndTime = actualEndTime || new Date();
      updateData.completionNotes = completionNotes !== undefined ? completionNotes : job.completionNotes;
    }
    
    // Update job
    await job.update(updateData);
    
    res.json({
      message: 'Job status updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload job completion photos
 */
const uploadCompletionPhotos = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { companyId } = req.user;
    
    // Find job
    const job = await Job.findOne({
      where: {
        id: jobId,
        companyId
      }
    });
    
    if (!job) {
      throw new ApiError('Job not found', 404);
    }
    
    if (!req.files || req.files.length === 0) {
      throw new ApiError('No photos uploaded', 400);
    }
    
    const photoUrls = [];
    
    // Upload each photo to MinIO
    for (const file of req.files) {
      // Generate a unique file name
      const fileName = `jobs/${jobId}/photos/${Date.now()}_${file.originalname}`;
      
      // Upload to MinIO
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      };
      
      await s3.upload(params).promise();
      
      // Get the URL for the uploaded file
      const photoUrl = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
      photoUrls.push(photoUrl);
    }
    
    // Update job with new photo URLs
    const completionPhotos = job.completionPhotos || [];
    await job.update({ completionPhotos: [...completionPhotos, ...photoUrls] });
    
    res.json({
      message: 'Job completion photos uploaded successfully',
      photoUrls
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  uploadCompletionPhotos
};
