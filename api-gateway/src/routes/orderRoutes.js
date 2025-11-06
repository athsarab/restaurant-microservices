const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { createServiceProxy } = require('../utils/proxyHelper');

const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

// All order routes require authentication
router.use('/', verifyToken, createServiceProxy(orderServiceUrl)); 

module.exports = router;
