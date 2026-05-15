/**
 * JWT Helper Utility
 *
 * Responsibilities:
 * - Generate JWT tokens for authenticated users
 * - Verify and decode JWT tokens
 * - Handle JWT errors and token expiration
 *
 * Functions:
 * - `generateToken(userId, role)`: Create a new JWT
 * - `verifyToken(token)`: Validate and decode a JWT
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; // Default 7 days

/**
 * Generate a JWT token with userId and role
 * @param {number} userId - The user ID
 * @param {string} role - The user role ('user' or 'admin')
 * @returns {string} - The signed JWT token
 */
function generateToken(userId, role) {
  try {
    const payload = {
      userId,
      role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256',
    });

    return token;
  } catch (err) {
    console.error('Error generating JWT token:', err.message);
    throw err;
  }
}

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {object} - The decoded token payload { userId, role, iat, exp }
 * @throws {Error} - If token is invalid or expired
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw err;
  }
}

/**
 * Middleware to protect routes - requires valid JWT
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        details: 'Authorization header with Bearer token is required',
      });
    }

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
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
};
