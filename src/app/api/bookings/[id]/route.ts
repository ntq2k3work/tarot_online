/**
 * Booking Detail API
 * GET /api/bookings/:id - Get booking detail
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingById } from '@/data/bookings';
import { isValidUUID } from '@/utils/validation';

/**
 * GET - Get a single booking by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID lịch hẹn không hợp lệ.' },
        { status: 400 }
      );
    }

    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Lịch hẹn không tồn tại.' },
        { status: 404 }
      );
    }

    // Only allow the user, reader, or admin to view
    const user = context!.user;
    if (
      user.role !== 'admin' &&
      booking.userId !== user.id &&
      booking.readerId !== user.id
    ) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xem lịch hẹn này.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking detail error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy chi tiết lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
