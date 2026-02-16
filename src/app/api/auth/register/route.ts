/**
 * POST /api/auth/register
 * Register a new user with email, username, and password
 * Default role: "user"
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/utils/auth';
import { findUserByEmail, createUser } from '@/data/users';
import { RegisterRequest, AuthResponse, UserPublic } from '@/types/auth';
import {
  sanitizeString,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from '@/utils/validation';
import { checkRateLimit, getClientIP, RATE_LIMIT_AUTH } from '@/utils/rate-limit';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting for auth endpoints
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`register:${clientIP}`, RATE_LIMIT_AUTH);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const { email: rawEmail, username: rawUsername, password } = body as RegisterRequest;

    // Sanitize inputs
    const email = sanitizeString(rawEmail).toLowerCase();
    const username = sanitizeString(rawUsername);

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp email, tên người dùng và mật khẩu.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có từ 6 đến 128 ký tự.' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: 'Tên người dùng phải có từ 3-50 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng.' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, username, passwordHash);

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
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
