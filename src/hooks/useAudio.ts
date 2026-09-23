import { useState, useEffect } from 'react';
import { startMusic, stopMusic, setMusicEnabled } from '../audio/audioController';

export function useAudio() {
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    startMusic();
    return () => { stopMusic(); };
  }, []);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setMusicEnabled(next);
  };

  return { audioEnabled, toggleAudio };
}
