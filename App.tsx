import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import MainMenuScreen from './src/screens/MainMenuScreen';
import PlaySessionScreen from './src/screens/PlaySessionScreen';
import WinScreen from './src/screens/WinScreen';
import { palette } from './src/style/palette';

type Screen = 'menu' | 'play' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');

  const [fontsLoaded] = useFonts({
    Bangers_400Regular,
    PermanentMarker_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={palette.darkPen} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" hidden />
      {screen === 'menu' && (
        <MainMenuScreen onPlay={() => setScreen('play')} />
      )}
      {screen === 'play' && (
        <PlaySessionScreen
          onBack={() => setScreen('menu')}
          onWin={() => setScreen('win')}
        />
      )}
      {screen === 'win' && (
        <WinScreen onContinue={() => setScreen('menu')} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.backgroundMain,
  },
});
