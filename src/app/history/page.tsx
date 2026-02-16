'use client';

import { useState, useEffect } from 'react';
import { Reading } from '@/types';
import { spreadTypes } from '@/data/tarot';
import Link from 'next/link';

export default function HistoryPage() {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
    setReadings(saved);
  }, []);

  const deleteReading = (id: string) => {
    const filtered = readings.filter(r => r.id !== id);
    setReadings(filtered);
    localStorage.setItem('tarotReadings', JSON.stringify(filtered));
  };

  const clearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả lịch sử?')) {
      setReadings([]);
      localStorage.removeItem('tarotReadings');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSpreadName = (spreadId: string) => {
    const spread = spreadTypes.find(s => s.id === spreadId);
    return spread?.nameVi || spreadId;
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow-gold text-gold mb-4">
            Lịch Sử Đọc Bài
          </h1>
          <p className="text-foreground/60">
            Xem lại những lần đọc bài trước đây
          </p>
        </div>

        {readings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="font-display text-xl text-gold mb-2">Chưa có lịch sử</h2>
            <p className="text-foreground/60 mb-6">
              Bạn chưa có lần đọc bài nào được lưu. Hãy thử rút bài ngay!
            </p>
            <Link
              href="/draw"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
            >
              Rút bài ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <span className="text-foreground/60">{readings.length} lần đọc bài</span>
              <button
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="space-y-4">
              {readings.map((reading) => (
                <div key={reading.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg text-gold">
                        {getSpreadName(reading.spreadType)}
                      </h3>
                      <p className="text-sm text-foreground/50">{formatDate(reading.date)}</p>
                    </div>
                    <button
                      onClick={() => deleteReading(reading.id)}
                      className="text-foreground/40 hover:text-red-400 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>

                  {reading.question && (
                    <div className="mb-4 p-3 bg-background/30 rounded-lg">
                      <p className="text-sm text-foreground/60">Câu hỏi:</p>
                      <p className="text-gold">{reading.question}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {reading.cards.map((drawn, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg"
                      >
                        <span>{drawn.card.symbol}</span>
                        <span className="text-sm text-primary-light">
                          {drawn.card.nameVi}
                        </span>
                        {drawn.isReversed && (
                          <span className="text-xs text-accent">(Đảo)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
