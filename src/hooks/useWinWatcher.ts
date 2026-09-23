import { useEffect } from 'react';
import { playSfx } from '../audio/audioController';

export function useWinWatcher(gameOver: boolean, playerWon: boolean, onWin: () => void) {
  useEffect(() => {
    if (gameOver && playerWon) {
      playSfx('congrats');
      const timer = setTimeout(() => onWin(), 800);
      return () => clearTimeout(timer);
    }
  }, [gameOver, playerWon]);
}
