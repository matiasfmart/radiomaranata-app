import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { brand } from '../../constants/brand';
import { copy } from '../../constants/copy';
import { playbackConfig } from '../../constants/playback';
import { tokens } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { Song } from '../../types/radio';

type TracksScreenProps = {
  history: Song[];
  currentTrack: Song;
  isPlaying: boolean;
  onGoToListen: () => void;
};

const colors = tokens.color;
const fonts = fontFamilies;

export function TracksScreen({ history, currentTrack, isPlaying, onGoToListen }: TracksScreenProps) {
  const songs = history.length ? history.slice(0, playbackConfig.trackHistoryLimit) : [{ title: copy.tracks.emptyTitle, artist: brand.fallbackArtist, time: playbackConfig.defaultPlayedAtLabel }];

  return <ScrollView contentContainerStyle={styles.contentScreen} showsVerticalScrollIndicator={false}>
    <Text style={styles.screenEyebrow}>{copy.tracks.eyebrow}</Text><Text style={styles.screenTitle}>{copy.tracks.title}</Text><Text style={styles.screenLead}>{copy.tracks.lead}</Text>
    <View style={styles.signalPanel}><View style={styles.signalHeader}><View style={styles.signalStateDot} /><Text style={styles.signalStateLabel}>{isPlaying ? copy.tracks.currentPlaying : copy.tracks.currentAvailable}</Text></View><Text style={styles.signalTitle} numberOfLines={2}>{currentTrack.title}</Text><Text style={styles.signalArtist} numberOfLines={1}>{currentTrack.artist}</Text><Pressable onPress={onGoToListen} accessibilityRole="button" style={styles.signalAction}><Ionicons name="radio-outline" size={17} color={colors.invertedForeground} /><Text style={styles.signalActionText}>{copy.tracks.openRadio}</Text></Pressable></View>
    <View style={styles.historyHeader}><Text style={styles.sectionTitle}>{copy.tracks.recentTitle}</Text><Text style={styles.historyMeta}>{copy.tracks.historyMode}</Text></View><View style={styles.trackList}>{songs.map((song, index) => <View key={`${song.title}-${index}`} style={styles.trackRow}><Text style={styles.trackIndex}>{String(index + 1).padStart(2, '0')}</Text><View style={styles.songCopy}><Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text><Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text></View><Text style={styles.songTime}>{song.time}</Text></View>)}</View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  contentScreen: { paddingHorizontal: tokens.space[3], paddingTop: tokens.space[6], paddingBottom: 200, backgroundColor: colors.background, minHeight: '100%' },
  screenEyebrow: { color: colors.foregroundSubtle, fontFamily: fonts.monoSemi, fontSize: 12, marginBottom: 8 },
  screenTitle: { color: colors.foreground, fontFamily: fonts.display, fontWeight: '700', fontSize: 40, lineHeight: 43 },
  screenLead: { color: colors.mutedForeground, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: tokens.space[2] },
  signalPanel: { borderRadius: tokens.radius.panel, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, padding: tokens.space[3], marginTop: tokens.space[4], marginBottom: tokens.space[4], boxShadow: tokens.shadow.artwork },
  signalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.space[4] },
  signalTitle: { color: colors.foreground, fontFamily: fonts.display, fontWeight: '700', fontSize: 30, lineHeight: 34 },
  signalArtist: { color: colors.mutedForeground, fontFamily: fonts.bodyMedium, fontSize: 15, marginTop: 8 },
  signalAction: { alignSelf: 'flex-start', minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.invertedBackground, paddingHorizontal: tokens.space[2], marginTop: tokens.space[4] },
  signalActionText: { color: colors.invertedForeground, fontFamily: fonts.bodySemi, fontSize: 13 },
  signalStateDot: { width: 8, height: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.foreground, marginRight: 8 },
  signalStateLabel: { flex: 1, color: colors.mutedForeground, fontFamily: fonts.monoSemi, fontSize: 12 },
  historyHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 },
  historyMeta: { color: colors.foregroundSubtle, fontFamily: fonts.mono, fontSize: 11 },
  sectionTitle: { color: colors.foreground, fontFamily: fonts.display, fontWeight: '700', fontSize: 19, marginTop: tokens.space[2], marginBottom: tokens.space[2] },
  trackList: { borderRadius: tokens.radius.card, backgroundColor: colors.muted, overflow: 'hidden' },
  trackRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: tokens.space[2], borderBottomColor: colors.border, borderBottomWidth: 1 },
  trackIndex: { width: 34, color: colors.foregroundSubtle, fontFamily: fonts.monoSemi, fontSize: 11 },
  songCopy: { flex: 1 },
  songTitle: { color: colors.foreground, fontFamily: fonts.bodySemi, fontSize: 14 },
  songArtist: { color: colors.mutedForeground, fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  songTime: { width: 58, color: colors.foregroundSubtle, fontFamily: fonts.monoSemi, fontSize: 12 },
});
