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
import { ListItem } from '../ui/ListItem';
import { Screen } from '../ui/Screen';
import { ScreenHeader } from '../ui/ScreenHeader';

type TracksScreenProps = {
  history: Song[];
  currentTrack: Song;
  isPlaying: boolean;
};

export function TracksScreen({ history, currentTrack, isPlaying }: TracksScreenProps) {
  const { colors } = useTheme();
  const recentSongs = history
    .filter((song) => song.title !== currentTrack.title || song.artist !== currentTrack.artist)
    .slice(0, playbackConfig.trackHistoryLimit);
  const songs = recentSongs.length ? recentSongs : [{ title: copy.tracks.emptyTitle, artist: brand.fallbackArtist, time: playbackConfig.defaultPlayedAtLabel }];

  return (
    <Screen scroll>
      <ScreenHeader eyebrow={copy.tracks.eyebrow} title={copy.tracks.title} lead={copy.tracks.lead} />

      <View style={styles.currentContext}>
        <View style={styles.currentStatus}>
          <View style={[styles.statusDot, { backgroundColor: isPlaying ? colors.accent : colors.foregroundSubtle }]} />
          <AppText variant="caption" tone={isPlaying ? 'accent' : 'subtle'}>{isPlaying ? copy.tracks.currentPlaying : copy.tracks.currentAvailable}</AppText>
        </View>
        <AppText variant="headline" numberOfLines={2} style={styles.currentTitle}>{currentTrack.title}</AppText>
        <AppText variant="body" tone="muted" numberOfLines={1} style={styles.currentArtist}>{currentTrack.artist}</AppText>
      </View>

      <View style={styles.historyHeader}>
        <AppText variant="headline">{copy.tracks.recentTitle}</AppText>
        <AppText variant="caption" tone="subtle">{copy.tracks.historyMode}</AppText>
      </View>
      <View style={[styles.trackList, { backgroundColor: colors.muted }]}>
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
  currentContext: { marginTop: tokens.space.xl, marginBottom: tokens.space.xl },
  currentStatus: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm },
  statusDot: { width: 6, height: 6, borderRadius: tokens.radius.pill },
  currentTitle: { marginTop: tokens.space.md },
  currentArtist: { marginTop: tokens.space.xs },
  historyHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: tokens.space.md },
  trackList: { borderRadius: tokens.radius.md, overflow: 'hidden' },
});
