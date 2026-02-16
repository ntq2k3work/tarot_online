/**
 * Authentication utility functions
 * Handles token generation/verification and password hashing
 * Uses simple random token-based auth stored in PostgreSQL (no JWT)
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/types/auth';
import { query } from '@/utils/db';

// Token expiration time in hours
const TOKEN_EXPIRY_HOURS = 24;

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
 * Generate a random authentication token and store it in the database
 */
export async function generateToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await query(
    'UPDATE users SET token = $1, token_expires_at = $2, updated_at = NOW() WHERE id = $3',
    [token, expiresAt.toISOString(), userId]
  );

  return token;
}

/**
 * Verify a token by checking it against the database
 * Returns the user ID if valid, null otherwise
 */
export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string; role: UserRole } | null> {
  const result = await query<{
    id: string;
    email: string;
    role: UserRole;
    token_expires_at: string;
  }>(
    'SELECT id, email, role, token_expires_at FROM users WHERE token = $1',
    [token]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  // Check if token has expired
  if (new Date(user.token_expires_at) < new Date()) {
    // Clear expired token
    await query('UPDATE users SET token = NULL, token_expires_at = NULL WHERE id = $1', [user.id]);
    return null;
  }

  return { userId: user.id, email: user.email, role: user.role };
}

/**
 * Invalidate a user's token (logout)
 */
export async function invalidateToken(userId: string): Promise<void> {
  await query(
    'UPDATE users SET token = NULL, token_expires_at = NULL, updated_at = NOW() WHERE id = $1',
    [userId]
  );
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
