const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', orderController.createOrder);

// @route   GET api/orders
// @desc    Get all orders for the authenticated user
// @access  Private
router.get('/', orderController.getUserOrders);

// @route   GET api/orders/:id
// @desc    Get an order by ID
// @access  Private
router.get('/:id', orderController.getOrderById);

// @route   PUT api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private
router.put('/:id/status', orderController.updateOrderStatus);

// @route   PUT api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
