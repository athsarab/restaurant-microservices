const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({ 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }, 
  items: [ 
    {
      dish: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Dish'
      },
      name: String,
      price: Number, 
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    } 
  ],
  orderTotal: {
    type: Number, 
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'delivering', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'paypal'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  deliveryNotes: String,
  estimatedDeliveryTime: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
