const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if route doesn't require auth
  const publicRoutes = [
    { path: '/api/menu', method: 'GET' },
    { path: '/api/menu/categories', method: 'GET' }, 
    { path: new RegExp('^/api/menu/categories/[^/]+$'), method: 'GET' },
    { path: new RegExp('^/api/menu/dishes/[^/]+$'), method: 'GET' }
  ];

  const isPublicRoute = publicRoutes.some(route => {
    if (route.path instanceof RegExp) {
      return route.path.test(req.path) && req.method === route.method;
    } 
    return req.path === route.path && req.method === route.method;
  });

  if (isPublicRoute) {
    return next();
  }

  // Check if no token for protected routes
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin for admin routes
    const adminRoutes = [
      { path: '/api/menu/categories', method: 'POST' },
      { path: new RegExp('^/api/menu/categories/[^/]+$'), method: 'PUT' },
      { path: new RegExp('^/api/menu/categories/[^/]+$'), method: 'DELETE' },
      { path: '/api/menu/dishes', method: 'POST' },
      { path: new RegExp('^/api/menu/dishes/[^/]+$'), method: 'PUT' },
      { path: new RegExp('^/api/menu/dishes/[^/]+$'), method: 'DELETE' }
    ];

    const isAdminRoute = adminRoutes.some(route => {
      if (route.path instanceof RegExp) {
        return route.path.test(req.path) && req.method === route.method;
      }
      return req.path === route.path && req.method === route.method;
    });

    if (isAdminRoute && decoded.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    // Add user to request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
