import { verifyToken } from '../services/jwtService.js';

/**
 * Authentication middleware to protect routes
 * Extracts JWT from Authorization header, verifies it, and attaches user data to req.user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error("[AUTH ERROR] Authorization header missing:", {
        timestamp: new Date().toISOString(),
        errorType: "MISSING_AUTH_HEADER",
        errorMessage: "Authorization header missing",
        path: req.path,
        method: req.method
      });
      
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing'
      });
    }

    // Check if header follows "Bearer <token>" format
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.error("[AUTH ERROR] Invalid authorization header format:", {
        timestamp: new Date().toISOString(),
        errorType: "INVALID_AUTH_FORMAT",
        errorMessage: "Invalid authorization header format",
        path: req.path,
        method: req.method
      });
      
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format. Expected: Bearer <token>'
      });
    }

    const token = parts[1];

    if (!token) {
      console.error("[AUTH ERROR] Token missing:", {
        timestamp: new Date().toISOString(),
        errorType: "MISSING_TOKEN",
        errorMessage: "Token missing from authorization header",
        path: req.path,
        method: req.method
      });
      
      return res.status(401).json({
        success: false,
        message: 'Token missing'
      });
    }

    // Verify token and extract user data
    const decoded = verifyToken(token);

    // Attach decoded user data to request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle token verification errors with structured logging
    if (error.message === 'Token has expired') {
      console.error("[AUTH ERROR] Token expired:", {
        timestamp: new Date().toISOString(),
        errorType: "TOKEN_EXPIRED",
        errorMessage: "Token has expired",
        path: req.path,
        method: req.method
      });
      
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    } else if (error.message === 'Invalid token') {
      console.error("[AUTH ERROR] Invalid token:", {
        timestamp: new Date().toISOString(),
        errorType: "INVALID_TOKEN",
        errorMessage: "Invalid token signature or format",
        path: req.path,
        method: req.method
      });
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else {
      // Log unexpected authentication errors
      console.error("[AUTH ERROR] Authentication middleware error:", {
        timestamp: new Date().toISOString(),
        errorType: "AUTHENTICATION_ERROR",
        errorMessage: error.message,
        errorStack: error.stack,
        path: req.path,
        method: req.method
      });

      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }
};
