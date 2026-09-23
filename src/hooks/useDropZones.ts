import { useRef } from 'react';
import { PlayingCard } from '../game/PlayingCard';

type DropZone = { x: number; y: number; w: number; h: number };

export function useDropZones(onCardPlayed: (card: PlayingCard, locationIndex: number) => void) {
  const dropZones = useRef<Record<number, DropZone>>({});

  const registerDropZone = (index: number, x: number, y: number, w: number, h: number) => {
    dropZones.current[index] = { x, y, w, h };
  };

  const resolveDropTarget = (card: PlayingCard, x: number, y: number): boolean => {
    for (const [idxStr, zone] of Object.entries(dropZones.current)) {
      if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
        onCardPlayed(card, Number(idxStr));
        return true;
      }
    }
    return false;
  };

  return { registerDropZone, resolveDropTarget };
}
