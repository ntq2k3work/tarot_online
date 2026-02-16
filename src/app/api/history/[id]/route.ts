/**
 * Single Reading History API
 * DELETE /api/history/[id] - Delete a specific reading from history
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import prisma from '@/lib/prisma';

/**
 * DELETE - Delete a specific reading by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    // Verify the reading belongs to the user
    const reading = await prisma.readingHistory.findFirst({
      where: {
        id,
        userId: context!.user.id,
      },
    });

    if (!reading) {
      return NextResponse.json(
        { error: 'Không tìm thấy lịch sử đọc bài.' },
        { status: 404 }
      );
    }

    await prisma.readingHistory.delete({ where: { id } });

    return NextResponse.json({ message: 'Đã xóa lịch sử đọc bài.' });
  } catch (error) {
    console.error('Delete reading error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
