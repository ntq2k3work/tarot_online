import { Metadata } from 'next';
import ReadersPage from './page';

export const metadata: Metadata = {
  title: 'Tarot Readers - Kết Nối Với Chuyên Gia Tarot',
  description: 'Kết nối với các Tarot readers chuyên nghiệp. Tìm người xem bài phù hợp với nhu cầu: tình yêu, sự nghiệp, tâm linh.',
  keywords: ['tarot reader', 'người xem bài tarot', 'tư vấn tarot', 'tarot chuyên nghiệp'],
  openGraph: {
    title: 'Tarot Readers - Kết Nối Với Chuyên Gia Tarot',
    description: 'Kết nối với các Tarot readers chuyên nghiệp để được tư vấn chi tiết.',
  },
};

export default function ReadersPageWithMetadata() {
  return <ReadersPage />;
}
