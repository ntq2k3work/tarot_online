import { Metadata } from 'next';
import CardsPage from './page';

export const metadata: Metadata = {
  title: 'Tra Cứu Ý Nghĩa 78 Lá Bài Tarot',
  description: 'Tìm hiểu ý nghĩa chi tiết của 78 lá bài Tarot. Tra cứu Major Arcana và Minor Arcana với ý nghĩa xuôi và đảo ngược.',
  keywords: ['ý nghĩa lá bài tarot', 'tra cứu tarot', '78 lá bài tarot', 'major arcana', 'minor arcana'],
  openGraph: {
    title: 'Tra Cứu Ý Nghĩa 78 Lá Bài Tarot',
    description: 'Tìm hiểu ý nghĩa chi tiết của 78 lá bài Tarot với ý nghĩa xuôi và đảo ngược.',
  },
};

export default function CardsPageWithMetadata() {
  return <CardsPage />;
}
