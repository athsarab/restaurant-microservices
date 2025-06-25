const express = require('express');
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route   GET api/menu/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   GET api/menu/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', categoryController.getCategoryById);

// @route   POST api/menu/categories
// @desc    Create a new category
// @access  Private (Admin only)
router.post('/', auth, categoryController.createCategory);

// @route   PUT api/menu/categories/:id
// @desc    Update a category
// @access  Private (Admin only)
router.put('/:id', auth, categoryController.updateCategory);

// @route   DELETE api/menu/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
