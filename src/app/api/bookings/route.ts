/**
 * Bookings API
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - List bookings (filtered by user role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { CreateBookingRequest } from '@/types/booking';
import {
  createBooking,
  getBookingsByUserId,
  getBookingsByReaderId,
  getAllBookings,
} from '@/data/bookings';
import { findUserById } from '@/data/users';
import { notifyReaderNewBooking } from '@/utils/notifications';

/**
 * POST - Create a new booking (authenticated user books a reader)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as CreateBookingRequest;

    // Validate required fields
    if (!body.readerId || !body.scheduledAt) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp readerId và scheduledAt.' },
        { status: 400 }
      );
    }

    // Validate scheduledAt is a valid future date
    const scheduledDate = new Date(body.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: 'scheduledAt không phải là ngày hợp lệ.' },
        { status: 400 }
      );
    }
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Thời gian hẹn phải ở tương lai.' },
        { status: 400 }
      );
    }

    // Verify reader exists and has 'render' role
    const reader = await findUserById(body.readerId);
    if (!reader || reader.role !== 'render') {
      return NextResponse.json(
        { error: 'Reader không tồn tại hoặc không phải là reader.' },
        { status: 404 }
      );
    }

    // Prevent booking yourself
    if (context!.user.id === body.readerId) {
      return NextResponse.json(
        { error: 'Bạn không thể đặt lịch hẹn với chính mình.' },
        { status: 400 }
      );
    }

    const booking = await createBooking(
      context!.user.id,
      body.readerId,
      body.scheduledAt,
      body.notes
    );

    // Send notifications to reader (non-blocking, errors are caught internally)
    notifyReaderNewBooking(booking).catch((err) => {
      console.error('[Booking] Failed to send new booking notification:', err);
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo lịch hẹn.' },
      { status: 500 }
    );
  }
}

/**
 * GET - List bookings based on user role
 * - admin: all bookings
 * - render: bookings where they are the reader
 * - user: bookings where they are the customer
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const user = context!.user;
    let bookings;

    switch (user.role) {
      case 'admin':
        bookings = await getAllBookings();
        break;
      case 'render':
        bookings = await getBookingsByReaderId(user.id);
        break;
      default:
        bookings = await getBookingsByUserId(user.id);
        break;
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('List bookings error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách lịch hẹn.' },
      { status: 500 }
    );
  }
}
