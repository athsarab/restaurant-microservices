const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { createServiceProxy } = require('../utils/proxyHelper');

const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

// All payment routes require authentication
router.use('/', verifyToken, createServiceProxy(paymentServiceUrl));

module.exports = router;
