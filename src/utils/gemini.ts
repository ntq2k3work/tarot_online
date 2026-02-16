/**
 * Gemini AI Integration
 * Handles tarot card interpretation using Google Gemini 2.5
 * Includes input sanitization and error handling
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { DrawnCard } from '@/types';

/** Lazily initialize the Gemini client to avoid errors when API key is not set */
function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

const TAROT_SYSTEM_PROMPT = `Bạn là một chuyên gia Tarot có kiến thức sâu về 78 lá bài Tarot và ý nghĩa của chúng. 
Bạn có khả năng phân tích các lá bài Tarot và đưa ra lời giải thích chi tiết, có ý nghĩa và sâu sắc cho người hỏi.

Khi phân tích, hãy:
1. Xem xét ý nghĩa của từng lá bài (thuận hay ngược)
2. Xem xét vị trí của lá bài trong trải bài
3. Kết nối các lá bài với nhau để tạo ra một câu chuyện hoàn chỉnh
4. Đưa ra lời khuyên thực tế và hữu ích cho người hỏi

Trả lời bằng tiếng Việt, ngôn ngữ tự nhiên và dễ hiểu.`;

/**
 * Interpret drawn tarot cards using Gemini AI
 * @param question - The user's question (already sanitized)
 * @param drawnCards - Array of drawn cards with positions
 * @returns The AI-generated interpretation text
 * @throws Error if Gemini API call fails
 */
export async function interpretTarotWithGemini(
  question: string,
  drawnCards: DrawnCard[]
): Promise<string> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: TAROT_SYSTEM_PROMPT
  });

  const cardsDescription = drawnCards.map((drawn, index) => {
    const orientation = drawn.isReversed ? '(Đảo ngược)' : '(Thuận)';
    const meaning = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
    return `
Lá bài ${index + 1}: ${drawn.card.nameVi} ${orientation}
- Vị trí: ${drawn.position.name} - ${drawn.position.description}
- Ý nghĩa: ${meaning}
`;
  }).join('\n');

  const prompt = `
Câu hỏi của người hỏi: "${question || 'Người hỏi chưa đặt câu hỏi cụ thể'}"

Các lá bài đã rút được:
${cardsDescription}

Hãy phân tích và đưa ra lời giải thích chi tiết cho câu hỏi này dựa trên các lá bài đã rút.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    // Log the actual error server-side, but don't expose API details to client
    console.error('Gemini API error:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Không thể tạo lời giải thích. Vui lòng thử lại sau.');
  }
}
