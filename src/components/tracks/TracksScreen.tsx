import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { brand } from '../../constants/brand';
import { copy } from '../../constants/copy';
import { playbackConfig } from '../../constants/playback';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { Song } from '../../types/radio';
import { AppText } from '../ui/AppText';
import { LiveIndicator } from '../ui/LiveIndicator';
import { ListItem, PillButton } from '../ui/ListItem';
import { Screen } from '../ui/Screen';
import { ScreenHeader } from '../ui/ScreenHeader';

type TracksScreenProps = {
  history: Song[];
  currentTrack: Song;
  isPlaying: boolean;
  onGoToListen: () => void;
};

export function TracksScreen({ history, currentTrack, isPlaying, onGoToListen }: TracksScreenProps) {
  const { colors } = useTheme();
  const songs = history.length ? history.slice(0, playbackConfig.trackHistoryLimit) : [{ title: copy.tracks.emptyTitle, artist: brand.fallbackArtist, time: playbackConfig.defaultPlayedAtLabel }];

  return (
    <Screen scroll>
      <ScreenHeader eyebrow={copy.tracks.eyebrow} title={copy.tracks.title} lead={copy.tracks.lead} />

      <View style={[styles.signalPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <LiveIndicator active={isPlaying} label={isPlaying ? copy.tracks.currentPlaying : copy.tracks.currentAvailable} />
        <AppText variant="title" numberOfLines={2} style={styles.signalTitle}>{currentTrack.title}</AppText>
        <AppText variant="body" tone="muted" numberOfLines={1} style={styles.signalArtist}>{currentTrack.artist}</AppText>
        <View style={styles.action}>
          <PillButton label={copy.tracks.openRadio} icon={<Ionicons name="radio-outline" size={tokens.icon.sm} color={colors.accentForeground} />} onPress={onGoToListen} />
        </View>
      </View>

      <View style={styles.historyHeader}>
        <AppText variant="headline">{copy.tracks.recentTitle}</AppText>
        <AppText variant="caption" tone="subtle">{copy.tracks.historyMode}</AppText>
      </View>
      <View style={[styles.trackList, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        {songs.map((song, index) => (
          <StaggeredRow key={`${song.title}-${index}`} index={index}>
            <ListItem index={String(index + 1).padStart(2, '0')} title={song.title} subtitle={song.artist} trailing={song.time} />
          </StaggeredRow>
        ))}
      </View>
    </Screen>
  );
}

// First-load stagger: fade + short rise, 40ms apart, once per mount only.
// Reduced motion skips the delay/travel and just fades in together.
function StaggeredRow({ index, children }: { index: number; children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: tokens.motion.duration.medium,
      delay: reducedMotion ? 0 : index * tokens.motion.staggerStep,
      useNativeDriver: true,
    }).start();
  }, [index, progress, reducedMotion]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : tokens.motion.distance.sm, 0] });

  return <Animated.View style={{ opacity: progress, transform: [{ translateY }] }}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  signalPanel: { borderRadius: tokens.radius.md, borderWidth: 1, padding: tokens.space.lg, marginTop: tokens.space.xl, marginBottom: tokens.space.xxl, boxShadow: tokens.shadow.panel },
  signalTitle: { marginTop: tokens.space.lg },
  signalArtist: { marginTop: tokens.space.xs },
  action: { marginTop: tokens.space.lg },
  historyHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: tokens.space.sm },
  trackList: { borderRadius: tokens.radius.sm, overflow: 'hidden', borderWidth: 1 },
});
