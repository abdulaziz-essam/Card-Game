import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
} from 'react-native';
import { PlayingCard } from '../game/PlayingCard';

export const CARD_WIDTH = 90;
export const CARD_HEIGHT = 126;

interface Props {
  card: PlayingCard;
  draggable?: boolean;
  onDragEnd?: (card: PlayingCard, x: number, y: number) => void;
  opacity?: number;
}

export default function PlayingCardWidget({ card, draggable = false, onDragEnd, opacity = 1 }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const isDragging = useRef(false);
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => draggable,
      onMoveShouldSetPanResponder: () => draggable,
      onPanResponderGrant: () => {
        isDragging.current = true;
        cardOpacity.setValue(0.3);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_: GestureResponderEvent, gesture: PanResponderGestureState) => {
        isDragging.current = false;
        cardOpacity.setValue(1);
        if (onDragEnd) {
          onDragEnd(card, gesture.moveX, gesture.moveY);
        }
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const cardContent = (
    <View style={[styles.card, { borderColor: card.color }]}>
      <View style={[styles.gradient, { backgroundColor: card.color }]} />

      {/* Cost badge */}
      <View style={styles.costBadge}>
        <Text style={styles.badgeText}>{card.cost}</Text>
      </View>

      {/* Power badge */}
      <View style={styles.powerBadge}>
        <Text style={styles.badgeText}>{card.power}</Text>
      </View>

      {/* Card icon */}
      <View style={styles.iconArea}>
        <Text style={styles.iconText}>⚡</Text>
      </View>

      {/* Name label */}
      <View style={styles.nameLabel}>
        <Text style={styles.nameText} numberOfLines={2}>{card.name}</Text>
      </View>

      {card.ability ? (
        <View style={styles.abilityLabel}>
          <Text style={styles.abilityText} numberOfLines={1}>{card.ability}</Text>
        </View>
      ) : null}
    </View>
  );

  if (!draggable) {
    return <View style={{ opacity }}>{cardContent}</View>;
  }

  return (
    <Animated.View
      style={[{ opacity: cardOpacity }, pan.getLayout(), styles.draggable]}
      {...panResponder.panHandlers}
    >
      {cardContent}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  draggable: {
    zIndex: 999,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#000',
    overflow: 'hidden',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    opacity: 0.75,
  },
  costBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    borderWidth: 2.5,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  powerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF3333',
    borderWidth: 2.5,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  badgeText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  iconArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 36,
    opacity: 0.5,
  },
  nameLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  nameText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  abilityLabel: {
    position: 'absolute',
    bottom: 24,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  abilityText: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 7,
    color: '#ffe066',
    textAlign: 'center',
  },
});
