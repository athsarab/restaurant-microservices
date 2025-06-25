const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { createServiceProxy } = require('../utils/proxyHelper');

const reviewServiceUrl = process.env.REVIEW_SERVICE_URL || 'http://localhost:3005';

// Public routes - get reviews for a dish
router.get('/dish/:dishId', createServiceProxy(reviewServiceUrl));

// Protected routes - add, edit, delete reviews
router.post('/', verifyToken, createServiceProxy(reviewServiceUrl));
router.put('/:id', verifyToken, createServiceProxy(reviewServiceUrl));
router.delete('/:id', verifyToken, createServiceProxy(reviewServiceUrl));

module.exports = router;
