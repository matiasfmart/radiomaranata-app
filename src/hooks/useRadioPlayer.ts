import { useEffect, useState } from 'react';
import { copy } from '../constants/copy';
import { configureRadioAudioMode, createRadioSound, RadioSound } from '../services/radioAudio';
import { PlaybackStatus } from '../types/radio';

export function useRadioPlayer(streamUrl: string | null) {
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<RadioSound | null>(null);

  useEffect(() => {
    configureRadioAudioMode();
    return () => { sound?.unloadAsync(); };
  }, [sound]);

  const togglePlayback = async () => {
    if (!streamUrl || isLoading) return;

    setIsLoading(true);
    setPlaybackStatus('loading');
    setPlaybackError(null);

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
          setPlaybackStatus('paused');
        } else {
          await sound.playAsync();
          setIsPlaying(true);
          setPlaybackStatus('playing');
        }
        return;
      }

      const loadedSound = await createRadioSound(streamUrl);
      setSound(loadedSound);
      setIsPlaying(true);
      setPlaybackStatus('playing');
    } catch (error) {
      console.error('[Radio] Error al reproducir el stream:', error);
      setIsPlaying(false);
      setPlaybackStatus('error');
      setPlaybackError(copy.playback.retryError);
    } finally {
      setIsLoading(false);
    }
  };

  const retryPlayback = () => {
    setPlaybackError(null);
    setPlaybackStatus('idle');
    void togglePlayback();
  };

  return {
    isLoading,
    isPlaying,
    playbackError,
    playbackStatus,
    retryPlayback,
    togglePlayback,
  };
}
