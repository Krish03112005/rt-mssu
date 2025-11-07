import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token with user information
 * @param {Object} payload - Token payload containing userId, role, and email
 * @param {string} payload.userId - User's unique identifier (student_id, faculty_id, or parent_id)
 * @param {string} payload.role - User's role (student, faculty, or parent)
 * @param {string} payload.email - User's email address
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  const { userId, role, email } = payload;
  
  if (!userId || !role || !email) {
    throw new Error('Missing required payload fields: userId, role, and email are required');
  }

  const tokenPayload = {
    userId,
    role,
    email
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRATION || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.sign(tokenPayload, secret, { expiresIn });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload containing userId, role, email, iat, and exp
 * @throws {Error} If token is invalid, expired, or malformed
 */
export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token is required');
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw error;
    }
  }
};
