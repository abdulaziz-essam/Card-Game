import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../../style/palette';

interface AiHandIndicatorProps {
  cardCount: number;
}

export function AiHandIndicator({ cardCount }: AiHandIndicatorProps) {
  return (
    <View style={styles.aiBar}>
      <Text style={styles.aiBarText}>🤖  AI Hand: {cardCount} cards</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aiBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  aiBarText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 18,
    color: palette.aiColor,
  },
});
