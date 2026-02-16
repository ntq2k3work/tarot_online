import { TarotCard, spreadTypes } from '@/data/tarot';

export type { TarotCard };

export type SpreadType = typeof spreadTypes[number];

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: {
    name: string;
    description: string;
  };
}

export interface Reading {
  id: string;
  date: string;
  spreadType: string;
  question?: string;
  cards: DrawnCard[];
  interpretation?: string;
}

export interface Reader {
  id: number;
  name: string;
  nameVi: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  bio: string;
  avatar: string;
  available: boolean;
}
