const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, getTasks);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', auth, getTask);

// @route   POST /api/tasks
// @desc    Create task
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), deleteTask);

module.exports = router;