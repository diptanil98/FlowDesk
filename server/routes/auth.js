const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Middleware to validate request body
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields: name, email, password' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields: email, password' });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

module.exports = router;