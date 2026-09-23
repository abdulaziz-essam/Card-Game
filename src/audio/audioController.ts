import { Audio } from 'expo-av';

let bgMusic: Audio.Sound | null = null;
let musicEnabled = true;

const MUSIC_FILES = [
  require('../../assets/music/Mr_Smith-Sunday_Solitude.mp3'),
  require('../../assets/music/Mr_Smith-Azul.mp3'),
  require('../../assets/music/Mr_Smith-Sonorus.mp3'),
];

const SFX_FILES: Record<string, unknown> = {
  buttonTap: require('../../assets/sfx/k1.mp3'),
  huhsh: require('../../assets/sfx/ws1.mp3'),
  wssh: require('../../assets/sfx/kss1.mp3'),
  congrats: require('../../assets/sfx/yay1.mp3'),
};

export async function startMusic() {
  if (!musicEnabled) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    if (bgMusic) {
      await bgMusic.unloadAsync();
    }
    const track = MUSIC_FILES[Math.floor(Math.random() * MUSIC_FILES.length)];
    const { sound } = await Audio.Sound.createAsync(track, {
      isLooping: true,
      volume: 0.4,
    });
    bgMusic = sound;
    await bgMusic.playAsync();
  } catch (e) {
    // audio unavailable
  }
}

export async function stopMusic() {
  try {
    await bgMusic?.stopAsync();
    await bgMusic?.unloadAsync();
    bgMusic = null;
  } catch (e) {}
}

export function setMusicEnabled(enabled: boolean) {
  musicEnabled = enabled;
  if (!enabled) stopMusic();
  else startMusic();
}

export async function playSfx(type: keyof typeof SFX_FILES) {
  if (!musicEnabled) return;
  try {
    const { sound } = await Audio.Sound.createAsync(SFX_FILES[type] as any);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {}
}
