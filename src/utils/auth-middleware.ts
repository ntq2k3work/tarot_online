/**
 * Authentication & Authorization Middleware
 * Provides helper functions to protect API routes based on roles
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractBearerToken, verifyToken, hasMinimumRole } from '@/utils/auth';
import { findUserById } from '@/data/users';
import { TokenPayload, UserRole, UserPublic } from '@/types/auth';

// Authenticated request context
export interface AuthContext {
  user: UserPublic;
  tokenPayload: TokenPayload;
}

/**
 * Authenticate a request and return the user context
 * Returns null with an error response if authentication fails
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ context: AuthContext | null; errorResponse: NextResponse | null }> {
  const authHeader = request.headers.get('authorization');
  const token = extractBearerToken(authHeader);

  if (!token) {
    return {
      context: null,
      errorResponse: NextResponse.json(
        { error: 'Yêu cầu xác thực. Vui lòng đăng nhập.' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      context: null,
      errorResponse: NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn.' },
        { status: 401 }
      ),
    };
  }

  // Verify user still exists
  const user = await findUserById(payload.userId);
  if (!user) {
    return {
      context: null,
      errorResponse: NextResponse.json(
        { error: 'Người dùng không tồn tại.' },
        { status: 401 }
      ),
    };
  }

  const userPublic: UserPublic = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    context: { user: userPublic, tokenPayload: payload },
    errorResponse: null,
  };
}

/**
 * Authorize a request based on minimum required role
 * Must be called after authenticateRequest
 */
export function authorizeRole(
  context: AuthContext,
  requiredRole: UserRole
): NextResponse | null {
  if (!hasMinimumRole(context.user.role, requiredRole)) {
    return NextResponse.json(
      { error: `Bạn không có quyền truy cập. Yêu cầu vai trò: ${requiredRole}` },
      { status: 403 }
    );
  }
  return null; // Authorized
}
