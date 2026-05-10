const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getAllUsers,
  updateUserRole,
  addProjectMember,
  removeProjectMember,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);

// Project member management routes
router.post('/projects/:projectId/members', addProjectMember);
router.delete('/projects/:projectId/members/:userId', removeProjectMember);

module.exports = router;