/**
 * Booking Cancel API
 * PATCH /api/bookings/:id/cancel - User or Reader cancels a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingById, updateBookingStatus } from '@/data/bookings';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Lịch hẹn không tồn tại.' },
        { status: 404 }
      );
    }

    // Only the user or reader involved can cancel
    const user = context!.user;
    if (
      user.role !== 'admin' &&
      booking.userId !== user.id &&
      booking.readerId !== user.id
    ) {
      return NextResponse.json(
        { error: 'Bạn không có quyền hủy lịch hẹn này.' },
        { status: 403 }
      );
    }

    // Can only cancel PENDING or CONFIRMED bookings
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: `Không thể hủy lịch hẹn có trạng thái: ${booking.status}.` },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, 'CANCELLED');

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi hủy lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
