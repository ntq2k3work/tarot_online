/**
 * Authentication utility functions
 * Handles JWT token generation/verification and password hashing
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TokenPayload, UserRole } from '@/types/auth';

// JWT secret key - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'tarot-online-jwt-secret-key-change-in-production';

// JWT token expiration time (24 hours)
const TOKEN_EXPIRY = '24h';

// Salt rounds for bcrypt password hashing
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for an authenticated user
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 * Returns the decoded payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract the Bearer token from an Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Check if a role has sufficient permissions
 * Role hierarchy: admin > render > user
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    render: 2,
    admin: 3,
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
