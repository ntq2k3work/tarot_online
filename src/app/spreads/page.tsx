'use client';

import { spreadTypes } from '@/data/tarot';
import Link from 'next/link';

export default function SpreadsPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow-gold text-gold mb-4">
            Hướng Dẫn Trải Bài
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Tìm hiểu các cách trải bài phổ biến và ý nghĩa của từng vị trí
          </p>
        </div>

        <div className="space-y-8">
          {spreadTypes.map((spread, index) => (
            <div key={spread.id} className="glass-card p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-2xl text-white font-display">{spread.cardCount}</span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-gold">{spread.nameVi}</h2>
                      <p className="text-foreground/60">{spread.name}</p>
                    </div>
                  </div>
                  <p className="text-foreground/70 mb-4">{spread.description}</p>
                  <Link
                    href={`/draw?spread=${spread.id}`}
                    className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
                  >
                    Thử ngay
                  </Link>
                </div>

                <div className="lg:w-2/3">
                  <h3 className="font-display text-lg text-primary-light mb-4">Ý nghĩa các vị trí</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {spread.positions.map((position, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 bg-background/30 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-display">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-gold text-sm font-display">{position.name}</h4>
                          <p className="text-xs text-foreground/60">{position.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-card p-8">
          <h2 className="font-display text-2xl text-gold mb-6 text-center">Lưu Ý Khi Trải Bài</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🧘</div>
              <h3 className="font-display text-gold mb-2">Tập trung</h3>
              <p className="text-sm text-foreground/60">Giữ tâm trí bình lặng và tập trung vào câu hỏi</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">❓</div>
              <h3 className="font-display text-gold mb-2">Câu hỏi rõ ràng</h3>
              <p className="text-sm text-foreground/60">Đặt câu hỏi cụ thể thay vì chung chung</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌙</div>
              <h3 className="font-display text-gold mb-2">Thời điểm</h3>
              <p className="text-sm text-foreground/60">Trải bài khi tâm trí thoải mái, không vội vã</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-display text-gold mb-2">Tin trực giác</h3>
              <p className="text-sm text-foreground/60">Lắng nghe cảm nhận đầu tiên về lá bài</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
