/**
 * Single History Item API
 * DELETE /api/history/[id] - Delete a specific history record
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { deleteUserHistory } from '@/data/users';
import { isValidUUID } from '@/utils/validation';

/**
 * DELETE - Delete a specific history record
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID lịch sử không hợp lệ.' },
        { status: 400 }
      );
    }

    const deleted = await deleteUserHistory(id, context!.user.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Không tìm thấy bản ghi lịch sử.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Đã xóa bản ghi lịch sử thành công.' });
  } catch (error) {
    console.error('Delete history item error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
