/**
 * Confirm Booking API
 * PATCH /api/bookings/[id]/confirm - Reader confirms a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingByIdWithUsers, updateBookingStatus } from '@/data/bookings';
import { notifyUserBookingConfirmed } from '@/utils/notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const booking = await getBookingByIdWithUsers(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Không tìm thấy lịch hẹn.' },
        { status: 404 }
      );
    }

    // Only the assigned reader (or admin) can confirm
    const user = context!.user;
    if (user.role !== 'admin' && booking.readerId !== user.id) {
      return NextResponse.json(
        { error: 'Chỉ reader được chỉ định mới có thể xác nhận lịch hẹn.' },
        { status: 403 }
      );
    }

    // Only PENDING bookings can be confirmed
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Không thể xác nhận lịch hẹn có trạng thái: ${booking.status}.` },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, 'CONFIRMED');

    // Send notification to user (non-blocking)
    if (updated) {
      notifyUserBookingConfirmed(updated).catch((err) => {
        console.error('[Booking] Failed to send confirm notification:', err);
      });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Confirm booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xác nhận lịch hẹn.' },
      { status: 500 }
    );
  }
}
