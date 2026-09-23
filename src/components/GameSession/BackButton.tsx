import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../../style/palette';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>← BACK</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
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
  label: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
  },
});
