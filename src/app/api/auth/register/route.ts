/**
 * POST /api/auth/register
 * Register a new user with email, username, and password
 * Default role: "user"
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/utils/auth';
import { findUserByEmail, createUser } from '@/data/users';
import { RegisterRequest, AuthResponse, UserPublic } from '@/types/auth';
import { safeParseJSON, sanitizeString } from '@/utils/validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeParseJSON(request);
    if (!body) {
      return NextResponse.json(
        { error: 'Request body không hợp lệ.' },
        { status: 400 }
      );
    }

    const { email, username, password } = body as RegisterRequest;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp email, tên người dùng và mật khẩu.' },
        { status: 400 }
      );
    }

    // Validate types
    if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email, tên người dùng và mật khẩu phải là chuỗi ký tự.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Validate password length (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự.' },
        { status: 400 }
      );
    }

    // Validate username length
    const trimmedUsername = sanitizeString(username, 100);
    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: 'Tên người dùng phải có ít nhất 3 ký tự.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(email.trim().toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng.' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await createUser(email.trim().toLowerCase(), trimmedUsername, passwordHash);

    // Generate random token and store in database
    const token = await generateToken(user.id);

    // Return user data (without password hash) and token
    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response: AuthResponse = { token, user: userPublic };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
