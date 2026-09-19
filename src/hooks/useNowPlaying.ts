import { useEffect, useState } from 'react';
import { brand } from '../constants/brand';
import { copy } from '../constants/copy';
import { playbackConfig } from '../constants/playback';
import { AzuraCastHistoryItem, getAzuraCastNowPlaying } from '../services/azuracast';
import { Song } from '../types/radio';
import { formatPlayedAt } from '../utils/formatPlayedAt';

export function useNowPlaying() {
  const [isOnline, setIsOnline] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Song>({
    title: brand.name,
    artist: copy.playback.loadingSignal,
    time: playbackConfig.defaultPlayedAtLabel,
  });
  const [history, setHistory] = useState<Song[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadNowPlaying = async () => {
      const nowPlaying = await getAzuraCastNowPlaying();
      if (!isMounted) return;

      setIsOnline(nowPlaying.isOnline);
      setListenerCount(nowPlaying.listenersCount);
      setStreamUrl(nowPlaying.streamUrl);

      if (nowPlaying.currentSong) {
        setCurrentTrack({
          title: nowPlaying.currentSong.title || nowPlaying.currentSong.text || copy.playback.untitledTrack,
          artist: nowPlaying.currentSong.artist || copy.playback.liveArtist,
          time: copy.playback.now,
          art: nowPlaying.currentSong.art,
        });
      }

      setHistory(nowPlaying.history.map((item: AzuraCastHistoryItem) => ({
        title: item.song.title || item.song.text || copy.playback.untitledTrack,
        artist: item.song.artist || brand.fallbackArtist,
        time: formatPlayedAt(item.playedAt),
      })));
    };

    loadNowPlaying();
    const interval = setInterval(loadNowPlaying, playbackConfig.nowPlayingPollMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { currentTrack, history, isOnline, listenerCount, streamUrl };
}
