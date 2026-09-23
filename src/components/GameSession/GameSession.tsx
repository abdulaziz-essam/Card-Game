import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useGameStore } from '../../game/gameStore';
import { PlayingCard } from '../../game/PlayingCard';
import { FootballPitchScene } from '../FootballPitchScene';
import { playSfx } from '../../audio/audioController';
import { useWinWatcher } from '../../hooks/useWinWatcher';
import { AiHandIndicator } from './AiHandIndicator';
import { TurnBadge } from './TurnBadge';
import { ZoneSelector } from './ZoneSelector';
import { PlayerHand } from './PlayerHand';
import { BackButton } from './BackButton';

interface GameSessionProps {
  onBack: () => void;
  onWin: () => void;
}

export function GameSession({ onBack, onWin }: GameSessionProps) {
  const {
    playerHand,
    aiHand,
    locations,
    isPlayerTurn,
    gameOver,
    playerWon,
    playPlayerCard,
  } = useGameStore();

  const [selectedCard, setSelectedCard] = useState<PlayingCard | null>(null);

  useWinWatcher(gameOver, playerWon, onWin);

  const handleSelectCard = (card: PlayingCard) => {
    playSfx('buttonTap');
    setSelectedCard(card);
  };

  const handleZoneSelect = (zoneIndex: number) => {
    if (!selectedCard) return;
    playSfx('wssh');
    playPlayerCard(selectedCard, zoneIndex);
    setSelectedCard(null);
  };

  const handleCancel = () => setSelectedCard(null);

  const showZoneSelector = !!selectedCard && isPlayerTurn && !gameOver;

  return (
    <SafeAreaView style={styles.container}>
      <AiHandIndicator cardCount={aiHand.length} />

      <FootballPitchScene locations={locations} cameraPhase="field" />

      <TurnBadge
        isPlayerTurn={isPlayerTurn}
        gameOver={gameOver}
        playerWon={playerWon}
      />

      {showZoneSelector ? (
        <ZoneSelector onSelect={handleZoneSelect} onCancel={handleCancel} />
      ) : (
        <PlayerHand
          cards={playerHand}
          canPlay={isPlayerTurn && !gameOver}
          selectedCardId={selectedCard?.id ?? null}
          onSelectCard={handleSelectCard}
        />
      )}

      <BackButton onPress={onBack} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c2833',
    alignItems: 'center',
  },
});
