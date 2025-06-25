const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Create a proxy middleware with custom options
 * @param {string} target - Target URL for the proxy
 * @param {object} options - Additional proxy options
 * @returns {function} Proxy middleware
 */
const createServiceProxy = (target, options = {}) => {
  const defaultOptions = {
    target,
    changeOrigin: true,
    pathRewrite: options.pathRewrite || undefined,
    onProxyReq: (proxyReq, req, res) => {
      // Forward auth headers if they exist
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Role', req.user.role || 'user');
      }
      
      // Custom proxy request handler
      if (options.onProxyReq) {
        options.onProxyReq(proxyReq, req, res);
      }
    },
    onError: (err, req, res) => {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ 
        message: 'Service unavailable',
        service: target
      }));
    }
  };

  return createProxyMiddleware({
    ...defaultOptions,
    ...options
  });
};

module.exports = {
  createServiceProxy
};
