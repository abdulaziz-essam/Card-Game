import { PlayingCard } from './PlayingCard';

export type Difficulty = 'easy' | 'medium' | 'hard';

export function decideCard(
  hand: PlayingCard[],
  difficulty: Difficulty,
): PlayingCard | null {
  if (hand.length === 0) return null;

  if (difficulty === 'easy') {
    return hand[Math.floor(Math.random() * hand.length)];
  }

  if (difficulty === 'medium') {
    return Math.random() > 0.5
      ? [...hand].sort((a, b) => b.power - a.power)[0]
      : hand[Math.floor(Math.random() * hand.length)];
  }

  // hard
  return [...hand].sort((a, b) => b.power - a.power)[0];
}

export function decideTarget(
  aiCardsPerLocation: number[],
  difficulty: Difficulty,
): number {
  if (difficulty === 'easy') {
    return Math.floor(Math.random() * 3);
  }

  // medium / hard: balance cards across locations, prefer locations with fewer AI cards
  let minIdx = 0;
  for (let i = 1; i < aiCardsPerLocation.length; i++) {
    if (aiCardsPerLocation[i] < aiCardsPerLocation[minIdx]) {
      minIdx = i;
    }
  }
  return minIdx;
}
