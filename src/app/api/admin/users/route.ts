/**
 * Admin User Management API
 * GET /api/admin/users - List all users (admin only)
 * Requires: authenticated user with "admin" role
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, authorizeRole } from '@/utils/auth-middleware';
import { getAllUsers } from '@/data/users';
import { UserPublic } from '@/types/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    // Authorize - admin only
    const authzError = authorizeRole(context!, 'admin');
    if (authzError) return authzError;

    // Get all users (strip password hashes)
    const users = await getAllUsers();
    const usersPublic: UserPublic[] = users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      role: u.role,
      phone: u.phone,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return NextResponse.json({ users: usersPublic, total: usersPublic.length });
  } catch (error) {
    console.error('Admin get users error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
