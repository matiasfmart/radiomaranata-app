import { playbackConfig } from '../constants/playback';

export function formatPlayedAt(playedAt: number): string {
  if (!playedAt) return playbackConfig.defaultPlayedAtLabel;
  return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date(playedAt * 1000));
}
