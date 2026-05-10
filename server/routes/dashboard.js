const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// @route   GET /api/dashboard
// @desc    Get dashboard stats
// @access  Private
router.get('/', auth, getDashboardStats);

module.exports = router;