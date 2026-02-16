/**
 * User History API
 * GET /api/history - Get reading history for the authenticated user
 * POST /api/history - Save a new reading to history
 * DELETE /api/history - Delete all history for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getUserHistory, createUserHistory, deleteAllUserHistory } from '@/data/users';
import { safeParseJSON } from '@/utils/validation';

/**
 * GET - Get all reading history for the current user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const history = await getUserHistory(context!.user.id);
    return NextResponse.json({ history, total: history.length });
  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save a new reading to history
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = await safeParseJSON(request);
    if (!body) {
      return NextResponse.json(
        { error: 'Request body không hợp lệ.' },
        { status: 400 }
      );
    }

    const { readingType, readingData } = body as {
      readingType: string;
      readingData: Record<string, unknown>;
    };

    if (!readingType || typeof readingType !== 'string') {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp loại đọc bài (readingType).' },
        { status: 400 }
      );
    }

    if (!readingData || typeof readingData !== 'object' || Array.isArray(readingData)) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp dữ liệu đọc bài hợp lệ (readingData).' },
        { status: 400 }
      );
    }

    const record = await createUserHistory(
      context!.user.id,
      readingType,
      readingData
    );

    return NextResponse.json({ history: record }, { status: 201 });
  } catch (error) {
    console.error('Save history error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lưu lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete all history for the current user
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    await deleteAllUserHistory(context!.user.id);
    return NextResponse.json({ message: 'Đã xóa tất cả lịch sử thành công.' });
  } catch (error) {
    console.error('Delete history error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
