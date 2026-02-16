/**
 * Authentication utility functions
 * Handles simple token generation/verification and password hashing
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { UserRole } from '@/types/auth';

// Token validity duration (24 hours in milliseconds)
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

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
 * Generate a simple random token and store it in the database
 * Returns the token string
 */
export async function generateToken(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Verify a token by checking it against the database
 * Returns the user ID and role if valid, null otherwise
 */
export async function verifyToken(token: string): Promise<{ userId: string; email: string; role: UserRole } | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check if token has expired
  if (session.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role as UserRole,
  };
}

/**
 * Revoke a token (logout)
 */
export async function revokeToken(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}

/**
 * Revoke all tokens for a user
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
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
