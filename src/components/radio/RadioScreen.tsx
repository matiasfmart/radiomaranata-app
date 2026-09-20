import { Animated, StyleSheet, View } from 'react-native';
import { brand } from '../../constants/brand';
import { copy } from '../../constants/copy';
import { useTextTransition } from '../../hooks/useTextTransition';
import { tokens } from '../../theme/tokens';
import { PlaybackStatus, Song } from '../../types/radio';
import { AppText } from '../ui/AppText';
import { Chip } from '../ui/Chip';
import { LiveIndicator } from '../ui/LiveIndicator';
import { Screen } from '../ui/Screen';
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
  const buttonLabel = isLoading ? 'Conectando' : isPlaying ? 'Pausar radio' : playbackStatus === 'error' ? 'Reintentar radio' : 'Reproducir radio';
  const listenerText = listenerCount > 1 ? `${listenerCount.toLocaleString('es-AR')}${listenerCountries > 0 ? ` · ${listenerCountries} países` : ''}` : copy.listeners.fallback;
  const playbackText = playbackError || (isPlaying ? copy.playback.playing : streamReady ? copy.playback.readyToListen : copy.playback.connectingSignal);
  const hasTrackMetadata = currentTrack.title !== brand.name || currentTrack.artist !== copy.playback.loadingSignal;

  const trackOpacity = useTextTransition(`${currentTrack.title}-${currentTrack.artist}`);
  const statusOpacity = useTextTransition(playbackText);

  return (
    <Screen bottomInset={tokens.height.listItem + tokens.space.xl}>
      <View style={styles.header}>
        <View style={styles.brandLockup}>
          <AppText variant="headline">{brand.wordmark}</AppText>
          <AppText variant="caption" tone="subtle" style={styles.frequencyLabel}>{brand.frequency}</AppText>
        </View>
        <LiveIndicator active={isOnline} label={isOnline ? 'En vivo' : 'Fuera de línea'} colorize={false} />
      </View>

      <View style={styles.body}>
        <Animated.View style={{ opacity: statusOpacity }}>
          <AppText variant="label" tone="subtle">{playbackText}</AppText>
        </Animated.View>

        <View style={styles.frequencyRow}>
          <AppText variant="display" style={styles.frequency}>{brand.frequencyShort}</AppText>
          <TransportButton
            playing={isPlaying}
            loading={isLoading}
            disabled={!streamReady || isLoading}
            accessibilityLabel={buttonLabel}
            onPress={playbackStatus === 'error' ? onRetry : onToggle}
          />
        </View>

        {hasTrackMetadata && (
          <Animated.View style={[styles.track, { opacity: trackOpacity }]}>
            <AppText variant="title" numberOfLines={2}>{currentTrack.title}</AppText>
            <AppText variant="body" tone="muted" numberOfLines={1} style={styles.artist}>{currentTrack.artist}</AppText>
          </Animated.View>
        )}
      </View>

      <View style={styles.footer}>
        <Chip label={`${copy.listeners.label} · ${listenerText}`} tone={isPlaying ? 'accent' : 'neutral'} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandLockup: { flex: 1 },
  frequencyLabel: { marginTop: tokens.space.xs },
  body: { flex: 1, justifyContent: 'center' },
  frequencyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space.lg, borderTopColor: tokens.color.border, borderTopWidth: 1, borderBottomColor: tokens.color.border, borderBottomWidth: 1, paddingVertical: tokens.space.lg, marginTop: tokens.space.sm },
  frequency: { flexShrink: 1 },
  track: { marginTop: tokens.space.xl },
  artist: { marginTop: tokens.space.xs },
  footer: { alignItems: 'center', paddingBottom: tokens.space.base },
});
