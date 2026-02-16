'use client';

import { TarotCard as TarotCardType } from '@/data/tarot';
import { useState } from 'react';

interface TarotCardProps {
  card: TarotCardType;
  isReversed?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TarotCard({
  card,
  isReversed = false,
  isFlipped = false,
  onFlip,
  showDetails = false,
  size = 'md'
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-32 h-48', 
    lg: 'w-48 h-72'
  };

  const fontSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div
      className={`tarot-card ${isFlipped ? 'flipped' : ''} ${sizeClasses[size]}`}
      onClick={onFlip}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="tarot-card-inner">
        <div className="tarot-card-front flex flex-col items-center justify-center p-2">
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          <span className="text-4xl mb-2">✧</span>
          <span className={`font-display text-gold ${fontSizeClasses[size]} text-center`}>
            Tarot
          </span>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <span className="text-gold/60 text-xs">✦ ✦ ✦</span>
          </div>
        </div>

        <div className={`tarot-card-back flex flex-col items-center justify-center p-3 ${isHovered && !isFlipped ? 'animate-pulse-glow' : ''}`}>
          {card.image ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={card.image} 
                alt={card.nameVi}
                className={`max-w-full max-h-full object-contain ${isReversed ? 'rotate-180' : ''}`}
                style={{ borderRadius: '8px' }}
              />
            </div>
          ) : (
            <>
              <span className={`text-3xl mb-2 ${isReversed ? 'rotate-180' : ''}`}>
                {card.symbol}
              </span>
              <span className={`font-display text-primary-light text-center ${fontSizeClasses[size]} leading-tight`}>
                {card.nameVi}
              </span>
              {isReversed && (
                <span className="text-accent text-xs mt-1">(Đảo ngược)</span>
              )}
            </>
          )}
          {showDetails && !card.image && (
            <div className="mt-2 text-center">
              <span className="text-xs text-foreground/60">
                {card.keywords.slice(0, 2).join(' • ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {isFlipped && showDetails && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full w-48 p-3 glass-card-gold opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <p className="text-xs text-center">{isReversed ? card.reversed : card.upright}</p>
        </div>
      )}
    </div>
  );
}
