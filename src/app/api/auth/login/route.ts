/**
 * POST /api/auth/login
 * Authenticate a user with email and password, return auth token
 */

import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/utils/auth';
import { findUserByEmail } from '@/data/users';
import { LoginRequest, AuthResponse, UserPublic } from '@/types/auth';
import { sanitizeString, isValidEmail } from '@/utils/validation';
import { checkRateLimit, getClientIP, RATE_LIMIT_AUTH } from '@/utils/rate-limit';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting for auth endpoints (prevent brute force)
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`login:${clientIP}`, RATE_LIMIT_AUTH);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const { email: rawEmail, password } = body as LoginRequest;

    // Sanitize and validate inputs
    const email = sanitizeString(rawEmail).toLowerCase();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp email và mật khẩu.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ.' },
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
    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
