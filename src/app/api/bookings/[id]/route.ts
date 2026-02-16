/**
 * Single Booking API
 * GET /api/bookings/[id] - Get booking detail
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { getBookingByIdWithUsers } from '@/data/bookings';

/**
 * GET - Get booking detail (only accessible by involved user, reader, or admin)
 */
export async function GET(
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

    // Only allow access to involved parties or admin
    const user = context!.user;
    if (user.role !== 'admin' && booking.userId !== user.id && booking.readerId !== user.id) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xem lịch hẹn này.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking detail error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy chi tiết lịch hẹn.' },
      { status: 500 }
    );
  }
}
