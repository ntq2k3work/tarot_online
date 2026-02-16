import { NextRequest, NextResponse } from 'next/server';
import { interpretTarotWithGemini } from '@/utils/gemini';
import { DrawnCard } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, drawnCards } = body as {
      question: string;
      drawnCards: DrawnCard[];
    };

    if (!drawnCards || !Array.isArray(drawnCards) || drawnCards.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng rút bài trước khi yêu cầu giải đáp' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Chưa cấu hình API key cho Gemini. Vui lòng thêm GEMINI_API_KEY vào file .env.local' },
        { status: 500 }
      );
    }

    const interpretation = await interpretTarotWithGemini(question, drawnCards);

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Error interpreting tarot:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi phân tích bài Tarot. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
