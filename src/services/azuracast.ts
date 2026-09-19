export type AzuraCastSong = {
  id: string;
  title: string;
  artist: string;
  text: string;
  art: string | null;
};

export type AzuraCastHistoryItem = {
  id: string;
  playedAt: number;
  song: AzuraCastSong;
};

export type AzuraCastNowPlaying = {
  isOnline: boolean;
  listenersCount: number;
  currentSong: AzuraCastSong | null;
  history: AzuraCastHistoryItem[];
  streamUrl: string | null;
};

const AZURACAST_BASE_URL = 'https://azuracast-dquna-u78781.vm.elestio.app';
const STATION_SHORTCODE = 'maranata';
const FALLBACK_STREAM_URL = `${AZURACAST_BASE_URL}/listen/${STATION_SHORTCODE}/radio.mp3`;

export function cleanSongText(rawText: string | undefined | null): string {
  if (!rawText) return '';

  let cleaned = rawText.trim();

  if (cleaned.includes('-') && !cleaned.includes(' ') && !cleaned.includes(' - ')) {
    cleaned = cleaned.replace(/-/g, ' ');
  }

  cleaned = cleaned.replace(/\.(mp3|aac|flac|wav|m4a)$/i, '');

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

export async function getAzuraCastNowPlaying(): Promise<AzuraCastNowPlaying> {
  try {
    const response = await fetch(`${AZURACAST_BASE_URL}/api/nowplaying/${STATION_SHORTCODE}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        isOnline: false,
        listenersCount: 0,
        currentSong: null,
        history: [],
        streamUrl: FALLBACK_STREAM_URL,
      };
    }

    const data = await response.json();
    const isOnline = Boolean(data?.is_online);
    const listenersCount = Number(data?.listeners?.current ?? 0);
    const nowPlayingSong = data?.now_playing?.song;
    const isOffline =
      !isOnline ||
      nowPlayingSong?.title?.toLowerCase() === 'station offline' ||
      nowPlayingSong?.text?.toLowerCase() === 'station offline';

    const currentSong: AzuraCastSong | null =
      !isOffline && (nowPlayingSong?.title || nowPlayingSong?.text)
        ? {
            id: nowPlayingSong.id || 'current',
            title: cleanSongText(nowPlayingSong.title),
            artist: cleanSongText(nowPlayingSong.artist),
            text: cleanSongText(nowPlayingSong.text),
            art: nowPlayingSong.art || null,
          }
        : null;

    const rawHistory = Array.isArray(data?.song_history) ? data.song_history : [];
    const history: AzuraCastHistoryItem[] = rawHistory
      .filter((item: any) => item?.song?.title || item?.song?.text)
      .slice(0, 6)
      .map((item: any) => ({
        id: String(item.sh_id || item.song.id),
        playedAt: Number(item.played_at || 0),
        song: {
          id: item.song.id || '',
          title: cleanSongText(item.song.title),
          artist: cleanSongText(item.song.artist),
          text: cleanSongText(item.song.text),
          art: item.song.art || null,
        },
      }));

    return {
      isOnline,
      listenersCount,
      currentSong,
      history,
      streamUrl: data?.station?.listen_url || FALLBACK_STREAM_URL,
    };
  } catch (error) {
    console.error('[AzuraCast] Error en nowplaying:', error);
    return {
      isOnline: false,
      listenersCount: 0,
      currentSong: null,
      history: [],
      streamUrl: FALLBACK_STREAM_URL,
    };
  }
}
