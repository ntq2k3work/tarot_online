import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-primary/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🔮</span>
              <span className="font-display text-xl text-gold">Tarot Online</span>
            </Link>
            <p className="text-foreground/60 max-w-md">
              Khám phá những bí ẩn của Tarot và tìm hiểu vận mệnh của bạn thông qua những lá bài cổ xưa.
            </p>
          </div>

          <div>
            <h3 className="font-display text-gold mb-4">Tính năng</h3>
            <ul className="space-y-2">
              <li><Link href="/draw" className="text-foreground/60 hover:text-gold transition-colors">Rút bài Tarot</Link></li>
              <li><Link href="/cards" className="text-foreground/60 hover:text-gold transition-colors">Tra cứu ý nghĩa</Link></li>
              <li><Link href="/spreads" className="text-foreground/60 hover:text-gold transition-colors">Hướng dẫn trải bài</Link></li>
              <li><Link href="/history" className="text-foreground/60 hover:text-gold transition-colors">Lịch sử đọc bài</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-gold mb-4">Khác</h3>
            <ul className="space-y-2">
              <li><Link href="/readers" className="text-foreground/60 hover:text-gold transition-colors">Tarot Readers</Link></li>
              <li><Link href="/feedback" className="text-foreground/60 hover:text-gold transition-colors">Đánh giá</Link></li>
              <li><Link href="/about" className="text-foreground/60 hover:text-gold transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 text-center text-foreground/40">
          <p>© {new Date().getFullYear()} Tarot Online. Mọi quyền được bảo lưu.</p>
          <p className="mt-2 text-sm">Xem bài chỉ mang tính chất giải trí và tham khảo.</p>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/5 to-transparent" />
    </footer>
  );
}
