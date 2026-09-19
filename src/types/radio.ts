export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export type Song = {
  title: string;
  artist: string;
  time: string;
  art?: string | null;
};
