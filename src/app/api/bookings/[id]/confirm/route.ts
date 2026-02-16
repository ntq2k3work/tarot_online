/**
 * PUT /api/bookings/:id/confirm - Reader confirms a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { query } from '@/utils/db';
import { getBookingWithDetails } from '@/app/api/bookings/route';
import { notifyUserBookingConfirmed } from '@/utils/notifications';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { context, errorResponse } = await authenticateRequest(request);
  if (!context) return errorResponse!;

  try {
    const { id } = await params;

    // Verify booking exists and belongs to this reader
    const bookingResult = await query<{ id: string; reader_id: string; status: string }>(
      'SELECT id, reader_id, status FROM bookings WHERE id = $1',
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Lịch hẹn không tồn tại.' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    if (booking.reader_id !== context.user.id) {
      return NextResponse.json({ error: 'Bạn không có quyền xác nhận lịch hẹn này.' }, { status: 403 });
    }

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: `Không thể xác nhận lịch hẹn có trạng thái "${booking.status}".` },
        { status: 400 }
      );
    }

    // Update status to confirmed
    await query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2',
      ['confirmed', id]
    );

    // Notify user
    const bookingDetails = await getBookingWithDetails(id);
    if (bookingDetails) {
      notifyUserBookingConfirmed(bookingDetails).catch(console.error);
    }

    return NextResponse.json({ message: 'Lịch hẹn đã được xác nhận.' });
  } catch (error) {
    console.error('Error confirming booking:', error);
    return NextResponse.json({ error: 'Lỗi khi xác nhận lịch hẹn.' }, { status: 500 });
  }
}
