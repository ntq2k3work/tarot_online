/**
 * POST /api/tarot-interpretation
 * Interpret drawn tarot cards using Gemini AI
 * Rate limited to prevent abuse of expensive AI API calls
 */

import { NextRequest, NextResponse } from 'next/server';
import { interpretTarotWithGemini } from '@/utils/gemini';
import { DrawnCard } from '@/types';
import { sanitizeString } from '@/utils/validation';
import { checkRateLimit, getClientIP, RATE_LIMIT_AI } from '@/utils/rate-limit';

/** Maximum number of cards allowed in a single interpretation request */
const MAX_DRAWN_CARDS = 10;

/** Maximum question length in characters */
const MAX_QUESTION_LENGTH = 500;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting for AI endpoints (expensive API calls)
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`tarot-ai:${clientIP}`, RATE_LIMIT_AI);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một phút rồi thử lại.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const { question: rawQuestion, drawnCards } = body as {
      question: string;
      drawnCards: DrawnCard[];
    };

    // Sanitize question input to prevent XSS
    const question = sanitizeString(rawQuestion);

    // Validate question length
    if (question && question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: `Câu hỏi không được vượt quá ${MAX_QUESTION_LENGTH} ký tự.` },
        { status: 400 }
      );
    }

    // Validate drawn cards
    if (!drawnCards || !Array.isArray(drawnCards) || drawnCards.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng rút bài trước khi yêu cầu giải đáp.' },
        { status: 400 }
      );
    }

    if (drawnCards.length > MAX_DRAWN_CARDS) {
      return NextResponse.json(
        { error: `Số lượng lá bài không được vượt quá ${MAX_DRAWN_CARDS}.` },
        { status: 400 }
      );
    }

    // Validate each drawn card has required fields
    for (const drawn of drawnCards) {
      if (!drawn.card || !drawn.position || typeof drawn.isReversed !== 'boolean') {
        return NextResponse.json(
          { error: 'Dữ liệu lá bài không hợp lệ.' },
          { status: 400 }
        );
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Chức năng giải bài AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.' },
        { status: 503 }
      );
    }

    const interpretation = await interpretTarotWithGemini(question, drawnCards);

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Error interpreting tarot:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi phân tích bài Tarot. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
