# AGENTS.md - Tarot Online Development Guide

## Project Overview
- **Project name**: Tarot Online
- **Type**: Next.js 16 React Application with TypeScript
- **Core functionality**: Tarot card reading website with AI-powered interpretation using Gemini 2.5
- **Target users**: Vietnamese users interested in tarot readings

## Build Commands
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run start   # Start production server
```

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini 2.5 (via @google/generative-ai)
- **Runtime**: React 19.2.3

## Code Style Guidelines

### File Organization
- Components: `src/components/`
- Data: `src/data/`
- Types: `src/types/`
- Utils: `src/utils/`
- API Routes: `src/app/api/`

### Naming Conventions
- **Files**: kebab-case (e.g., `tarot-card.tsx`)
- **Components**: PascalCase (e.g., `TarotCard.tsx`)
- **Interfaces**: PascalCase with type suffix (e.g., `TarotCard`)
- **Constants**: UPPER_SNAKE_CASE

### Imports
```typescript
// Relative imports for local modules
import TarotCard from '@/components/TarotCard';
import { allTarotCards } from '@/data/tarot';

// Absolute imports for packages
import { useState, useEffect } from 'react';
```

### TypeScript
- Always define return types for functions
- Use interfaces for object shapes
- Enable strict mode in tsconfig

### React Patterns
- Use 'use client' directive for client components
- Use Suspense for data fetching
- Keep components small and focused

### CSS/Tailwind
- Use Tailwind utility classes
- Custom theme colors defined in `globals.css`
- Dark mode enabled by default (class="dark" on html)

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── draw/         # Card drawing page
│   ├── cards/        # Card lookup page
│   ├── spreads/      # Spread guide page
│   ├── readers/      # Tarot readers page
│   ├── history/      # Reading history
│   ├── feedback/     # Feedback page
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/        # Reusable components
├── data/            # Tarot card data
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Data Structure

### TarotCard Interface
```typescript
interface TarotCard {
  id: number;
  name: string;
  nameVi: string;
  type: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  upright: string;
  reversed: string;
  description: string;
  symbol: string;
  image?: string;  // URL to card image
}
```

## API Routes

### POST /api/tarot-interpretation
Request body:
```json
{
  "question": "string",
  "drawnCards": [{ "card": {...}, "isReversed": boolean, "position": {...} }]
}
```

Response:
```json
{
  "interpretation": "string"
}
```

Requires `GEMINI_API_KEY` in `.env.local`

## Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key
```

## Key Features
1. **Card Drawing**: Random tarot card selection with flip animation
2. **AI Interpretation**: Gemini 2.5 powered card analysis
3. **Card Lookup**: Search and filter 78 tarot cards
4. **Spread Guide**: Various tarot spreads explained
5. **History**: LocalStorage-based reading history
6. **SEO**: Optimized with metadata, sitemap, robots.txt

## SEO Configuration
- Metadata in `src/app/layout.tsx`
- Per-page metadata in layout files
- Sitemap: `public/sitemap.xml`
- Robots: `public/robots.txt`

## Error Handling
- API routes return proper error responses with status codes
- Client components handle loading and error states
- Form validation for user inputs
