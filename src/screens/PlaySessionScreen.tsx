import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../game/gameStore';
import { PlayingCard } from '../game/PlayingCard';
import PlayingCardWidget from '../components/PlayingCardWidget';
import LocationWidget from '../components/LocationWidget';
import { palette } from '../style/palette';
import { playSfx } from '../audio/audioController';
import { useDropZones } from '../hooks/useDropZones';
import { useWinWatcher } from '../hooks/useWinWatcher';

// ─── Sub-components ──────────────────────────────────────────────────────────

function AiHandIndicator({ cardCount }: { cardCount: number }) {
  return (
    <View style={styles.aiBar}>
      <Text style={styles.aiBarText}>🤖  AI Hand: {cardCount} cards</Text>
    </View>
  );
}

interface TurnBadgeProps {
  isPlayerTurn: boolean;
  gameOver: boolean;
  playerWon: boolean;
}

function TurnBadge({ isPlayerTurn, gameOver, playerWon }: TurnBadgeProps) {
  const badgeColor = isPlayerTurn ? '#3366FF' : '#CC2200';
  let label: string;
  if (gameOver) {
    label = playerWon ? '🎉 YOU WIN!' : '💀 AI WINS';
  } else {
    label = isPlayerTurn ? 'YOUR TURN!' : 'AI THINKING...';
  }

  return (
    <View style={[styles.turnBadge, { backgroundColor: badgeColor }]}>
      <Text style={styles.turnBadgeText}>{label}</Text>
    </View>
  );
}

interface LocationRowProps {
  isDragging: boolean;
  onRegisterDropZone: (index: number, x: number, y: number, w: number, h: number) => void;
}

function LocationRow({ isDragging, onRegisterDropZone }: LocationRowProps) {
  const { locations, isPlayerTurn, playPlayerCard } = useGameStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.locationsRow}
      scrollEnabled={!isDragging}
    >
      {locations.map((loc, i) => (
        <View key={loc.name} style={i < locations.length - 1 ? { marginRight: 10 } : {}}>
          <LocationWidget
            location={loc}
            locationIndex={i}
            isPlayerTurn={isPlayerTurn}
            onCardDropped={playPlayerCard}
            onLayout={onRegisterDropZone}
          />
        </View>
      ))}
    </ScrollView>
  );
}

interface PlayerHandProps {
  cards: PlayingCard[];
  canDrag: boolean;
  onDragEnd: (card: PlayingCard, x: number, y: number) => void;
}

function PlayerHand({ cards, canDrag, onDragEnd }: PlayerHandProps) {
  return (
    <View style={styles.handContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.handScroll}
      >
        {cards.map((card) => (
          <View key={card.id} style={styles.cardWrapper}>
            <PlayingCardWidget
              card={card}
              draggable={canDrag}
              onDragEnd={onDragEnd}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

interface BackButtonProps {
  onPress: () => void;
}

function BackButton({ onPress }: BackButtonProps) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.backButtonText}>← BACK</Text>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface PlaySessionScreenProps {
  onBack: () => void;
  onWin: () => void;
}

export default function PlaySessionScreen({ onBack, onWin }: PlaySessionScreenProps) {
  const { playerHand, aiHand, isPlayerTurn, gameOver, playerWon, playPlayerCard } =
    useGameStore();

  const [isDragging, setIsDragging] = useState(false);

  useWinWatcher(gameOver, playerWon, onWin);

  const { registerDropZone, resolveDropTarget } = useDropZones(playPlayerCard);

  const handleDragEnd = (card: PlayingCard, x: number, y: number) => {
    playSfx('wssh');
    const hit = resolveDropTarget(card, x, y);
    if (hit) playSfx('buttonTap');
    setIsDragging(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AiHandIndicator cardCount={aiHand.length} />

      <LocationRow
        isDragging={isDragging}
        onRegisterDropZone={registerDropZone}
      />

      <TurnBadge
        isPlayerTurn={isPlayerTurn}
        gameOver={gameOver}
        playerWon={playerWon}
      />

      <PlayerHand
        cards={playerHand}
        canDrag={isPlayerTurn && !gameOver}
        onDragEnd={handleDragEnd}
      />

      <BackButton onPress={onBack} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.backgroundPlaySession,
    alignItems: 'center',
  },
  aiBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  aiBarText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 18,
    color: '#CC2200',
  },
  locationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  turnBadge: {
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  turnBadgeText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  handContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  handScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardWrapper: {
    marginHorizontal: 5,
  },
  backButton: {
    marginBottom: 10,
    paddingHorizontal: 28,
    paddingVertical: 10,
    backgroundColor: palette.darkPen,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  backButtonText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
  },
});
