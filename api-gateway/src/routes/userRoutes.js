const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { createServiceProxy } = require('../utils/proxyHelper');

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';

// Public routes with stricter rate limiting
router.post('/login', authLimiter, createServiceProxy(userServiceUrl));
router.post('/register', authLimiter, createServiceProxy(userServiceUrl));

// Protected routes
router.use('/profile', verifyToken, createServiceProxy(userServiceUrl));
router.use('/password', verifyToken, createServiceProxy(userServiceUrl));
router.get('/:id', verifyToken, createServiceProxy(userServiceUrl));

module.exports = router;
