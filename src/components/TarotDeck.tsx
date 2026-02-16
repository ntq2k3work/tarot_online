'use client';

import TarotCardComponent from './TarotCard';
import { TarotCard } from '@/data/tarot';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: {
    name: string;
    description: string;
  };
}

interface TarotDeckProps {
  drawnCards: DrawnCard[];
  flippedCards: Set<number>;
  onFlip: (index: number) => void;
}

export default function TarotDeck({ drawnCards, flippedCards, onFlip }: TarotDeckProps) {
  if (drawnCards.length === 0) return null;

  const gridCols = drawnCards.length <= 3 ? drawnCards.length : drawnCards.length <= 5 ? 3 : 5;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`grid gap-6 justify-items-center`}
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {drawnCards.map((drawnCard, index) => (
          <div key={index} className="flex flex-col items-center group">
            <div className="mb-3 text-center">
              <h4 className="font-display text-gold text-sm">{drawnCard.position.name}</h4>
              <p className="text-xs text-foreground/50">{drawnCard.position.description}</p>
            </div>
            <TarotCardComponent
              card={drawnCard.card}
              isReversed={drawnCard.isReversed}
              isFlipped={flippedCards.has(index)}
              onFlip={() => onFlip(index)}
              size={drawnCards.length <= 3 ? 'lg' : drawnCards.length <= 5 ? 'md' : 'sm'}
              showDetails
            />
            {flippedCards.has(index) && (
              <div className="mt-4 max-w-xs text-center glass-card p-4 animate-fadeIn">
                <h5 className="font-display text-primary-light mb-2">
                  {drawnCard.card.nameVi}
                  {drawnCard.isReversed && <span className="text-accent ml-2">(Đảo)</span>}
                </h5>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {drawnCard.isReversed ? drawnCard.card.reversed : drawnCard.card.upright}
                </p>
                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                  {drawnCard.card.keywords.map((keyword, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-primary/20 rounded-full text-primary-light">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

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
