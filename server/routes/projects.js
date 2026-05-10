const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { getProjectBoard } = require('../controllers/projectBoardController');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, getProjects);

// @route   GET /api/projects/:id/board
// @desc    Get project board data
// @access  Private
router.get('/:id/board', auth, getProjectBoard);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, getProject);

// @route   POST /api/projects
// @desc    Create project
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin or Creator)
router.put('/:id', auth, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin or Creator)
router.delete('/:id', auth, deleteProject);

module.exports = router;