import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { palette } from '../style/palette';
import { useGameStore } from '../game/gameStore';

interface Props {
  onContinue: () => void;
}

export default function WinScreen({ onContinue }: Props) {
  const resetGame = useGameStore((s) => s.resetGame);

  const handleContinue = () => {
    resetGame();
    onContinue();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>You Won! 🎉</Text>
        <Text style={styles.subtitle}>You controlled more towers than the AI!</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.backgroundPlaySession,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 54,
    color: palette.ink,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 20,
    color: palette.pen,
    textAlign: 'center',
  },
  button: {
    backgroundColor: palette.darkPen,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  buttonText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 32,
    color: '#fff',
    letterSpacing: 3,
  },
});
