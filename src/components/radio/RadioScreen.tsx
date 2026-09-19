import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { brand } from '../../constants/brand';
import { copy } from '../../constants/copy';
import { tokens } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { PlaybackStatus, Song } from '../../types/radio';

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

const colors = tokens.color;
const fonts = fontFamilies;

export function RadioScreen({ currentTrack, isLoading, isOnline, isPlaying, playbackStatus, playbackError, listenerCount, listenerCountries, streamReady, onToggle, onRetry }: RadioScreenProps) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breathe, { toValue: 1, duration: 1800, useNativeDriver: true }),
      Animated.timing(breathe, { toValue: 0, duration: 1800, useNativeDriver: true }),
    ]));
    if (isPlaying) loop.start();
    else { loop.stop(); breathe.setValue(0); }
    return () => loop.stop();
  }, [breathe, isPlaying]);

  const consoleScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.006] });
  const haloScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const haloOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0, 0.22] });
  const buttonLabel = isLoading ? 'Conectando' : isPlaying ? 'Pausar radio' : playbackStatus === 'error' ? 'Reintentar radio' : 'Reproducir radio';
  const listenerText = listenerCount > 1 ? `${listenerCount.toLocaleString('es-AR')}${listenerCountries > 0 ? ` · ${listenerCountries} países` : ''}` : copy.listeners.fallback;
  const playbackText = playbackError || (isPlaying ? copy.playback.playing : streamReady ? copy.playback.readyToListen : copy.playback.connectingSignal);

  return (
    <View style={styles.listenScreen}>
      <View style={styles.warmAura} />
      <View style={styles.listenHeader}>
        <View style={styles.brandLockup}><Text style={styles.wordmark}>{brand.wordmark}</Text><Text style={styles.frequency}>{brand.frequency}</Text></View>
        <View style={styles.signalMark}><View style={[styles.signalDot, isOnline && styles.signalDotActive]} /></View>
      </View>

      <View style={styles.listenBody}>
        <Animated.View style={[styles.radioConsole, { transform: [{ scale: consoleScale }] }]}> 
          <Text style={styles.consoleFrequency}>{brand.frequencyShort}</Text>
          <Text style={styles.consoleLabel}>{brand.stationLabel}</Text>
          <Text style={styles.consoleStatus}>{playbackText}</Text>
          <View style={styles.playArea}>
            <Animated.View style={[styles.playHalo, { opacity: isPlaying ? haloOpacity : 0, transform: [{ scale: haloScale }] }]} />
            <Animated.View style={{ transform: [{ scale: pressScale }] }}>
              <Pressable accessibilityLabel={buttonLabel} accessibilityRole="button" disabled={!streamReady || isLoading} onPress={playbackStatus === 'error' ? onRetry : onToggle} onPressIn={() => Animated.spring(pressScale, { toValue: tokens.motion.pressScale, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start()} style={[styles.playButton, (!streamReady || isLoading) && styles.playButtonDisabled]}>
                {isLoading ? <ActivityIndicator color={colors.invertedForeground} /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={colors.invertedForeground} />}
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={2}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
      </View>

      <View style={styles.listenersRow}>
        <Text style={styles.programName}>{copy.listeners.label}</Text>
        <Text style={styles.listenersText}>{listenerText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listenScreen: { flex: 1, paddingHorizontal: tokens.space[3], paddingTop: tokens.space[3], paddingBottom: 104, justifyContent: 'space-between', backgroundColor: colors.background, overflow: 'hidden' },
  warmAura: { position: 'absolute', top: -90, right: -150, width: 320, height: 320, borderRadius: tokens.radius.pill, backgroundColor: colors.muted, opacity: 0.36 },
  listenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: tokens.space[2] },
  brandLockup: { flex: 1 },
  wordmark: { color: colors.foreground, fontFamily: fonts.display, fontSize: 30, lineHeight: 32, fontWeight: '800', letterSpacing: -0.75 },
  frequency: { color: colors.foregroundSubtle, fontFamily: fonts.detail, fontSize: 10, marginTop: 4 },
  signalMark: { width: 34, height: 34, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.muted },
  signalDot: { width: 7, height: 7, borderRadius: tokens.radius.pill, backgroundColor: colors.foregroundSubtle },
  signalDotActive: { backgroundColor: colors.foreground },
  listenBody: { flex: 1, justifyContent: 'center', paddingTop: tokens.space[2] },
  radioConsole: { width: '100%', minHeight: 328, borderRadius: tokens.radius.panel, alignItems: 'center', justifyContent: 'center', padding: tokens.space[3], backgroundColor: colors.surface, overflow: 'hidden', borderColor: colors.border, borderWidth: 1, boxShadow: tokens.shadow.artwork },
  consoleStatus: { color: colors.foregroundSubtle, fontFamily: fonts.bodyMedium, fontSize: 13, marginTop: 10, textAlign: 'center' },
  consoleFrequency: { color: colors.foreground, fontFamily: fonts.display, fontSize: 84, lineHeight: 86, fontWeight: '800', letterSpacing: -2.1, textAlign: 'center' },
  consoleLabel: { color: colors.mutedForeground, fontFamily: fonts.bodyMedium, fontSize: 17, marginTop: 4, textAlign: 'center' },
  trackInfo: { alignItems: 'center', marginTop: tokens.space[3], minHeight: 82, justifyContent: 'center' },
  trackTitle: { color: colors.foreground, fontFamily: fonts.title, fontSize: 27, lineHeight: 30, fontWeight: '700', letterSpacing: -0.6, textAlign: 'center' },
  trackArtist: { color: colors.mutedForeground, fontFamily: fonts.bodyMedium, fontSize: 15, marginTop: 7, textAlign: 'center' },
  programName: { color: colors.foregroundSubtle, fontFamily: fonts.detail, fontSize: 10, marginRight: 10, transform: [{ translateY: -2 }] },
  playArea: { width: 108, height: 108, marginTop: tokens.space[4], alignItems: 'center', justifyContent: 'center' },
  playHalo: { position: 'absolute', width: 104, height: 104, borderRadius: tokens.radius.pill, backgroundColor: colors.foreground, opacity: 0.12 },
  playButton: { width: 84, height: 84, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.invertedBackground, boxShadow: tokens.shadow.floating },
  playButtonDisabled: { opacity: 0.46 },
  listenersRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', paddingHorizontal: tokens.space[2], backgroundColor: colors.transparent },
  listenersText: { flexShrink: 1, color: colors.mutedForeground, fontFamily: fonts.bodySemi, fontSize: 13, marginRight: 8 },
});
