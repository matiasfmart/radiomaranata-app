import { Animated, StyleSheet, View } from 'react-native';
import { brand } from '../../constants/brand';
import { copy } from '../../constants/copy';
import { useTextTransition } from '../../hooks/useTextTransition';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { PlaybackStatus, Song } from '../../types/radio';
import { AppText } from '../ui/AppText';
import { BrandMark } from '../ui/BrandMark';
import { Chip } from '../ui/Chip';
import { LiveIndicator } from '../ui/LiveIndicator';
import { Screen } from '../ui/Screen';
import { SignalVisualizer } from '../ui/SignalVisualizer';
import { TransportButton } from '../ui/TransportButton';

type RadioScreenProps = {
  currentTrack: Song;
  isLoading: boolean;
  isOnline: boolean;
  isPlaying: boolean;
  playbackStatus: PlaybackStatus;
  playbackError: string | null;
  listenerCount: number;
  listenerCountries: number;
  streamReady: boolean;
  onToggle: () => void;
  onRetry: () => void;
};

export function RadioScreen({ currentTrack, isLoading, isOnline, isPlaying, playbackStatus, playbackError, listenerCount, listenerCountries, streamReady, onToggle, onRetry }: RadioScreenProps) {
  const { colors } = useTheme();
  const buttonLabel = isLoading ? 'Conectando' : isPlaying ? 'Pausar radio' : playbackStatus === 'error' ? 'Reintentar radio' : 'Reproducir radio';
  const listenerText = listenerCount > 1 ? `${listenerCount.toLocaleString('es-AR')}${listenerCountries > 0 ? ` · ${listenerCountries} países` : ''}` : copy.listeners.fallback;
  const playbackText = playbackError || (isPlaying ? copy.playback.playing : streamReady ? copy.playback.readyToListen : copy.playback.connectingSignal);
  const hasTrackMetadata = currentTrack.title !== brand.name || currentTrack.artist !== copy.playback.loadingSignal;
  const nowPlayingLabel = playbackStatus === 'error' ? playbackText : isPlaying ? copy.playback.now : playbackText;

  const trackOpacity = useTextTransition(`${currentTrack.title}-${currentTrack.artist}`);
  const statusOpacity = useTextTransition(playbackText);

  return (
    <Screen bottomInset={tokens.height.navigationDock + tokens.space.md}>
      <View style={styles.header}>
        <View style={styles.brandLockup}>
          <View style={styles.brandRow}>
            <BrandMark size={tokens.icon.lg + tokens.space.xs} color={colors.foreground} />
            <AppText variant="headline">{brand.wordmark}</AppText>
          </View>
          <View style={styles.brandMeta}>
            <AppText variant="caption" tone="subtle">{brand.frequency}</AppText>
            <LiveIndicator active={isOnline} label={isOnline ? 'En vivo' : 'Fuera de línea'} colorize={false} />
          </View>
        </View>
      </View>

      <View style={styles.listeningModule}>
        <Animated.View style={{ opacity: statusOpacity }}>
          <AppText variant="caption" tone="subtle">{nowPlayingLabel}</AppText>
        </Animated.View>

        <Animated.View style={[styles.track, { opacity: trackOpacity }]}>
          <AppText variant="title" numberOfLines={2}>{hasTrackMetadata ? currentTrack.title : brand.stationLabel}</AppText>
          <AppText variant="body" tone="muted" numberOfLines={1} style={styles.artist}>{hasTrackMetadata ? currentTrack.artist : copy.playback.liveArtist}</AppText>
        </Animated.View>

        <SignalVisualizer active={isPlaying} />

        <View style={styles.transportRow}>
          <View>
            <AppText variant="caption" tone="subtle">{brand.frequency}</AppText>
            <AppText variant="display" style={styles.frequency}>{brand.frequencyShort}</AppText>
          </View>
          <TransportButton
            playing={isPlaying}
            loading={isLoading}
            disabled={!streamReady || isLoading}
            accessibilityLabel={buttonLabel}
            onPress={playbackStatus === 'error' ? onRetry : onToggle}
          />
        </View>

        <View style={styles.audience}>
          <Chip label={`${copy.listeners.label} · ${listenerText}`} tone={isPlaying ? 'accent' : 'neutral'} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  brandLockup: { flex: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm },
  brandMeta: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.md, marginTop: tokens.space.xs },
  listeningModule: { flex: 1, justifyContent: 'center', paddingBottom: tokens.space.xxl },
  track: { marginTop: tokens.space.md },
  artist: { marginTop: tokens.space.xs },
  transportRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space.lg, marginTop: tokens.space.md },
  frequency: { marginTop: tokens.space.xs },
  audience: { alignSelf: 'flex-start', marginTop: tokens.space.lg },
});
