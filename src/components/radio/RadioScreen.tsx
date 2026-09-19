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
  const hasTrackMetadata = currentTrack.title !== brand.name || currentTrack.artist !== copy.playback.loadingSignal;

  return (
    <View style={styles.listenScreen}>
      <View style={styles.warmAura} />
      <View style={styles.listenHeader}>
        <View style={styles.brandLockup}><Text style={styles.wordmark}>{brand.wordmark}</Text><Text style={styles.frequency}>{brand.frequency}</Text></View>
        <View style={styles.signalMark}><View style={[styles.signalDot, isOnline && styles.signalDotActive]} /></View>
      </View>

      <View style={styles.listenBody}>
        <Animated.View style={[styles.radioControl, { transform: [{ scale: consoleScale }] }]}> 
          <Text style={styles.consoleStatus}>{playbackText}</Text>
          <View style={styles.frequencyRow}>
            <Text style={styles.consoleFrequency}>{brand.frequencyShort}</Text>
            <View style={styles.playArea}>
              <Animated.View style={[styles.playHalo, { opacity: isPlaying ? haloOpacity : 0, transform: [{ scale: haloScale }] }]} />
              <Animated.View style={{ transform: [{ scale: pressScale }] }}>
                <Pressable accessibilityLabel={buttonLabel} accessibilityRole="button" disabled={!streamReady || isLoading} onPress={playbackStatus === 'error' ? onRetry : onToggle} onPressIn={() => Animated.spring(pressScale, { toValue: tokens.motion.pressScale, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start()} style={[styles.playButton, (!streamReady || isLoading) && styles.playButtonDisabled]}>
                  {isLoading ? <ActivityIndicator color={colors.invertedForeground} /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={34} color={colors.invertedForeground} />}
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        {hasTrackMetadata && <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={2}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>}
      </View>

      <View style={styles.listenersRow}>
        <Text style={styles.programName}>{copy.listeners.label}</Text>
        <Text style={styles.listenersText}>{listenerText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listenScreen: { flex: 1, paddingHorizontal: tokens.space[3], paddingTop: tokens.space[4], paddingBottom: 112, justifyContent: 'space-between', backgroundColor: colors.background, overflow: 'hidden' },
  warmAura: { position: 'absolute', top: -150, right: -210, width: 320, height: 320, borderRadius: tokens.radius.pill, backgroundColor: colors.muted, opacity: 0.08 },
  listenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: tokens.space[2] },
  brandLockup: { flex: 1 },
  wordmark: { color: colors.foreground, fontFamily: fonts.display, fontSize: 30, lineHeight: 32, fontWeight: '800', letterSpacing: -0.75 },
  frequency: { color: colors.foregroundSubtle, fontFamily: fonts.detail, fontSize: 10, marginTop: 4 },
  signalMark: { width: 34, height: 34, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.muted },
  signalDot: { width: 7, height: 7, borderRadius: tokens.radius.pill, backgroundColor: colors.foregroundSubtle },
  signalDotActive: { backgroundColor: colors.foreground },
  listenBody: { flex: 1, justifyContent: 'center', paddingTop: tokens.space[3] },
  radioControl: { width: '100%', minHeight: 250, justifyContent: 'center', paddingVertical: tokens.space[4] },
  consoleStatus: { color: colors.foregroundSubtle, fontFamily: fonts.bodyMedium, fontSize: 13, marginBottom: tokens.space[1], textAlign: 'left' },
  frequencyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space[3], borderTopColor: colors.border, borderTopWidth: 1, borderBottomColor: colors.border, borderBottomWidth: 1, paddingVertical: tokens.space[3] },
  consoleFrequency: { flexShrink: 1, color: colors.foreground, fontFamily: fonts.display, fontSize: 92, lineHeight: 92, fontWeight: '800', letterSpacing: -2.3, textAlign: 'left' },
  trackInfo: { alignItems: 'flex-start', marginTop: tokens.space[5], minHeight: 78, justifyContent: 'center' },
  trackTitle: { color: colors.foreground, fontFamily: fonts.title, fontSize: 28, lineHeight: 31, fontWeight: '700', letterSpacing: -0.65, textAlign: 'left' },
  trackArtist: { color: colors.mutedForeground, fontFamily: fonts.bodyMedium, fontSize: 15, marginTop: 7, textAlign: 'left' },
  programName: { color: colors.foregroundSubtle, fontFamily: fonts.detail, fontSize: 10, marginRight: 10, transform: [{ translateY: -2 }] },
  playArea: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  playHalo: { position: 'absolute', width: 96, height: 96, borderRadius: tokens.radius.pill, backgroundColor: colors.foreground, opacity: 0.08 },
  playButton: { width: 76, height: 76, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.invertedBackground, boxShadow: tokens.shadow.floating },
  playButtonDisabled: { opacity: 0.46 },
  listenersRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', paddingHorizontal: tokens.space[2], backgroundColor: colors.transparent, marginTop: tokens.space[2] },
  listenersText: { flexShrink: 1, color: colors.mutedForeground, fontFamily: fonts.bodySemi, fontSize: 13, marginRight: 8 },
});
