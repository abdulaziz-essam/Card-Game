import React from 'react';
import { GameSession } from '../components/GameSession';

interface PlaySessionScreenProps {
  onBack: () => void;
  onWin: () => void;
}

export default function PlaySessionScreen({ onBack, onWin }: PlaySessionScreenProps) {
  return <GameSession onBack={onBack} onWin={onWin} />;
}
