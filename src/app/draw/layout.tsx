import { Metadata } from 'next';
import DrawPage from './page';

export const metadata: Metadata = {
  title: 'Rút Bài Tarot - Trải Bài Tarot Trực Tuyến',
  description: 'Rút bài Tarot trực tuyến miễn phí. Chọn cách trải bài phù hợp và nhận thông điệp từ vũ trụ. Hỗ trợ AI phân tích chi tiết.',
  keywords: ['rút bài tarot', 'trải bài tarot', 'tarot reading', 'xem bài tarot online', 'tir quyết'],
  openGraph: {
    title: 'Rút Bài Tarot - Trải Bài Tarot Trực Tuyến',
    description: 'Rút bài Tarot trực tuyến miễn phí. Nhận thông điệp từ vũ trụ với AI phân tích chi tiết.',
  },
};

export default function DrawPageWithMetadata() {
  return <DrawPage />;
}
