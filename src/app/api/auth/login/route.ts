/**
 * POST /api/auth/login
 * Authenticate a user with email and password, return a simple token
 */

import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/utils/auth';
import { findUserByEmail } from '@/data/users';
import { LoginRequest, AuthResponse, UserPublic } from '@/types/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body as LoginRequest;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp email và mật khẩu.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    // Generate simple token and store in database
    const token = await generateToken(user.id);

    // Return user data (without password hash) and token
    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response: AuthResponse = { token, user: userPublic };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
