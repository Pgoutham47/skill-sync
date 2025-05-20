
import jwt from 'jsonwebtoken';
import { User } from '../../generated/prisma';

// Types
interface JwtPayload {
  userId: string;
  email: string;
}

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// If no JWT_SECRET is provided, warn in development
if (process.env.NODE_ENV === 'development' && JWT_SECRET === 'your_jwt_secret_key_here') {
  console.warn('Warning: Using default JWT_SECRET. Set a secure secret in production.');
}

/**
 * Generate a JWT token for a user
 */
export const generateToken = (user: { id: string; email: string }): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  // Sign token with JWT_SECRET, expires in 1 day
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  });
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from authorization header
 */
export const extractToken = (authHeader: string | undefined): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  return authHeader.split(' ')[1];
};
