'use client';

import Link from 'next/link';
import TarotCardComponent from '@/components/TarotCard';
import { majorArcana, spreadTypes, tarotReaders } from '@/data/tarot';
import { useState, useEffect } from 'react';

export default function Home() {
  const [dailyCard] = useState(() => majorArcana[Math.floor(Math.random() * majorArcana.length)]);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="animate-float mb-8">
            <span className="text-8xl">🔮</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-glow-gold text-gold mb-6">
            Tarot Online
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Khám phá những bí ẩn của vũ trụ thông qua những lá bài Tarot cổ xưa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/draw"
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-display rounded-full hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 transform hover:scale-105"
            >
              Rút Bài Ngay
            </Link>
            <Link
              href="/cards"
              className="px-8 py-4 border-2 border-gold text-gold font-display rounded-full hover:bg-gold/10 transition-all duration-300"
            >
              Tra Cứu Lá Bài
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Daily Card Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-glow-purple text-primary-light mb-4">
            Lá Bài Hôm Nay
          </h2>
          <p className="text-foreground/60 mb-8">Nhấp vào lá bài để xem thông điệp của ngày</p>

          <div className="flex flex-col items-center">
            <div onClick={() => setIsFlipped(!isFlipped)} className="cursor-pointer group">
              <TarotCardComponent
                card={dailyCard}
                isFlipped={isFlipped}
                size="lg"
              />
            </div>
            {isFlipped && (
              <div className="mt-8 glass-card p-6 max-w-md animate-fadeIn">
                <h3 className="font-display text-xl text-gold mb-2">{dailyCard.nameVi}</h3>
                <p className="text-foreground/70">{dailyCard.upright}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {dailyCard.keywords.map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/20 rounded-full text-sm text-primary-light">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Spread Types Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center text-glow-purple text-primary-light mb-12">
            Các Cách Trải Bài
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spreadTypes.map((spread) => (
              <Link
                key={spread.id}
                href={`/draw?spread=${spread.id}`}
                className="glass-card p-6 group hover:border-gold/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xl text-white font-display">{spread.cardCount}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-gold group-hover:text-gold-light transition-colors">
                      {spread.nameVi}
                    </h3>
                    <p className="text-sm text-foreground/50">{spread.cardCount} lá bài</p>
                  </div>
                </div>
                <p className="text-foreground/60 text-sm">{spread.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tarot Readers Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center text-glow-purple text-primary-light mb-4">
            Tarot Readers
          </h2>
          <p className="text-center text-foreground/60 mb-12">
            Kết nối với những người xem bài chuyên nghiệp
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tarotReaders.map((reader) => (
              <div
                key={reader.id}
                className="glass-card-gold p-6 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-5xl mb-4">{reader.avatar}</div>
                <h3 className="font-display text-lg text-gold mb-1">{reader.nameVi}</h3>
                <p className="text-sm text-primary-light mb-2">{reader.specialty}</p>
                <p className="text-xs text-foreground/50 mb-4">{reader.experience}</p>
                <div className="flex items-center justify-center gap-1 text-gold">
                  <span>★</span>
                  <span>{reader.rating}</span>
                  <span className="text-foreground/40 text-xs">({reader.reviews} đánh giá)</span>
                </div>
                <div className={`mt-4 text-xs px-3 py-1 rounded-full inline-block ${reader.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {reader.available ? 'Đang online' : 'Offline'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/readers"
              className="text-primary-light hover:text-gold transition-colors"
            >
              Xem tất cả Tarot Readers →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center text-glow-purple text-primary-light mb-12">
            Tính Năng Nổi Bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <span className="text-2xl">🎴</span>
              </div>
              <h3 className="font-display text-lg text-gold mb-2">78 Lá Bài</h3>
              <p className="text-foreground/60 text-sm">
                Đầy đủ 78 lá bài Tarot với ý nghĩa chi tiết, cả xuôi và đảo ngược
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-display text-lg text-gold mb-2">Nhiều Cách Trải</h3>
              <p className="text-foreground/60 text-sm">
                Từ đơn giản đến phức tạp, phù hợp mọi nhu cầu giải mã
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="font-display text-lg text-gold mb-2">Lưu Lịch Sử</h3>
              <p className="text-foreground/60 text-sm">
                Lưu lại các lần đọc bài và xem lại bất cứ lúc nào
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
