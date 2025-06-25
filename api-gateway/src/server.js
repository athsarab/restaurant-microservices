const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Auth middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes that don't require authentication
app.use('/api/users/login', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/users/register', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/menu', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

// Routes that require authentication
app.use('/api/users/profile', verifyToken, createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/orders', verifyToken, createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));
app.use('/api/payments', verifyToken, createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true }));
app.use('/api/reviews', verifyToken, createProxyMiddleware({ target: 'http://localhost:3005', changeOrigin: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
