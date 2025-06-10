const express = require('express');
const propertyController = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middlewares/auth');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/v1/properties
 * @desc    Get all properties for a company
 * @access  Private
 */
router.get('/', authenticate, propertyController.getProperties);

/**
 * @route   GET /api/v1/properties/:propertyId
 * @desc    Get property by ID
 * @access  Private
 */
router.get('/:propertyId', authenticate, propertyController.getProperty);

/**
 * @route   POST /api/v1/properties
 * @desc    Create property
 * @access  Private - Admin, Manager
 */
router.post('/', authenticate, authorize(['admin', 'manager']), propertyController.createProperty);

/**
 * @route   PUT /api/v1/properties/:propertyId
 * @desc    Update property
 * @access  Private - Admin, Manager
 */
router.put('/:propertyId', authenticate, authorize(['admin', 'manager']), propertyController.updateProperty);

/**
 * @route   DELETE /api/v1/properties/:propertyId
 * @desc    Delete property (soft delete)
 * @access  Private - Admin
 */
router.delete('/:propertyId', authenticate, authorize(['admin']), propertyController.deleteProperty);

/**
 * @route   POST /api/v1/properties/:propertyId/satellite-image
 * @desc    Upload satellite image
 * @access  Private - Admin, Manager
 */
router.post(
  '/:propertyId/satellite-image',
  authenticate,
  authorize(['admin', 'manager']),
  upload.single('image'),
  propertyController.uploadSatelliteImage
);

/**
 * @route   PUT /api/v1/properties/:propertyId/zones
 * @desc    Update property zones
 * @access  Private - Admin, Manager
 */
router.put(
  '/:propertyId/zones',
  authenticate,
  authorize(['admin', 'manager']),
  propertyController.updateZones
);

module.exports = router;
