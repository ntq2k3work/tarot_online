/**
 * Booking Reject API
 * PATCH /api/bookings/:id/reject - Reader rejects a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingById, updateBookingStatus } from '@/data/bookings';
import { notifyUserBookingRejected } from '@/utils/notification';

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

    // Only the assigned reader can reject
    if (booking.readerId !== context!.user.id) {
      return NextResponse.json(
        { error: 'Chỉ reader được chỉ định mới có thể từ chối lịch hẹn này.' },
        { status: 403 }
      );
    }

    // Can only reject PENDING bookings
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Không thể từ chối lịch hẹn có trạng thái: ${booking.status}.` },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, 'REJECTED');

    // Send notification to user (fire-and-forget)
    notifyUserBookingRejected(booking.userEmail, booking.userPhone, {
      bookingId: booking.id,
      userName: booking.userName,
      readerName: booking.readerName,
      scheduledAt: booking.scheduledAt,
    }).catch((err) => console.error('Notification error:', err));

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Reject booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi từ chối lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
