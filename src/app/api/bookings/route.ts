/**
 * Bookings API
 * POST /api/bookings - Create a new booking (User books a Reader)
 * GET /api/bookings - List bookings (filtered by user/reader role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { createBooking, getBookingsByUserId, getBookingsByReaderId } from '@/data/bookings';
import { findUserById } from '@/data/users';
import { CreateBookingRequest } from '@/types/booking';
import { notifyReaderNewBooking } from '@/utils/notification';
import { isValidUUID, isValidISODate, isFutureDate, isValidNotes, sanitizeString } from '@/utils/validation';
import { checkRateLimit, getClientIP, RATE_LIMIT_GENERAL } from '@/utils/rate-limit';

/**
 * POST - Create a new booking request
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`bookings:${clientIP}`, RATE_LIMIT_GENERAL);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
        { status: 429 }
      );
    }

    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as CreateBookingRequest;
    const { readerId, scheduledAt, notes: rawNotes } = body;

    // Sanitize notes input
    const notes = rawNotes ? sanitizeString(rawNotes) : undefined;

    // Validate required fields
    if (!readerId || !scheduledAt) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp readerId và scheduledAt.' },
        { status: 400 }
      );
    }

    // Validate UUID format for readerId
    if (!isValidUUID(readerId)) {
      return NextResponse.json(
        { error: 'readerId không hợp lệ.' },
        { status: 400 }
      );
    }

    // Validate scheduledAt is a valid date
    if (!isValidISODate(scheduledAt)) {
      return NextResponse.json(
        { error: 'scheduledAt không phải là ngày giờ hợp lệ.' },
        { status: 400 }
      );
    }

    // Validate scheduledAt is in the future
    if (!isFutureDate(scheduledAt)) {
      return NextResponse.json(
        { error: 'Thời gian hẹn phải ở tương lai.' },
        { status: 400 }
      );
    }

    // Validate notes length
    if (!isValidNotes(notes)) {
      return NextResponse.json(
        { error: 'Ghi chú không được vượt quá 1000 ký tự.' },
        { status: 400 }
      );
    }

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
      notes
    );

    // Send notification to reader (fire-and-forget)
    notifyReaderNewBooking(reader.email, reader.phone, {
      bookingId: booking.id,
      userName: context!.user.username,
      readerName: reader.username,
      scheduledAt,
      notes,
    }).catch((err) => console.error('Notification error:', err instanceof Error ? err.message : 'Unknown'));

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error instanceof Error ? error.message : 'Unknown error');
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
 * Admins see all (via reader + user queries combined)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const user = context!.user;
    let bookings;

    if (user.role === 'render') {
      // Readers see their incoming bookings
      bookings = await getBookingsByReaderId(user.id);
    } else if (user.role === 'admin') {
      // Admins see both sides
      const asUser = await getBookingsByUserId(user.id);
      const asReader = await getBookingsByReaderId(user.id);
      const ids = new Set<string>();
      bookings = [...asUser, ...asReader].filter((b) => {
        if (ids.has(b.id)) return false;
        ids.add(b.id);
        return true;
      });
    } else {
      // Regular users see their own bookings
      bookings = await getBookingsByUserId(user.id);
    }

    return NextResponse.json({ bookings, total: bookings.length });
  } catch (error) {
    console.error('List bookings error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách lịch hẹn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
