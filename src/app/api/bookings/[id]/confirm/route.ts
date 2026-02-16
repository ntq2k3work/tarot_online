/**
 * Booking Confirm API
 * PATCH /api/bookings/:id/confirm - Reader confirms a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingById, updateBookingStatus } from '@/data/bookings';
import { notifyUserBookingConfirmed } from '@/utils/notification';
import { isValidUUID } from '@/utils/validation';

export async function PATCH(
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

    // Only the assigned reader or admin can confirm
    const user = context!.user;
    if (user.role !== 'admin' && booking.readerId !== user.id) {
      return NextResponse.json(
        { error: 'Chỉ reader được chỉ định mới có thể xác nhận lịch hẹn này.' },
        { status: 403 }
      );
    }

    // Can only confirm PENDING bookings
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Không thể xác nhận lịch hẹn có trạng thái: ${booking.status}.` },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, 'CONFIRMED');

    // Send notification to user (fire-and-forget)
    notifyUserBookingConfirmed(booking.userEmail, booking.userPhone, {
      bookingId: booking.id,
      userName: booking.userName,
      readerName: booking.readerName,
      scheduledAt: booking.scheduledAt,
    }).catch((err) => console.error('Notification error:', err));

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Confirm booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xác nhận lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
