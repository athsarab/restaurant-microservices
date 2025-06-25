const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  userController.register
);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.login
);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
