import { Metadata } from 'next';
import SpreadsPage from './page';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Các Cách Trải Bài Tarot',
  description: 'Tìm hiểu các cách trải bài Tarot phổ biến: 1 lá, 3 lá, Celtic Cross, Trải Tình Yêu, Trải Sự Nghiệp. Ý nghĩa từng vị trí.',
  keywords: ['cách trải bài tarot', 'trải bài tarot', 'celtic cross', 'tarot spread', 'trải tình yêu', 'trải sự nghiệp'],
  openGraph: {
    title: 'Hướng Dẫn Các Cách Trải Bài Tarot',
    description: 'Tìm hiểu các cách trải bài Tarot phổ biến và ý nghĩa từng vị trí.',
  },
};

export default function SpreadsPageWithMetadata() {
  return <SpreadsPage />;
}
