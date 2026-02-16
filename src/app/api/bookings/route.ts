/**
 * Bookings API
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - List bookings for the authenticated user/reader
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { query } from '@/utils/db';
import { BookingWithDetails, CreateBookingRequest } from '@/types/booking';
import { notifyReaderNewBooking } from '@/utils/notifications';

/**
 * POST /api/bookings - User creates a booking with a reader
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { context, errorResponse } = await authenticateRequest(request);
  if (!context) return errorResponse!;

  try {
    const body: CreateBookingRequest = await request.json();
    const { readerId, scheduledDate, scheduledTime, notes } = body;

    if (!readerId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp readerId, scheduledDate và scheduledTime.' },
        { status: 400 }
      );
    }

    // Verify the reader exists and has 'render' role
    const readerResult = await query<{ id: string; role: string }>(
      'SELECT id, role FROM users WHERE id = $1',
      [readerId]
    );
    if (readerResult.rows.length === 0 || readerResult.rows[0].role !== 'render') {
      return NextResponse.json(
        { error: 'Reader không tồn tại hoặc không hợp lệ.' },
        { status: 404 }
      );
    }

    // Prevent booking yourself
    if (context.user.id === readerId) {
      return NextResponse.json(
        { error: 'Bạn không thể đặt lịch với chính mình.' },
        { status: 400 }
      );
    }

    // Create the booking
    const insertResult = await query<{ id: string }>(
      `INSERT INTO bookings (user_id, reader_id, scheduled_date, scheduled_time, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [context.user.id, readerId, scheduledDate, scheduledTime, notes || null]
    );

    const bookingId = insertResult.rows[0].id;

    // Fetch full booking details for notification
    const bookingDetails = await getBookingWithDetails(bookingId);

    // Notify reader (fire and forget)
    if (bookingDetails) {
      notifyReaderNewBooking(bookingDetails).catch(console.error);
    }

    return NextResponse.json(
      { message: 'Đặt lịch thành công!', bookingId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo lịch hẹn.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings - Get bookings for the authenticated user
 * Returns bookings where the user is either the client or the reader
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { context, errorResponse } = await authenticateRequest(request);
  if (!context) return errorResponse!;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = `
      SELECT
        b.id, b.user_id AS "userId", b.reader_id AS "readerId",
        b.scheduled_date AS "scheduledDate", b.scheduled_time AS "scheduledTime",
        b.status, b.notes, b.created_at AS "createdAt", b.updated_at AS "updatedAt",
        u.username AS "userName", u.email AS "userEmail", u.phone AS "userPhone",
        r.username AS "readerName", r.email AS "readerEmail", r.phone AS "readerPhone"
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN users r ON b.reader_id = r.id
      WHERE (b.user_id = $1 OR b.reader_id = $1)
    `;
    const params: unknown[] = [context.user.id];

    if (status) {
      sql += ' AND b.status = $2';
      params.push(status);
    }

    sql += ' ORDER BY b.scheduled_date DESC, b.scheduled_time DESC';

    const result = await query<BookingWithDetails>(sql, params);

    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách lịch hẹn.' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Fetch a booking with user and reader details
 */
export async function getBookingWithDetails(bookingId: string): Promise<BookingWithDetails | null> {
  const result = await query<BookingWithDetails>(
    `SELECT
      b.id, b.user_id AS "userId", b.reader_id AS "readerId",
      b.scheduled_date AS "scheduledDate", b.scheduled_time AS "scheduledTime",
      b.status, b.notes, b.created_at AS "createdAt", b.updated_at AS "updatedAt",
      u.username AS "userName", u.email AS "userEmail", u.phone AS "userPhone",
      r.username AS "readerName", r.email AS "readerEmail", r.phone AS "readerPhone"
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN users r ON b.reader_id = r.id
    WHERE b.id = $1`,
    [bookingId]
  );
  return result.rows[0] || null;
}
