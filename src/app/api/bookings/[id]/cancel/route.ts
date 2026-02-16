/**
 * PUT /api/bookings/:id/cancel - User cancels a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { query } from '@/utils/db';
import { getBookingWithDetails } from '@/app/api/bookings/route';
import { notifyReaderBookingCancelled } from '@/utils/notifications';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { context, errorResponse } = await authenticateRequest(request);
  if (!context) return errorResponse!;

  try {
    const { id } = await params;

    const bookingResult = await query<{ id: string; user_id: string; status: string }>(
      'SELECT id, user_id, status FROM bookings WHERE id = $1',
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Lịch hẹn không tồn tại.' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    if (booking.user_id !== context.user.id) {
      return NextResponse.json({ error: 'Bạn không có quyền hủy lịch hẹn này.' }, { status: 403 });
    }

    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return NextResponse.json(
        { error: `Không thể hủy lịch hẹn có trạng thái "${booking.status}".` },
        { status: 400 }
      );
    }

    await query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', id]
    );

    const bookingDetails = await getBookingWithDetails(id);
    if (bookingDetails) {
      notifyReaderBookingCancelled(bookingDetails).catch(console.error);
    }

    return NextResponse.json({ message: 'Lịch hẹn đã được hủy.' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Lỗi khi hủy lịch hẹn.' }, { status: 500 });
  }
}
