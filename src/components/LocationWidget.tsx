import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LocationState } from '../game/gameStore';
import { PlayingCard } from '../game/PlayingCard';
import PlayingCardWidget, { CARD_WIDTH, CARD_HEIGHT } from './PlayingCardWidget';
import { palette } from '../style/palette';
import { playSfx } from '../audio/audioController';

interface Props {
  location: LocationState;
  locationIndex: number;
  isPlayerTurn: boolean;
  onCardDropped: (card: PlayingCard, locationIndex: number) => void;
  // Used by parent to register drop zone bounds
  onLayout?: (index: number, x: number, y: number, w: number, h: number) => void;
}

export default function LocationWidget({
  location,
  locationIndex,
  isPlayerTurn,
  onCardDropped,
  onLayout,
}: Props) {
  const [highlighted, setHighlighted] = useState(false);
  const containerRef = useRef<View>(null);

  const playerPower = location.playerCards.reduce((s, c) => s + c.power, 0);
  const aiPower = location.aiCards.reduce((s, c) => s + c.power, 0);

  return (
    <View
      ref={containerRef}
      style={styles.panel}
      onLayout={() => {
        containerRef.current?.measureInWindow((x, y, w, h) => {
          onLayout?.(locationIndex, x, y, w, h);
        });
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{location.name}</Text>
      </View>

      {/* AI side */}
      <View style={styles.aiSide}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
          {location.aiCards.length === 0 ? (
            <Text style={styles.placeholderText}>AI Side</Text>
          ) : (
            location.aiCards.map((card) => (
              <View key={card.id} style={styles.smallCard}>
                <PlayingCardWidget card={card} />
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Power indicator */}
      <View style={styles.powerRow}>
        <PowerBadge label="AI" power={aiPower} color="#FF3333" />
        <Text style={styles.vsText}>VS</Text>
        <PowerBadge label="YOU" power={playerPower} color="#3366FF" />
      </View>

      {/* Player side (drop zone) */}
      <View
        style={[
          styles.playerSide,
          highlighted && styles.playerSideHighlighted,
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
          {location.playerCards.length === 0 ? (
            <Text style={[styles.placeholderText, highlighted && { color: '#00cc44' }]}>
              {highlighted ? 'Drop Here!' : 'Your Side'}
            </Text>
          ) : (
            location.playerCards.map((card) => (
              <View key={card.id} style={styles.smallCard}>
                <PlayingCardWidget card={card} />
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function PowerBadge({ label, power, color }: { label: string; power: number; color: string }) {
  return (
    <View style={styles.powerBadgeCol}>
      <Text style={[styles.powerLabel, { color }]}>{label}</Text>
      <View style={[styles.powerBadge, { backgroundColor: color }]}>
        <Text style={styles.powerText}>{power}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: 150,
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: palette.backgroundPlaySession,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
    elevation: 6,
  },
  header: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: palette.pen,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  headerText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  aiSide: {
    height: 70,
    backgroundColor: 'rgba(255,50,50,0.12)',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    justifyContent: 'center',
  },
  playerSide: {
    height: 70,
    backgroundColor: 'rgba(50,100,255,0.12)',
    borderTopWidth: 2,
    borderTopColor: '#000',
    justifyContent: 'center',
  },
  playerSideHighlighted: {
    backgroundColor: 'rgba(0,200,60,0.22)',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    minWidth: '100%',
    justifyContent: 'center',
  },
  smallCard: {
    transform: [{ scale: 0.45 }],
    marginHorizontal: -20,
  },
  placeholderText: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 11,
    color: '#aaa',
    textAlign: 'center',
    flex: 1,
  },
  powerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: palette.backgroundPlaySession,
  },
  vsText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  powerBadgeCol: {
    alignItems: 'center',
  },
  powerLabel: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 10,
  },
  powerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  powerText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 16,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
