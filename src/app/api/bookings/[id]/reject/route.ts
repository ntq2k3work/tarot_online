/**
 * PUT /api/bookings/:id/reject - Reader rejects a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { query } from '@/utils/db';
import { getBookingWithDetails } from '@/app/api/bookings/route';
import { notifyUserBookingRejected } from '@/utils/notifications';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { context, errorResponse } = await authenticateRequest(request);
  if (!context) return errorResponse!;

  try {
    const { id } = await params;

    const bookingResult = await query<{ id: string; reader_id: string; status: string }>(
      'SELECT id, reader_id, status FROM bookings WHERE id = $1',
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Lịch hẹn không tồn tại.' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    if (booking.reader_id !== context.user.id) {
      return NextResponse.json({ error: 'Bạn không có quyền từ chối lịch hẹn này.' }, { status: 403 });
    }

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: `Không thể từ chối lịch hẹn có trạng thái "${booking.status}".` },
        { status: 400 }
      );
    }

    await query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2',
      ['rejected', id]
    );

    const bookingDetails = await getBookingWithDetails(id);
    if (bookingDetails) {
      notifyUserBookingRejected(bookingDetails).catch(console.error);
    }

    return NextResponse.json({ message: 'Lịch hẹn đã bị từ chối.' });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return NextResponse.json({ error: 'Lỗi khi từ chối lịch hẹn.' }, { status: 500 });
  }
}
