/**
 * Admin User Management - Single User API
 * GET /api/admin/users/[id] - Get user details (admin only)
 * PATCH /api/admin/users/[id] - Update user role (admin only)
 * DELETE /api/admin/users/[id] - Delete a user (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, authorizeRole } from '@/utils/auth-middleware';
import { findUserById, updateUserRole, deleteUser } from '@/data/users';
import { UserPublic, UserRole } from '@/types/auth';

// Valid roles for role update
const VALID_ROLES: UserRole[] = ['user', 'render', 'admin'];

/**
 * GET - Get a single user's details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const authzError = authorizeRole(context!, 'admin');
    if (authzError) return authzError;

    const { id } = await params;
    const user = await findUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng.' },
        { status: 404 }
      );
    }

    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ user: userPublic });
  } catch (error) {
    console.error('Admin get user error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update a user's role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const authzError = authorizeRole(context!, 'admin');
    if (authzError) return authzError;

    const { id } = await params;
    const body = await request.json();
    const { role } = body as { role: UserRole };

    // Validate role
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Vai trò không hợp lệ. Các vai trò hợp lệ: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Prevent admin from changing their own role
    if (id === context!.user.id) {
      return NextResponse.json(
        { error: 'Không thể thay đổi vai trò của chính mình.' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserRole(id, role);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng.' },
        { status: 404 }
      );
    }

    const userPublic: UserPublic = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json({
      message: `Đã cập nhật vai trò thành "${role}".`,
      user: userPublic,
    });
  } catch (error) {
    console.error('Admin update user role error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const authzError = authorizeRole(context!, 'admin');
    if (authzError) return authzError;

    const { id } = await params;

    // Prevent admin from deleting themselves
    if (id === context!.user.id) {
      return NextResponse.json(
        { error: 'Không thể xóa tài khoản của chính mình.' },
        { status: 400 }
      );
    }

    const deleted = await deleteUser(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Đã xóa người dùng thành công.' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
