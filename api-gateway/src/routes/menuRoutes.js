const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { createServiceProxy } = require('../utils/proxyHelper');

const menuServiceUrl = process.env.MENU_SERVICE_URL || 'http://localhost:3002';

// Public routes
router.get('/categories', createServiceProxy(menuServiceUrl));
router.get('/dishes', createServiceProxy(menuServiceUrl));
router.get('/dishes/:id', createServiceProxy(menuServiceUrl));
router.get('/categories/:id', createServiceProxy(menuServiceUrl));
router.get('/featured', createServiceProxy(menuServiceUrl));

// Protected routes (admin only)
router.post('/dishes', verifyToken, createServiceProxy(menuServiceUrl));
router.put('/dishes/:id', verifyToken, createServiceProxy(menuServiceUrl));
router.delete('/dishes/:id', verifyToken, createServiceProxy(menuServiceUrl));

router.post('/categories', verifyToken, createServiceProxy(menuServiceUrl));
router.put('/categories/:id', verifyToken, createServiceProxy(menuServiceUrl));
router.delete('/categories/:id', verifyToken, createServiceProxy(menuServiceUrl));

module.exports = router;
