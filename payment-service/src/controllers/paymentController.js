const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, currency, metadata } = req.body;

    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'orderId, amount and paymentMethod are required' });
    }

    const existingPaidPayment = await Payment.findOne({
      order: orderId,
      user: req.user.id,
      status: 'paid'
    });

    if (existingPaidPayment) {
      return res.status(400).json({ message: 'Payment already completed for this order' });
    }

    const isCash = paymentMethod === 'cash';
    const status = isCash ? 'pending' : 'paid';

    const payment = new Payment({
      user: req.user.id,
      order: orderId,
      amount,
      paymentMethod,
      status,
      currency: currency || 'USD',
      transactionId: isCash ? undefined : `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      paidAt: status === 'paid' ? new Date() : undefined,
      metadata: metadata || {}
    });

    const savedPayment = await payment.save();
    return res.status(201).json(savedPayment);
  } catch (err) {
    console.error('Error creating payment:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort('-createdAt');
    return res.json(payments);
  } catch (err) {
    console.error('Error getting user payments:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this payment' });
    }

    return res.json(payment);
  } catch (err) {
    console.error('Error getting payment:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId, user: req.user.id });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this order' });
    }

    return res.json(payment);
  } catch (err) {
    console.error('Error getting payment by order:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update payment status' });
    }

    const { status } = req.body;
    const allowedStatuses = ['pending', 'paid', 'failed', 'refunded'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    if (status === 'paid' && !payment.paidAt) {
      payment.paidAt = new Date();
    }

    await payment.save();
    return res.json(payment);
  } catch (err) {
    console.error('Error updating payment status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
