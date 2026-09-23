import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { palette } from '../style/palette';
import { useAudio } from '../hooks/useAudio';
import { StadiumScene } from '../components/StadiumScene';
import { CameraPhase } from '../hooks/useAnimatedCamera';

// ─── HUD overlay (title + buttons) ───────────────────────────────────────────

interface MenuHudProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onPlay: () => void;
}

function MenuHud({ audioEnabled, onToggleAudio, onPlay }: MenuHudProps) {
  return (
    <View style={styles.hudWrapper} pointerEvents="box-none">
      {/* Title top-center */}
      <View style={styles.titleArea} pointerEvents="none">
        <Text style={styles.titleText}>CARD{'\n'}FOOTBALL</Text>
        <Text style={styles.subtitleText}>11 vs 11</Text>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomHud}>
        <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.85}>
          <Text style={styles.playButtonLabel}>⚽ KICK OFF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.audioButton} onPress={onToggleAudio} activeOpacity={0.8}>
          <Text style={styles.audioIcon}>{audioEnabled ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>

        <Text style={styles.creditText}>Music by Mr Smith</Text>
      </View>
    </View>
  );
}

// ─── Dive overlay (fade-to-black during camera dive) ─────────────────────────

function DiveOverlay({ opacity }: { opacity: Animated.Value }) {
  return (
    <Animated.View style={[styles.diveOverlay, { opacity }]} pointerEvents="none" />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface MainMenuScreenProps {
  onPlay: () => void;
}

export default function MainMenuScreen({ onPlay }: MainMenuScreenProps) {
  const { audioEnabled, toggleAudio } = useAudio();
  const [cameraPhase, setCameraPhase] = useState<CameraPhase>('orbit');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const handlePlay = () => {
    // Start camera dive + fade HUD out
    setCameraPhase('dive');
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDiveComplete = () => {
    // Small pause at field level then go to game
    setTimeout(() => onPlay(), 300);
  };

  const hudVisible = cameraPhase === 'orbit';

  return (
    <View style={styles.screenContainer}>
      {/* Full-screen 3D stadium — orbiting camera */}
      <StadiumScene
        locations={[]}
        cameraPhase={cameraPhase}
        onDiveComplete={handleDiveComplete}
        style={StyleSheet.absoluteFill}
      />

      {/* HUD overlaid on top */}
      {hudVisible && (
        <MenuHud
          audioEnabled={audioEnabled}
          onToggleAudio={toggleAudio}
          onPlay={handlePlay}
        />
      )}

      {/* Black fade during dive */}
      <DiveOverlay opacity={fadeAnim} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  // HUD sits above the canvas in absolute position
  hudWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleArea: {
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 72,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 72,
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  subtitleText: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 28,
    color: palette.winHighlight,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginTop: 4,
  },
  bottomHud: {
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    backgroundColor: palette.playerColor,
    paddingHorizontal: 52,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  playButtonLabel: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 36,
    color: '#fff',
    letterSpacing: 3,
  },
  audioButton: {
    padding: 10,
  },
  audioIcon: {
    fontSize: 30,
  },
  creditText: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  diveOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
});
