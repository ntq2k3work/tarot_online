/**
 * Bookings API
 * POST /api/bookings - Create a new booking (User books a Reader)
 * GET /api/bookings - List bookings (filtered by user/reader role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { createBooking, getBookingsByUserId, getBookingsByReaderId, getAllBookings } from '@/data/bookings';
import { findUserById } from '@/data/users';
import { CreateBookingRequest } from '@/types/booking';
import { notifyReaderNewBooking } from '@/utils/notification';
import { isValidUUID, safeParseJSON, sanitizeString } from '@/utils/validation';

const MAX_NOTES_LENGTH = 1000;

/**
 * POST - Create a new booking request
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = await safeParseJSON(request);
    if (!body) {
      return NextResponse.json(
        { error: 'Request body không hợp lệ.' },
        { status: 400 }
      );
    }

    const { readerId, scheduledAt, notes } = body as CreateBookingRequest;

    // Validate required fields
    if (!readerId || !scheduledAt) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp readerId và scheduledAt.' },
        { status: 400 }
      );
    }

    // Validate readerId is a valid UUID
    if (typeof readerId !== 'string' || !isValidUUID(readerId)) {
      return NextResponse.json(
        { error: 'readerId không hợp lệ.' },
        { status: 400 }
      );
    }

    // Validate scheduledAt is a valid future date
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: 'scheduledAt không phải là ngày giờ hợp lệ.' },
        { status: 400 }
      );
    }
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Thời gian hẹn phải ở tương lai.' },
        { status: 400 }
      );
    }

    // Sanitize notes
    const sanitizedNotes = notes && typeof notes === 'string'
      ? sanitizeString(notes, MAX_NOTES_LENGTH)
      : undefined;

    // Verify reader exists and has 'render' role
    const reader = await findUserById(readerId);
    if (!reader || reader.role !== 'render') {
      return NextResponse.json(
        { error: 'Reader không tồn tại hoặc không phải là reader.' },
        { status: 404 }
      );
    }

    // Prevent booking yourself
    if (context!.user.id === readerId) {
      return NextResponse.json(
        { error: 'Bạn không thể đặt lịch hẹn với chính mình.' },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await createBooking(
      context!.user.id,
      readerId,
      scheduledAt,
      sanitizedNotes
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Không thể tạo lịch hẹn. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Send notification to reader (fire-and-forget)
    notifyReaderNewBooking(reader.email, reader.phone, {
      bookingId: booking.id,
      userName: context!.user.username,
      readerName: reader.username,
      scheduledAt,
      notes: sanitizedNotes,
    }).catch((err) => console.error('Notification error:', err));

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * GET - List bookings for the authenticated user
 * Readers see bookings where they are the reader
 * Users see bookings where they are the customer
 * Admins see all bookings
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const user = context!.user;
    let bookings;

    if (user.role === 'admin') {
      // Admins see all bookings
      bookings = await getAllBookings();
    } else if (user.role === 'render') {
      // Readers see their incoming bookings
      bookings = await getBookingsByReaderId(user.id);
    } else {
      // Regular users see their own bookings
      bookings = await getBookingsByUserId(user.id);
    }

    return NextResponse.json({ bookings, total: bookings.length });
  } catch (error) {
    console.error('List bookings error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
