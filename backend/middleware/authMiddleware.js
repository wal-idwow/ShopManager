/**
 * Authentication and Authorization Middleware
 *
 * Responsibilities:
 * - Verify JWT tokens and authenticate users
 * - Authorize users based on roles
 * - Attach user information to requests
 *
 * Middleware:
 * - `requireAuth`: Verify JWT token and attach user to req.user
 * - `requireAdmin`: Check if user has admin role
 */

const { verifyToken } = require('../utils/jwtHelper');

/**
 * Middleware to require authentication via JWT token
 * Reads Authorization header: Bearer <token>
 * Attaches req.user with { userId, role }
 * Returns 401 if token is missing or invalid
 */
function requireAuth(req, res, next) {
  try {
    // Validate Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: 'Authorization header is required',
      });
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: 'Invalid authorization header format. Use: Bearer <token>',
      });
    }

    // Verify token and attach user info to request
    const token = parts[1];

    try {
      // Verify token and decode user info
      const decoded = verifyToken(token);
      req.user = decoded; // Attach user info to request
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: err.message,
      });
    }
    // Note: verifyToken should throw an error if token is invalid or expired
  } catch (err) {
    console.error('Error in requireAuth middleware:', err);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      details: 'Authentication failed',
    });
  }
}

/**
 * Middleware to require admin role
 * Must be used AFTER requireAuth middleware
 * Checks if req.user.role === 'admin'
 * Returns 403 if user is not admin
 */
function requireAdmin(req, res, next) {
  try {
    // Ensure user is authenticated and req.user is set
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: 'Authentication required before authorization check',
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        details: 'This resource requires admin privileges',
      });
    }

    // User is admin, proceed to next middleware or route handler
    next();
    // Note: req.user should have been set by requireAuth middleware, which should be used before this middleware
  } catch (err) {
    console.error('Error in requireAdmin middleware:', err);
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      details: 'Authorization check failed',
    });
  }
}

// Export middleware functions for use in route definitions
module.exports = {
  requireAuth,
  requireAdmin,
};
