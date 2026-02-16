'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TarotDeck from '@/components/TarotDeck';
import { allTarotCards, spreadTypes } from '@/data/tarot';
import { DrawnCard, Reading } from '@/types';

function DrawContent() {
  const searchParams = useSearchParams();
  const initialSpread = searchParams.get('spread') || 'single';

  const [selectedSpread, setSelectedSpread] = useState(initialSpread);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentSpread = spreadTypes.find(s => s.id === selectedSpread) || spreadTypes[0];

  const drawCards = () => {
    setIsDrawing(true);
    setFlippedCards(new Set());

    const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, currentSpread.cardCount);

    const drawn: DrawnCard[] = selected.map((card, index) => ({
      card,
      isReversed: Math.random() > 0.7,
      position: currentSpread.positions[index]
    }));

    setTimeout(() => {
      setDrawnCards(drawn);
      setIsDrawing(false);
    }, 1000);
  };

  const flipCard = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const flipAllCards = () => {
    if (flippedCards.size === drawnCards.length) {
      setFlippedCards(new Set());
    } else {
      setFlippedCards(new Set(drawnCards.map((_, i) => i)));
    }
  };

  const saveReading = () => {
    const reading: Reading = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      spreadType: selectedSpread,
      question: question || undefined,
      cards: drawnCards
    };

    const saved = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
    saved.unshift(reading);
    localStorage.setItem('tarotReadings', JSON.stringify(saved.slice(0, 50)));

    alert('Đã lưu vào lịch sử!');
  };

  const resetReading = () => {
    setDrawnCards([]);
    setFlippedCards(new Set());
    setQuestion('');
    setAiInterpretation('');
  };

  const getAiInterpretation = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/tarot-interpretation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, drawnCards })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setAiInterpretation(data.interpretation);
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi phân tích. Vui lòng thử lại.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const allFlipped = flippedCards.size === drawnCards.length && drawnCards.length > 0;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow-gold text-gold mb-4">
            Rút Bài Tarot
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Chọn cách trải bài, tập trung vào câu hỏi của bạn và để vũ trụ dẫn lối
          </p>
        </div>

        {drawnCards.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 mb-8">
              <h2 className="font-display text-xl text-gold mb-6">Chọn Cách Trải Bài</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {spreadTypes.map((spread) => (
                  <button
                    key={spread.id}
                    onClick={() => setSelectedSpread(spread.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedSpread === spread.id
                        ? 'border-gold bg-gold/10'
                        : 'border-primary/30 hover:border-primary/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-display">
                        {spread.cardCount}
                      </span>
                      <span className="font-display text-gold">{spread.nameVi}</span>
                    </div>
                    <p className="text-xs text-foreground/60">{spread.description}</p>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm text-foreground/60 mb-2">
                  Câu hỏi của bạn (tùy chọn)
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi bạn muốn tìm hiểu..."
                  className="w-full bg-background/50 border border-primary/30 rounded-xl p-4 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={drawCards}
                disabled={isDrawing}
                className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-display rounded-xl hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDrawing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang rút bài...
                  </span>
                ) : (
                  '🔮 Rút Bài'
                )}
              </button>
            </div>

            <div className="text-center text-foreground/40 text-sm">
              <p>Hãy tập trung vào câu hỏi của bạn trước khi rút bài</p>
              <p className="mt-1">Những lá bài sẽ mang đến thông điệp từ vũ trụ</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={flipAllCards}
                className="px-6 py-2 border border-gold text-gold rounded-full hover:bg-gold/10 transition-colors"
              >
                {allFlipped ? 'Lật lại tất cả' : 'Lật tất cả lá bài'}
              </button>
              <button
                onClick={getAiInterpretation}
                disabled={isAiLoading || !allFlipped}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAiLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang phân tích...
                  </span>
                ) : (
                  '✨ Phân tích với AI'
                )}
              </button>
              <button
                onClick={saveReading}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-light transition-colors"
              >
                💾 Lưu vào lịch sử
              </button>
              <button
                onClick={resetReading}
                className="px-6 py-2 border border-accent text-accent rounded-full hover:bg-accent/10 transition-colors"
              >
                🔄 Rút lại
              </button>
            </div>

            {question && (
              <div className="text-center mb-8 glass-card p-4 max-w-2xl mx-auto">
                <p className="text-sm text-foreground/60">Câu hỏi của bạn:</p>
                <p className="text-gold font-display">{question}</p>
              </div>
            )}

            <TarotDeck
              drawnCards={drawnCards}
              flippedCards={flippedCards}
              onFlip={flipCard}
            />

            {allFlipped && (
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="glass-card p-8 animate-fadeIn">
                  <h3 className="font-display text-2xl text-gold mb-6 text-center">
                    📜 Tổng Hợp Thông Điệp
                  </h3>
                  
                  <div className="space-y-4">
                    {drawnCards.map((drawn, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="text-2xl">{drawn.card.symbol}</span>
                          <p className="text-xs text-gold mt-1">{drawn.position.name}</p>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display text-primary-light">
                            {drawn.card.nameVi}
                            {drawn.isReversed && <span className="text-accent ml-2">(Đảo ngược)</span>}
                          </h4>
                          <p className="text-sm text-foreground/70 mt-1">
                            {drawn.isReversed ? drawn.card.reversed : drawn.card.upright}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-primary/20 text-center">
                    <p className="text-foreground/60 text-sm italic">
                      "Hãy lắng nghe trực giác của bạn và tin vào sự dẫn dắt của vũ trụ"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {aiInterpretation && (
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="glass-card p-8 animate-fadeIn border-2 border-purple-500/30">
                  <h3 className="font-display text-2xl text-purple-400 mb-6 text-center">
                    ✨ Phân Tích Từ Vũ Trụ (AI)
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                      {aiInterpretation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen py-12 px-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">🔮</div>
        <p className="text-foreground/60">Đang tải...</p>
      </div>
    </div>
  );
}

export default function DrawPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DrawContent />
    </Suspense>
  );
}
