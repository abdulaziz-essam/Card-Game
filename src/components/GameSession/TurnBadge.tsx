import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../../style/palette';

interface TurnBadgeProps {
  isPlayerTurn: boolean;
  gameOver: boolean;
  playerWon: boolean;
}

export function TurnBadge({ isPlayerTurn, gameOver, playerWon }: TurnBadgeProps) {
  const badgeColor = isPlayerTurn ? palette.playerColor : palette.aiColor;
  let label: string;
  if (gameOver)          label = playerWon ? '🎉 YOU WIN!' : '💀 AI WINS';
  else if (isPlayerTurn) label = 'YOUR TURN!';
  else                   label = 'AI THINKING...';

  return (
    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  badgeText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 22,
    color: '#fff',
    letterSpacing: 1,
  },
});
