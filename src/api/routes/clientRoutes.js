const express = require('express');
const clientController = require('../controllers/clientController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients for a company
 * @access  Private
 */
router.get('/', authenticate, clientController.getClients);

/**
 * @route   GET /api/v1/clients/:clientId
 * @desc    Get client by ID
 * @access  Private
 */
router.get('/:clientId', authenticate, clientController.getClient);

/**
 * @route   POST /api/v1/clients
 * @desc    Create client
 * @access  Private - Admin, Manager
 */
router.post('/', authenticate, authorize(['admin', 'manager']), clientController.createClient);

/**
 * @route   PUT /api/v1/clients/:clientId
 * @desc    Update client
 * @access  Private - Admin, Manager
 */
router.put('/:clientId', authenticate, authorize(['admin', 'manager']), clientController.updateClient);

/**
 * @route   DELETE /api/v1/clients/:clientId
 * @desc    Delete client (soft delete)
 * @access  Private - Admin
 */
router.delete('/:clientId', authenticate, authorize(['admin']), clientController.deleteClient);

/**
 * @route   GET /api/v1/clients/:clientId/properties
 * @desc    Get client properties
 * @access  Private
 */
router.get('/:clientId/properties', authenticate, clientController.getClientProperties);

module.exports = router;
