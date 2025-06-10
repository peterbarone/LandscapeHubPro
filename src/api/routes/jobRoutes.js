const express = require('express');
const jobController = require('../controllers/jobController');
const { authenticate, authorize } = require('../middlewares/auth');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs for a company
 * @access  Private
 */
router.get('/', authenticate, jobController.getJobs);

/**
 * @route   GET /api/v1/jobs/:jobId
 * @desc    Get job by ID
 * @access  Private
 */
router.get('/:jobId', authenticate, jobController.getJob);

/**
 * @route   POST /api/v1/jobs
 * @desc    Create job
 * @access  Private - Admin, Manager
 */
router.post('/', authenticate, authorize(['admin', 'manager']), jobController.createJob);

/**
 * @route   PUT /api/v1/jobs/:jobId
 * @desc    Update job
 * @access  Private - Admin, Manager
 */
router.put('/:jobId', authenticate, authorize(['admin', 'manager']), jobController.updateJob);

/**
 * @route   DELETE /api/v1/jobs/:jobId
 * @desc    Delete job (soft delete)
 * @access  Private - Admin
 */
router.delete('/:jobId', authenticate, authorize(['admin']), jobController.deleteJob);

/**
 * @route   PUT /api/v1/jobs/:jobId/status
 * @desc    Update job status
 * @access  Private - Admin, Manager, Crew
 */
router.put(
  '/:jobId/status',
  authenticate,
  authorize(['admin', 'manager', 'crew']),
  jobController.updateJobStatus
);

/**
 * @route   POST /api/v1/jobs/:jobId/photos
 * @desc    Upload job completion photos
 * @access  Private - Admin, Manager, Crew
 */
router.post(
  '/:jobId/photos',
  authenticate,
  authorize(['admin', 'manager', 'crew']),
  upload.array('photos', 10), // Max 10 photos at a time
  jobController.uploadCompletionPhotos
);

module.exports = router;
