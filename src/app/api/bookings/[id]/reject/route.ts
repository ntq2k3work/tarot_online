/**
 * Reject Booking API
 * PATCH /api/bookings/[id]/reject - Reader rejects a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingByIdWithUsers, updateBookingStatus } from '@/data/bookings';
import { notifyUserBookingRejected } from '@/utils/notifications';

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

    // Only the assigned reader (or admin) can reject
    const user = context!.user;
    if (user.role !== 'admin' && booking.readerId !== user.id) {
      return NextResponse.json(
        { error: 'Chỉ reader được chỉ định mới có thể từ chối lịch hẹn.' },
        { status: 403 }
      );
    }

    // Only PENDING bookings can be rejected
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Không thể từ chối lịch hẹn có trạng thái: ${booking.status}.` },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, 'REJECTED');

    // Send notification to user (non-blocking)
    if (updated) {
      notifyUserBookingRejected(updated).catch((err) => {
        console.error('[Booking] Failed to send reject notification:', err);
      });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Reject booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi từ chối lịch hẹn.' },
      { status: 500 }
    );
  }
}
