/**
 * User History API
 * GET /api/history - Get reading history for the authenticated user
 * POST /api/history - Save a new reading to history
 * DELETE /api/history - Delete all history for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getUserHistory, createUserHistory, deleteAllUserHistory } from '@/data/users';
import { sanitizeString, isNonEmptyString } from '@/utils/validation';

/** Maximum size of readingData JSON in characters */
const MAX_READING_DATA_SIZE = 50_000;

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
    console.error('Get history error:', error instanceof Error ? error.message : 'Unknown error');
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

    const body = await request.json();
    const { readingType: rawReadingType, readingData } = body as {
      readingType: string;
      readingData: Record<string, unknown>;
    };

    // Sanitize readingType
    const readingType = sanitizeString(rawReadingType);

    if (!isNonEmptyString(readingType) || !readingData) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp loại đọc bài và dữ liệu.' },
        { status: 400 }
      );
    }

    // Validate readingType length
    if (readingType.length > 100) {
      return NextResponse.json(
        { error: 'Loại đọc bài không được vượt quá 100 ký tự.' },
        { status: 400 }
      );
    }

    // Validate readingData is an object and not too large
    if (typeof readingData !== 'object' || Array.isArray(readingData)) {
      return NextResponse.json(
        { error: 'Dữ liệu đọc bài phải là một đối tượng JSON.' },
        { status: 400 }
      );
    }

    // Check readingData size to prevent abuse
    const dataSize = JSON.stringify(readingData).length;
    if (dataSize > MAX_READING_DATA_SIZE) {
      return NextResponse.json(
        { error: 'Dữ liệu đọc bài quá lớn.' },
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
    console.error('Save history error:', error instanceof Error ? error.message : 'Unknown error');
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
    console.error('Delete history error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
