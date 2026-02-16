'use client';

import { useState } from 'react';
import { allTarotCards, majorArcana, minorArcana } from '@/data/tarot';
import { TarotCard } from '@/types';

export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor'>('all');
  const [filterSuit, setFilterSuit] = useState<'all' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const suits = [
    { id: 'all', name: 'Tất cả', symbol: '✨' },
    { id: 'wands', name: 'Gậy', symbol: '🔥' },
    { id: 'cups', name: 'Cốc', symbol: '💧' },
    { id: 'swords', name: 'Kiếm', symbol: '⚔️' },
    { id: 'pentacles', name: 'Tiền', symbol: '💰' },
  ];

  const filteredCards = allTarotCards.filter(card => {
    const matchesSearch = card.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || card.type === filterType;
    
    const matchesSuit = filterSuit === 'all' || card.suit === filterSuit;
    
    return matchesSearch && matchesType && matchesSuit;
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow-gold text-gold mb-4">
            Tra Cứu Ý Nghĩa Lá Bài
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Tìm hiểu ý nghĩa chi tiết của 78 lá bài Tarot
          </p>
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên hoặc từ khóa..."
                  className="w-full bg-background/50 border border-primary/30 rounded-xl py-3 px-4 pl-10 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">🔍</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'all' ? 'bg-primary text-white' : 'bg-primary/20 text-primary-light'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterType('major')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'major' ? 'bg-primary text-white' : 'bg-primary/20 text-primary-light'
                }`}
              >
                Major
              </button>
              <button
                onClick={() => setFilterType('minor')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'minor' ? 'bg-primary text-white' : 'bg-primary/20 text-primary-light'
                }`}
              >
                Minor
              </button>
            </div>
          </div>

          {filterType === 'minor' && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {suits.map(suit => (
                <button
                  key={suit.id}
                  onClick={() => setFilterSuit(suit.id as typeof filterSuit)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                    filterSuit === suit.id ? 'bg-gold text-background' : 'bg-gold/20 text-gold'
                  }`}
                >
                  <span>{suit.symbol}</span>
                  <span>{suit.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4 text-foreground/60 text-sm">
          Tìm thấy {filteredCards.length} lá bài
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="glass-card p-3 text-center hover:border-gold/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-[2/3] relative mb-2 overflow-hidden rounded-lg">
                {card.image ? (
                  <img 
                    src={card.image} 
                    alt={card.nameVi}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    {card.symbol}
                  </div>
                )}
              </div>
              <h3 className="font-display text-sm text-gold group-hover:text-gold-light transition-colors line-clamp-1">
                {card.nameVi}
              </h3>
              <p className="text-xs text-foreground/50 mt-1">
                {card.type === 'major' ? 'Major Arcana' : card.suit}
              </p>
            </button>
          ))}
        </div>

        {selectedCard && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setSelectedCard(null)}>
            <div 
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedCard.image && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={selectedCard.image} 
                    alt={selectedCard.nameVi}
                    className="max-w-xs rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {!selectedCard.image && <span className="text-5xl">{selectedCard.symbol}</span>}
                  <div>
                    <h2 className="font-display text-2xl text-gold">{selectedCard.nameVi}</h2>
                    <p className="text-foreground/60">{selectedCard.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-foreground/60 hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedCard.type === 'major' ? 'bg-primary/20 text-primary-light' : 'bg-accent/20 text-accent-light'
                }`}>
                  {selectedCard.type === 'major' ? 'Major Arcana' : 'Minor Arcana'}
                </span>
                {selectedCard.suit && (
                  <span className="px-3 py-1 rounded-full text-sm bg-gold/20 text-gold">
                    {selectedCard.suit.charAt(0).toUpperCase() + selectedCard.suit.slice(1)}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-primary-light mb-2">Mô tả</h3>
                  <p className="text-foreground/70">{selectedCard.description}</p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-green-400 mb-2">Ý nghĩa xuôi</h3>
                  <p className="text-foreground/70">{selectedCard.upright}</p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-accent mb-2">Ý nghĩa đảo ngược</h3>
                  <p className="text-foreground/70">{selectedCard.reversed}</p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-2">Từ khóa</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCard.keywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/20 rounded-full text-sm text-primary-light">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
