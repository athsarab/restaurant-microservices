const express = require('express');
const dishController = require('../controllers/dishController');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route   GET api/menu/dishes
// @desc    Get all dishes
// @access  Public
router.get('/', dishController.getAllDishes);

// @route   GET api/menu/dishes/:id
// @desc    Get dish by ID
// @access  Public
router.get('/:id', dishController.getDishById);

// @route   GET api/menu/dishes/category/:categoryId
// @desc    Get dishes by category
// @access  Public
router.get('/category/:categoryId', dishController.getDishesByCategory);

// @route   POST api/menu/dishes
// @desc    Create a new dish
// @access  Private (Admin only)
router.post('/', auth, dishController.createDish);

// @route   PUT api/menu/dishes/:id
// @desc    Update a dish
// @access  Private (Admin only)
router.put('/:id', auth, dishController.updateDish);

// @route   DELETE api/menu/dishes/:id
// @desc    Delete a dish
// @access  Private (Admin only)
router.delete('/:id', auth, dishController.deleteDish);

module.exports = router;
