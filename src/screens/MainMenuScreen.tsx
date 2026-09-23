import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { palette } from '../style/palette';
import { useAudio } from '../hooks/useAudio';
import { MenuCardScene } from '../components/MenuCardScene';

// ─── Sub-components ──────────────────────────────────────────────────────────

function GameTitle() {
  return (
    <View style={styles.titleArea}>
      <Text style={styles.titleText}>Drag &amp; Drop{'\n'}Cards!</Text>
    </View>
  );
}

interface PlayButtonProps {
  onPress: () => void;
}

function PlayButton({ onPress }: PlayButtonProps) {
  return (
    <TouchableOpacity style={styles.playButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.playButtonLabel}>PLAY</Text>
    </TouchableOpacity>
  );
}

interface AudioToggleButtonProps {
  enabled: boolean;
  onToggle: () => void;
}

function AudioToggleButton({ enabled, onToggle }: AudioToggleButtonProps) {
  return (
    <TouchableOpacity style={styles.audioToggleButton} onPress={onToggle} activeOpacity={0.8}>
      <Text style={styles.audioToggleIcon}>{enabled ? '🔊' : '🔇'}</Text>
    </TouchableOpacity>
  );
}

function MusicCredit() {
  return <Text style={styles.musicCreditText}>Music by Mr Smith</Text>;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface MainMenuScreenProps {
  onPlay: () => void;
}

export default function MainMenuScreen({ onPlay }: MainMenuScreenProps) {
  const { audioEnabled, toggleAudio } = useAudio();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <GameTitle />

      {/* 3D card table scene */}
      <MenuCardScene />

      <View style={styles.bottomMenuArea}>
        <PlayButton onPress={onPlay} />
        <View style={styles.spacer} />
        <AudioToggleButton enabled={audioEnabled} onToggle={toggleAudio} />
        <View style={styles.spacer} />
        <MusicCredit />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: palette.backgroundMain,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  titleArea: {
    alignItems: 'center',
    transform: [{ rotate: '-5deg' }],
    paddingTop: 10,
  },
  titleText: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 52,
    color: palette.ink,
    textAlign: 'center',
    lineHeight: 60,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  bottomMenuArea: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  playButton: {
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
  playButtonLabel: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 32,
    color: '#fff',
    letterSpacing: 3,
  },
  audioToggleButton: {
    padding: 10,
  },
  audioToggleIcon: {
    fontSize: 30,
  },
  spacer: {
    height: 12,
  },
  musicCreditText: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 13,
    color: palette.pen,
    marginTop: 8,
  },
});
