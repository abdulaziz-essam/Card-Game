import { PlayingCard } from './PlayingCard';

export type Difficulty = 'easy' | 'medium' | 'hard';

export function decideCard(hand: PlayingCard[], difficulty: Difficulty): PlayingCard | null {
  if (hand.length === 0) return null;

  if (difficulty === 'easy') {
    return hand[Math.floor(Math.random() * hand.length)];
  }

  if (difficulty === 'medium') {
    return Math.random() > 0.5
      ? [...hand].sort((a, b) => b.power - a.power)[0]
      : hand[Math.floor(Math.random() * hand.length)];
  }

  return [...hand].sort((a, b) => b.power - a.power)[0];
}

// maxPerLoc lets AI respect per-zone caps (GK=1, DEF=4, etc.)
export function decideTarget(
  aiCardsPerLocation: number[],
  difficulty: Difficulty,
  maxPerLoc?: number[],
): number {
  const numZones = aiCardsPerLocation.length;

  // Filter out full zones
  const available = aiCardsPerLocation
    .map((count, i) => ({ i, count, max: maxPerLoc ? maxPerLoc[i] : 99 }))
    .filter(z => z.count < z.max);

  if (available.length === 0) return 0;

  if (difficulty === 'easy') {
    return available[Math.floor(Math.random() * available.length)].i;
  }

  // medium/hard: prefer zones with fewest AI cards (relative to their max)
  available.sort((a, b) => (a.count / a.max) - (b.count / b.max));
  return available[0].i;
}
