const express = require('express');
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middlewares/auth');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/v1/company
 * @desc    Get company details
 * @access  Private
 */
router.get('/', authenticate, companyController.getCompany);

/**
 * @route   PUT /api/v1/company
 * @desc    Update company details
 * @access  Private - Admin, Manager
 */
router.put('/', authenticate, authorize(['admin', 'manager']), companyController.updateCompany);

/**
 * @route   POST /api/v1/company/logo
 * @desc    Upload company logo
 * @access  Private - Admin
 */
router.post('/logo', authenticate, authorize(['admin']), upload.single('logo'), companyController.uploadLogo);

/**
 * @route   GET /api/v1/company/team
 * @desc    Get company team members
 * @access  Private
 */
router.get('/team', authenticate, companyController.getTeamMembers);

/**
 * @route   POST /api/v1/company/team/invite
 * @desc    Invite team member
 * @access  Private - Admin
 */
router.post('/team/invite', authenticate, authorize(['admin']), companyController.inviteTeamMember);

module.exports = router;
