/**
 * Reading History API
 * GET /api/history - Get reading history for the authenticated user
 * POST /api/history - Save a new reading to history
 * DELETE /api/history - Clear all reading history for the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import prisma from '@/lib/prisma';

/**
 * GET - Get all readings for the authenticated user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const readings = await prisma.readingHistory.findMany({
      where: { userId: context!.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const formattedReadings = readings.map((r: { id: string; createdAt: Date; spreadType: string; question: string | null; cards: unknown; interpretation: string | null }) => ({
      id: r.id,
      date: r.createdAt.toISOString(),
      spreadType: r.spreadType,
      question: r.question,
      cards: r.cards,
      interpretation: r.interpretation,
    }));

    return NextResponse.json({ readings: formattedReadings });
  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save a new reading to history
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { spreadType, question, cards, interpretation } = body;

    if (!spreadType || !cards || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ. Cần có spreadType và cards.' },
        { status: 400 }
      );
    }

    const reading = await prisma.readingHistory.create({
      data: {
        userId: context!.user.id,
        spreadType,
        question: question || null,
        cards: cards,
        interpretation: interpretation || null,
      },
    });

    return NextResponse.json({
      reading: {
        id: reading.id,
        date: reading.createdAt.toISOString(),
        spreadType: reading.spreadType,
        question: reading.question,
        cards: reading.cards,
        interpretation: reading.interpretation,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Save reading error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lưu lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear all reading history for the user
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    await prisma.readingHistory.deleteMany({
      where: { userId: context!.user.id },
    });

    return NextResponse.json({ message: 'Đã xóa tất cả lịch sử đọc bài.' });
  } catch (error) {
    console.error('Clear history error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa lịch sử. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
