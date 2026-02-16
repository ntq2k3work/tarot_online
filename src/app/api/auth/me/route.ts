/**
 * GET /api/auth/me
 * Get the currently authenticated user's profile
 * Requires: authenticated user (any role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the request
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    return NextResponse.json({ user: context!.user });
  } catch (error) {
    console.error('Get profile error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
