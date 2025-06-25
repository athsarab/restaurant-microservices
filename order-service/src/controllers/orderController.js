const Order = require('../models/Order');
const axios = require('axios');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, deliveryNotes } = req.body;
    const userId = req.user.id;

    // Calculate total price
    let orderTotal = 0;
    for (const item of items) {
      // Verify dish details with menu-service
      try {
        const dishResponse = await axios.get(`${process.env.MENU_SERVICE_URL}/api/menu/dishes/${item.dish}`, {
          headers: { Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}` }
        });
        
        const dish = dishResponse.data;
        orderTotal += dish.price * item.quantity;
        
        // Add dish name and price to order item
        item.name = dish.name;
        item.price = dish.price;
      } catch (err) {
        console.error('Error verifying dish:', err);
        return res.status(404).json({ message: `Dish with ID ${item.dish} not found or unavailable` });
      }
    }

    const newOrder = new Order({
      user: userId,
      items,
      orderTotal,
      shippingAddress,
      paymentMethod,
      deliveryNotes,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes from now
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ user: userId })
      .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the requesting user or if user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Only admin can update order status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }
    
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    
    if (status === 'completed') {
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the requesting user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Can only cancel orders that are pending or preparing
    if (!['pending', 'preparing'].includes(order.status)) {
      return res.status(400).json({ message: `Order cannot be cancelled in ${order.status} status` });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};
