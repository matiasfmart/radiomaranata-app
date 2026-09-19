import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';
import { IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { AzuraCastHistoryItem, getAzuraCastNowPlaying } from './src/services/azuracast';
import { ListenerSnapshot, sendListenerHeartbeat } from './src/services/listeners';
import { tokens } from './src/theme/tokens';

type AppTab = 'listen' | 'schedule' | 'church';
type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
type Song = { title: string; artist: string; time: string; art?: string | null };

const colors = tokens.color;
const fonts = {
  display: 'InstrumentSans_700Bold',
  body: 'InstrumentSans_400Regular',
  bodyMedium: 'InstrumentSans_500Medium',
  bodySemi: 'InstrumentSans_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
  monoSemi: 'IBMPlexMono_600SemiBold',
};
const churchWebsite = 'https://www.manantialdeavivamiento.com';
const emptyListeners: ListenerSnapshot = { listeners: 0, countries: 0, locations: [], available: false };

function formatPlayedAt(playedAt: number): string {
  if (!playedAt) return '--:--';
  return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date(playedAt * 1000));
}

export default function App() {
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });
  const [activeTab, setActiveTab] = useState<AppTab>('listen');
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [listenerSnapshot, setListenerSnapshot] = useState(emptyListeners);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Song>({ title: 'Radio Maranata', artist: 'Cargando señal en vivo', time: '--:--' });
  const [history, setHistory] = useState<Song[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const screenTransition = useRef(new Animated.Value(1)).current;

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
          title: nowPlaying.currentSong.title || nowPlaying.currentSong.text || 'Tema sin título',
          artist: nowPlaying.currentSong.artist || 'En vivo',
          time: 'Ahora',
          art: nowPlaying.currentSong.art,
        });
      }
      setHistory(nowPlaying.history.map((item: AzuraCastHistoryItem) => ({
        title: item.song.title || item.song.text || 'Tema sin título',
        artist: item.song.artist || 'Radio Maranata',
        time: formatPlayedAt(item.playedAt),
      })));
    };
    loadNowPlaying();
    const interval = setInterval(loadNowPlaying, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({ staysActiveInBackground: true, playsInSilentModeIOS: true, shouldDuckAndroid: true });
    return () => { sound?.unloadAsync(); };
  }, [sound]);

  useEffect(() => {
    if (!isPlaying) return;
    const sendHeartbeat = async () => setListenerSnapshot(await sendListenerHeartbeat());
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    screenTransition.setValue(0);
    Animated.sequence([
      Animated.delay(tokens.motion.screenDelay),
      Animated.timing(screenTransition, { toValue: 1, duration: tokens.motion.screenDuration, useNativeDriver: true }),
    ]).start();
  }, [activeTab, screenTransition]);

  const togglePlayback = async () => {
    if (!streamUrl || isLoading) return;
    setIsLoading(true);
    setPlaybackStatus('loading');
    setPlaybackError(null);
    try {
      if (sound) {
        if (isPlaying) { await sound.pauseAsync(); setIsPlaying(false); setPlaybackStatus('paused'); }
        else { await sound.playAsync(); setIsPlaying(true); setPlaybackStatus('playing'); }
        return;
      }
      const { sound: loadedSound } = await Audio.Sound.createAsync({ uri: streamUrl }, { shouldPlay: true, isLooping: false });
      setSound(loadedSound);
      setIsPlaying(true);
      setPlaybackStatus('playing');
    } catch (error) {
      console.error('[Radio] Error al reproducir el stream:', error);
      setIsPlaying(false);
      setPlaybackStatus('error');
      setPlaybackError('No pudimos iniciar la radio.');
    } finally {
      setIsLoading(false);
    }
  };

  const retryPlayback = () => {
    setPlaybackError(null);
    setPlaybackStatus('idle');
    void togglePlayback();
  };

  const transitionY = screenTransition.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  if (!fontsLoaded) {
    return <View style={styles.loadingScreen}><ActivityIndicator color={colors.accent} /></View>;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.screen, { opacity: screenTransition, transform: [{ translateY: transitionY }] }]}>
          {activeTab === 'listen' && <ListenScreen currentTrack={currentTrack} isLoading={isLoading} isOnline={isOnline} isPlaying={isPlaying} playbackStatus={playbackStatus} playbackError={playbackError} listenerCount={listenerSnapshot.available ? listenerSnapshot.listeners : listenerCount} listenerCountries={listenerSnapshot.available ? listenerSnapshot.countries : 0} streamReady={Boolean(streamUrl)} onToggle={togglePlayback} onRetry={retryPlayback} />}
          {activeTab === 'schedule' && <ScheduleScreen history={history} currentTrack={currentTrack} isPlaying={isPlaying} onGoToListen={() => setActiveTab('listen')} />}
          {activeTab === 'church' && <ChurchScreen />}
        </Animated.View>
        <BottomNavigation activeTab={activeTab} isPlaying={isPlaying} onTabChange={setActiveTab} />
      </SafeAreaView>
    </View>
  );
}

type ListenProps = { currentTrack: Song; isLoading: boolean; isOnline: boolean; isPlaying: boolean; playbackStatus: PlaybackStatus; playbackError: string | null; listenerCount: number; listenerCountries: number; streamReady: boolean; onToggle: () => void; onRetry: () => void };
function ListenScreen({ currentTrack, isLoading, isOnline, isPlaying, playbackStatus, playbackError, listenerCount, listenerCountries, streamReady, onToggle, onRetry }: ListenProps) {
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
  const listenerText = listenerCount > 1 ? `${listenerCount.toLocaleString('es-AR')}${listenerCountries > 0 ? ` · ${listenerCountries} países` : ''}` : 'En vivo';
  const playbackText = playbackError || (isPlaying ? 'Reproduciendo' : streamReady ? 'Lista para escuchar' : 'Conectando señal');

  return (
    <View style={styles.listenScreen}>
      <View style={styles.warmAura} />
      <View style={styles.listenHeader}>
        <View style={styles.brandLockup}><Text style={styles.wordmark}>MARANATA</Text><Text style={styles.frequency}>FM 89.3</Text></View>
        <View style={styles.signalMark}><View style={[styles.signalDot, isOnline && styles.signalDotActive]} /></View>
      </View>

      <View style={styles.listenBody}>
        <Animated.View style={[styles.radioConsole, { transform: [{ scale: consoleScale }] }]}> 
          <Text style={styles.consoleFrequency}>89.3</Text>
          <Text style={styles.consoleLabel}>Radio Maranata</Text>
          <Text style={styles.consoleStatus}>{playbackText}</Text>
          <View style={styles.playArea}>
            <Animated.View style={[styles.playHalo, { opacity: isPlaying ? haloOpacity : 0, transform: [{ scale: haloScale }] }]} />
            <Animated.View style={{ transform: [{ scale: pressScale }] }}>
              <Pressable accessibilityLabel={buttonLabel} accessibilityRole="button" disabled={!streamReady || isLoading} onPress={playbackStatus === 'error' ? onRetry : onToggle} onPressIn={() => Animated.spring(pressScale, { toValue: tokens.motion.pressScale, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start()} style={[styles.playButton, (!streamReady || isLoading) && styles.playButtonDisabled]}>
                {isLoading ? <ActivityIndicator color={colors.bg} /> : <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={colors.bg} />}
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
        <Text style={styles.programName}>OYENTES</Text>
        <Text style={styles.listenersText}>{listenerText}</Text>
      </View>
    </View>
  );
}

type ScheduleProps = { history: Song[]; currentTrack: Song; isPlaying: boolean; onGoToListen: () => void };
function ScheduleScreen({ history, currentTrack, isPlaying, onGoToListen }: ScheduleProps) {
  const songs = history.length ? history.slice(0, 6) : [{ title: 'Esperando historial musical', artist: 'Radio Maranata', time: '--:--' }];
  return <ScrollView contentContainerStyle={styles.contentScreen} showsVerticalScrollIndicator={false}>
    <Text style={styles.screenEyebrow}>SEÑAL / HISTORIAL</Text><Text style={styles.screenTitle}>Tracks</Text><Text style={styles.screenLead}>Lo mínimo útil: el tema actual y las canciones recientes.</Text>
    <View style={styles.signalPanel}><View style={styles.signalHeader}><View style={styles.nowScheduleLiveDot} /><Text style={styles.nowScheduleLabel}>{isPlaying ? 'SONANDO AHORA' : 'RADIO DISPONIBLE'}</Text></View><Text style={styles.signalTitle} numberOfLines={2}>{currentTrack.title}</Text><Text style={styles.signalArtist} numberOfLines={1}>{currentTrack.artist}</Text><Pressable onPress={onGoToListen} accessibilityRole="button" style={styles.signalAction}><Ionicons name="radio-outline" size={17} color={colors.bg} /><Text style={styles.signalActionText}>Abrir radio</Text></Pressable></View>
    <View style={styles.historyHeader}><Text style={styles.sectionTitle}>Recientes</Text><Text style={styles.historyMeta}>Auto</Text></View><View style={styles.trackList}>{songs.map((song, index) => <View key={`${song.title}-${index}`} style={styles.trackRow}><Text style={styles.trackIndex}>{String(index + 1).padStart(2, '0')}</Text><View style={styles.songCopy}><Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text><Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text></View><Text style={styles.songTime}>{song.time}</Text></View>)}</View>
  </ScrollView>;
}

function ChurchScreen() {
  return <ScrollView contentContainerStyle={styles.contentScreen} showsVerticalScrollIndicator={false}>
    <Text style={styles.screenEyebrow}>COMUNIDAD</Text><Text style={styles.screenTitle}>Iglesia</Text><Text style={styles.screenLead}>La base espiritual y comunitaria detrás de Radio Maranata.</Text>
    <View style={styles.infoSurface}><Ionicons name="heart-outline" size={22} color={colors.accent} /><Text style={styles.infoTitle}>Manantial de Avivamiento</Text><Text style={styles.infoText}>Conocé actividades, horarios y canales oficiales de la iglesia.</Text><Pressable accessibilityRole="link" onPress={() => Linking.openURL(churchWebsite)} style={styles.websiteButton}><Text style={styles.websiteText}>Visitar sitio web</Text><Ionicons name="arrow-up-outline" size={16} color={colors.accent} /></Pressable></View>
  </ScrollView>;
}

function BottomNavigation({ activeTab, isPlaying, onTabChange }: { activeTab: AppTab; isPlaying: boolean; onTabChange: (tab: AppTab) => void }) {
  const tabs: { id: AppTab; label: string; icon: 'albums-outline' | 'radio-outline' | 'heart-outline' }[] = [{ id: 'schedule', label: 'Tracks', icon: 'albums-outline' }, { id: 'listen', label: 'Radio', icon: 'radio-outline' }, { id: 'church', label: 'Iglesia', icon: 'heart-outline' }];
  return <View style={styles.navDock}>{tabs.map((tab) => <NavItem key={tab.id} tab={tab} active={activeTab === tab.id} isPlaying={isPlaying && tab.id === 'listen'} onPress={() => onTabChange(tab.id)} />)}</View>;
}

function NavItem({ tab, active, isPlaying, onPress }: { tab: { id: AppTab; label: string; icon: 'albums-outline' | 'radio-outline' | 'heart-outline' }; active: boolean; isPlaying: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return <Animated.View style={[styles.navItem, { transform: [{ scale }] }]}><Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} aria-selected={active} accessibilityLabel={tab.label} onPress={onPress} onPressIn={() => Animated.spring(scale, { toValue: 0.985, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()} style={[styles.navTap, active && styles.navTapActive]}><View style={styles.navIconWrap}><Ionicons name={tab.icon} size={tab.id === 'listen' ? 22 : 20} color={active ? colors.text : colors.textTertiary} />{isPlaying && <View style={styles.navPlayingDot} />}</View><Text style={[styles.navLabel, active && styles.navLabelActive]}>{tab.label}</Text></Pressable></Animated.View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  listenScreen: { flex: 1, paddingHorizontal: tokens.space[3], paddingTop: tokens.space[3], paddingBottom: 104, justifyContent: 'space-between', backgroundColor: colors.bg, overflow: 'hidden' },
  warmAura: { position: 'absolute', top: -90, right: -150, width: 320, height: 320, borderRadius: tokens.radius.pill, backgroundColor: 'rgba(241,199,107,0.055)' },
  listenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: tokens.space[2] },
  brandLockup: { flex: 1 },
  wordmark: { color: colors.text, fontFamily: fonts.display, fontSize: 28, lineHeight: 30, fontWeight: '700', letterSpacing: 0 },
  frequency: { color: colors.textTertiary, fontFamily: fonts.monoSemi, fontSize: 11, marginTop: 4 },
  signalMark: { width: 34, height: 34, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.026)' },
  signalDot: { width: 7, height: 7, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary },
  signalDotActive: { backgroundColor: colors.accent },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: tokens.radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  livePillActive: { backgroundColor: colors.liveSoft, borderColor: 'rgba(255,77,46,0.34)' },
  liveDot: { width: 7, height: 7, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary, marginRight: 7 },
  liveDotActive: { backgroundColor: colors.live },
  liveText: { color: colors.text, fontFamily: fonts.monoSemi, fontSize: 11 },
  listenBody: { flex: 1, justifyContent: 'center', paddingTop: tokens.space[2] },
  radioConsole: { width: '100%', minHeight: 328, borderRadius: tokens.radius.panel, alignItems: 'center', justifyContent: 'center', padding: tokens.space[3], backgroundColor: colors.bgElevated, overflow: 'hidden', borderColor: colors.line, borderWidth: 1, boxShadow: tokens.shadow.artwork },
  consoleHeader: { position: 'absolute', top: tokens.space[3], left: tokens.space[3], flexDirection: 'row', alignItems: 'center' },
  consoleStatus: { color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 13, marginTop: 10, textAlign: 'center' },
  consoleFrequency: { color: colors.text, fontFamily: fonts.display, fontSize: 78, lineHeight: 80, fontWeight: '700', textAlign: 'center' },
  consoleLabel: { color: colors.textSecondary, fontFamily: fonts.bodySemi, fontSize: 17, marginTop: 4, textAlign: 'center' },
  artwork: { width: '100%', minHeight: 318, borderRadius: tokens.radius.panel, justifyContent: 'flex-end', padding: tokens.space[3], backgroundColor: colors.bgElevated, overflow: 'hidden', borderColor: colors.line, borderWidth: 1, boxShadow: tokens.shadow.artwork },
  artworkBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#14100C' },
  artworkGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.accentSoft },
  artworkImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.58 },
  artworkShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.34)' },
  artworkTopline: { position: 'absolute', top: tokens.space[3], left: tokens.space[3], color: colors.live, fontFamily: fonts.monoSemi, fontSize: 12 },
  artworkFrequency: { color: colors.text, fontFamily: fonts.display, fontSize: 82, lineHeight: 84, fontWeight: '700' },
  artworkLabel: { color: colors.textSecondary, fontFamily: fonts.monoSemi, fontSize: 12, marginTop: 2 },
  equalizer: { position: 'absolute', top: tokens.space[3], right: tokens.space[3], flexDirection: 'row', alignItems: 'center', height: 42, gap: 5, paddingHorizontal: 10, borderRadius: tokens.radius.pill, backgroundColor: 'rgba(255,255,255,0.035)' },
  equalizerBar: { width: 4, height: 34, borderRadius: tokens.radius.pill, backgroundColor: colors.accent },
  trackInfo: { alignItems: 'center', marginTop: tokens.space[3], minHeight: 82, justifyContent: 'center' },
  trackKicker: { color: colors.live, fontFamily: fonts.monoSemi, fontSize: 12, marginBottom: 10 },
  trackTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 26, lineHeight: 31, fontWeight: '700', textAlign: 'center' },
  trackArtist: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 15, marginTop: 7, textAlign: 'center' },
  programName: { color: colors.textTertiary, fontFamily: fonts.monoSemi, fontSize: 11, marginRight: 10 },
  playArea: { width: 108, height: 108, marginTop: tokens.space[4], alignItems: 'center', justifyContent: 'center' },
  playHalo: { position: 'absolute', width: 104, height: 104, borderRadius: tokens.radius.pill, backgroundColor: colors.accentGlow },
  playButton: { width: 84, height: 84, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, boxShadow: '0px 8px 16px rgba(241,199,107,0.14)' },
  playButtonDisabled: { opacity: 0.46 },
  listenersRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', paddingHorizontal: tokens.space[2], backgroundColor: 'transparent' },
  listenersText: { flexShrink: 1, color: colors.textSecondary, fontFamily: fonts.bodySemi, fontSize: 13, marginRight: 8 },
  contentScreen: { paddingHorizontal: tokens.space[3], paddingTop: tokens.space[6], paddingBottom: 200, backgroundColor: colors.bg, minHeight: '100%' },
  screenEyebrow: { color: colors.live, fontFamily: fonts.monoSemi, fontSize: 12, marginBottom: 8 },
  screenTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 40, lineHeight: 43 },
  screenLead: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: tokens.space[2] },
  dayPicker: { gap: 8, paddingVertical: tokens.space[5] },
  dayButton: { minWidth: 50, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.pill, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1 },
  dayButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayLabel: { color: colors.textSecondary, fontFamily: fonts.monoSemi, fontSize: 12 },
  dayLabelActive: { color: colors.bg },
  infoSurface: { borderRadius: tokens.radius.card, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, padding: tokens.space[3] },
  infoTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 23, marginTop: 16 },
  infoText: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 8 },
  infoAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: tokens.space[3] },
  infoActionText: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 14 },
  websiteButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tokens.space[4], paddingTop: tokens.space[3], borderTopColor: colors.line, borderTopWidth: 1 },
  websiteText: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 14 },
  signalPanel: { borderRadius: tokens.radius.panel, backgroundColor: colors.bgElevated, borderColor: colors.line, borderWidth: 1, padding: tokens.space[3], marginTop: tokens.space[4], marginBottom: tokens.space[4], boxShadow: '0px 18px 42px rgba(0,0,0,0.18)' },
  signalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.space[4] },
  signalTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 30, lineHeight: 34 },
  signalArtist: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 15, marginTop: 8 },
  signalAction: { alignSelf: 'flex-start', minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.accent, paddingHorizontal: tokens.space[2], marginTop: tokens.space[4] },
  signalActionText: { color: colors.bg, fontFamily: fonts.bodySemi, fontSize: 13 },
  historyHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 },
  historyMeta: { color: colors.textTertiary, fontFamily: fonts.mono, fontSize: 11 },
  trackList: { borderRadius: tokens.radius.card, backgroundColor: 'rgba(255,255,255,0.028)', overflow: 'hidden' },
  trackRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: tokens.space[2], borderBottomColor: colors.line, borderBottomWidth: 1 },
  trackIndex: { width: 34, color: colors.textTertiary, fontFamily: fonts.monoSemi, fontSize: 11 },
  nowScheduleCard: { borderRadius: tokens.radius.panel, backgroundColor: colors.surfaceStrong, borderColor: colors.line, borderWidth: 1, padding: tokens.space[3], marginTop: tokens.space[2], marginBottom: tokens.space[5] },
  nowScheduleHeader: { flexDirection: 'row', alignItems: 'center' },
  nowScheduleLiveDot: { width: 8, height: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.live, marginRight: 8 },
  nowScheduleLabel: { flex: 1, color: colors.textSecondary, fontFamily: fonts.monoSemi, fontSize: 12 },
  nowScheduleAction: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 5 },
  nowScheduleActionText: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 12 },
  nowScheduleProgram: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 25, marginTop: tokens.space[4] },
  nowScheduleTrack: { color: colors.textSecondary, fontFamily: fonts.bodySemi, fontSize: 15, marginTop: tokens.space[3] },
  nowScheduleArtist: { color: colors.textTertiary, fontFamily: fonts.body, fontSize: 13, marginTop: 4 },
  scheduleSectionLabel: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: tokens.space[3] },
  scheduleSectionTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 22 },
  scheduleSectionMeta: { color: colors.textTertiary, fontFamily: fonts.mono, fontSize: 12 },
  scheduleEmpty: { alignItems: 'center', borderRadius: tokens.radius.card, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, padding: tokens.space[3] },
  scheduleEmptyIcon: { width: 46, height: 46, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSoft },
  scheduleEmptyTitle: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 16, marginTop: tokens.space[2], textAlign: 'center' },
  scheduleEmptyText: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: 6, textAlign: 'center' },
  programTimeline: { gap: tokens.space[2], marginBottom: tokens.space[4] },
  programHighlight: { flexDirection: 'row', alignItems: 'center', borderRadius: tokens.radius.card, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, padding: tokens.space[3], marginBottom: tokens.space[2] },
  programHighlightLive: { backgroundColor: colors.liveSoft, borderColor: 'rgba(255,77,46,0.30)' },
  programStateDot: { width: 9, height: 9, borderRadius: tokens.radius.pill, backgroundColor: colors.accent, marginRight: 12 },
  programStateDotLive: { backgroundColor: colors.live },
  programHighlightCopy: { flex: 1 },
  programHighlightLabel: { color: colors.textTertiary, fontFamily: fonts.monoSemi, fontSize: 11 },
  programHighlightName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 16, marginTop: 4 },
  programHighlightTime: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 13, marginTop: 3 },
  programRow: { flexDirection: 'row', minHeight: 58, alignItems: 'flex-start' },
  programRowTime: { width: 54, color: colors.textTertiary, fontFamily: fonts.mono, fontSize: 12 },
  programRowRail: { width: 22, alignItems: 'center' },
  programRowDot: { width: 8, height: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.accent },
  programRowCopy: { flex: 1, paddingBottom: tokens.space[2], borderBottomWidth: 1, borderBottomColor: colors.line },
  programRowName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 15 },
  programRowMeta: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 19, marginTop: tokens.space[2], marginBottom: tokens.space[2] },
  listSurface: { borderRadius: tokens.radius.card, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, overflow: 'hidden' },
  songRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: tokens.space[2], borderBottomColor: colors.line, borderBottomWidth: 1 },
  songTime: { width: 58, color: colors.accent, fontFamily: fonts.monoSemi, fontSize: 12 },
  songCopy: { flex: 1 },
  songTitle: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 14 },
  songArtist: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  navDock: { position: 'absolute', left: 18, right: 18, bottom: 14, minHeight: 60, flexDirection: 'row', alignItems: 'center', borderRadius: 22, backgroundColor: 'rgba(11,12,14,0.86)', borderColor: 'rgba(255,255,255,0.045)', borderWidth: 1, boxShadow: '0px 10px 26px rgba(0,0,0,0.14)', paddingHorizontal: 6, paddingVertical: 6 },
  navItem: { flex: 1 },
  navRadioItem: { marginTop: 0, marginBottom: 0 },
  navTap: { minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 17 },
  navTapActive: { backgroundColor: 'rgba(241,199,107,0.12)' },
  navIconWrap: { width: 24, height: 22, alignItems: 'center', justifyContent: 'center' },
  navPlayingDot: { position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: tokens.radius.pill, backgroundColor: colors.live },
  navRadioLive: { width: 36, height: 30, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.liveSoft },
  navLabel: { color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 11 },
  navLabelActive: { color: colors.text, fontFamily: fonts.bodySemi },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.58)' },
  sheet: { maxHeight: '72%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.bgElevated, borderColor: colors.line, borderWidth: 1, paddingHorizontal: tokens.space[4], paddingTop: 12, paddingBottom: tokens.space[4] },
  sheetHandle: { width: 38, height: 4, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary, alignSelf: 'center' },
  sheetTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 26, marginTop: tokens.space[4] },
  sheetSummary: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15, marginTop: 6, marginBottom: tokens.space[4] },
  sheetEmpty: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, paddingVertical: tokens.space[3] },
  countryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 62 },
  flag: { fontSize: 21, marginRight: 12 },
  countryCopy: { flex: 1 },
  countryName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 15 },
  cityName: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  countryCount: { color: colors.accent, fontFamily: fonts.monoSemi, fontSize: 15 },
  closeSheetButton: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.pill, backgroundColor: colors.surfaceStrong, marginTop: tokens.space[3] },
  closeSheetText: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 15 },
});

const legacyStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg }, safeArea: { flex: 1 }, screen: { flex: 1 }, loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  listenScreen: { flex: 1, paddingHorizontal: tokens.space[4], paddingTop: tokens.space[3], paddingBottom: 104, justifyContent: 'space-between', backgroundColor: colors.bg, overflow: 'hidden' },
  warmAura: { position: 'absolute', top: 80, alignSelf: 'center', width: 360, height: 360, borderRadius: tokens.radius.pill, backgroundColor: 'rgba(232,194,122,0.06)' },
  listenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, wordmark: { color: colors.text, fontFamily: fonts.display, fontSize: 30, fontWeight: '700' }, frequency: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 13, marginTop: 2 },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: tokens.radius.pill, paddingHorizontal: 12, paddingVertical: 8 }, liveDot: { width: 7, height: 7, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary, marginRight: 7 }, liveDotActive: { backgroundColor: colors.accent }, liveText: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 12 },
  listenBody: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingTop: tokens.space[2] }, artwork: { width: 244, height: 244, borderRadius: tokens.radius.card, justifyContent: 'flex-end', padding: tokens.space[3], backgroundColor: '#201B1A', overflow: 'hidden', boxShadow: tokens.shadow.artwork }, artworkGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(232,194,122,0.14)' }, artworkImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' }, artworkFrequency: { color: colors.text, fontFamily: fonts.display, fontSize: 58, fontWeight: '700' }, artworkLabel: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 11, marginTop: 4 },
  equalizer: { position: 'absolute', top: tokens.space[3], right: tokens.space[3], flexDirection: 'row', alignItems: 'center', height: 36, gap: 4 }, equalizerBar: { width: 4, height: 34, borderRadius: tokens.radius.pill, backgroundColor: colors.accent },
  trackInfo: { alignItems: 'center', marginTop: tokens.space[4], minHeight: 104, justifyContent: 'center' }, trackTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 27, lineHeight: 33, fontWeight: '600', textAlign: 'center' }, trackArtist: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 16, marginTop: 8 }, programName: { color: colors.textTertiary, fontFamily: fonts.body, fontSize: 13, marginTop: 16 },
  playArea: { width: 112, height: 112, marginTop: tokens.space[3], alignItems: 'center', justifyContent: 'center' }, playHalo: { position: 'absolute', width: 100, height: 100, borderRadius: tokens.radius.pill, backgroundColor: colors.accentGlow }, playButton: { width: 80, height: 80, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, boxShadow: '0px 8px 20px rgba(232,194,122,0.22)' }, playButtonDisabled: { opacity: 0.46 },
  listenersRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingHorizontal: tokens.space[2], backgroundColor: colors.surface, borderRadius: tokens.radius.pill }, listenersText: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 13, marginRight: 8 },
  contentScreen: { paddingHorizontal: tokens.space[4], paddingTop: tokens.space[6], paddingBottom: 200, backgroundColor: colors.bg, minHeight: '100%' }, screenEyebrow: { color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 12, marginBottom: 6 }, screenTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 34 }, screenLead: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: tokens.space[2] },
  dayPicker: { gap: 8, paddingVertical: tokens.space[5] }, dayButton: { minWidth: 50, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.pill, backgroundColor: colors.surface }, dayButtonActive: { backgroundColor: colors.accent }, dayLabel: { color: colors.textSecondary, fontFamily: fonts.bodySemi, fontSize: 13 }, dayLabelActive: { color: colors.bg },
  infoSurface: { borderRadius: tokens.radius.card, backgroundColor: colors.surface, padding: tokens.space[3] }, infoTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '600', fontSize: 19, marginTop: 16 }, infoText: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 8 }, infoAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: tokens.space[3] }, infoActionText: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 14 }, nowScheduleCard: { borderRadius: tokens.radius.card, backgroundColor: colors.surfaceStrong, padding: tokens.space[3], marginTop: tokens.space[2], marginBottom: tokens.space[5] }, nowScheduleHeader: { flexDirection: 'row', alignItems: 'center' }, nowScheduleLiveDot: { width: 8, height: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.accent, marginRight: 8 }, nowScheduleLabel: { flex: 1, color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 13 }, nowScheduleAction: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 5 }, nowScheduleActionText: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 12 }, nowScheduleProgram: { color: colors.text, fontFamily: fonts.display, fontWeight: '600', fontSize: 22, marginTop: tokens.space[4] }, nowScheduleTrack: { color: colors.textSecondary, fontFamily: fonts.bodySemi, fontSize: 15, marginTop: tokens.space[3] }, nowScheduleArtist: { color: colors.textTertiary, fontFamily: fonts.body, fontSize: 13, marginTop: 4 }, scheduleSectionLabel: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: tokens.space[3] }, scheduleSectionTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '600', fontSize: 20 }, scheduleSectionMeta: { color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 13 }, scheduleEmpty: { alignItems: 'center', borderRadius: tokens.radius.card, backgroundColor: colors.surface, padding: tokens.space[4], marginBottom: tokens.space[5] }, scheduleEmptyIcon: { width: 48, height: 48, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentGlow }, scheduleEmptyTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '600', fontSize: 18, textAlign: 'center', marginTop: tokens.space[3] }, scheduleEmptyText: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: tokens.space[2] }, programHighlight: { flexDirection: 'row', alignItems: 'center', minHeight: 96, borderRadius: tokens.radius.card, backgroundColor: colors.surface, padding: tokens.space[3], marginBottom: tokens.space[2] }, programHighlightLive: { backgroundColor: colors.surfaceStrong }, programStateDot: { width: 8, height: 8, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary, marginRight: 16 }, programStateDotLive: { backgroundColor: colors.accent }, programHighlightCopy: { flex: 1 }, programHighlightLabel: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 13 }, programHighlightName: { color: colors.text, fontFamily: fonts.display, fontWeight: '600', fontSize: 19, marginTop: 5 }, programHighlightTime: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 13, marginTop: 5 }, programTimeline: { marginTop: tokens.space[4] }, programRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center' }, programRowTime: { width: 56, color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 13 }, programRowRail: { width: 20, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.surfaceStrong }, programRowDot: { width: 7, height: 7, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary }, programRowCopy: { flex: 1, paddingLeft: 16 }, programRowName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 15 }, programRowMeta: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 12, marginTop: 4 }, sectionTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '600', fontSize: 20, marginTop: tokens.space[10], marginBottom: tokens.space[3] }, listSurface: { borderRadius: tokens.radius.card, backgroundColor: colors.surface, overflow: 'hidden' }, songRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: tokens.space[3] }, songTime: { width: 56, color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 12 }, songCopy: { flex: 1 }, songTitle: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 14 }, songArtist: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  websiteButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tokens.space[4], paddingTop: tokens.space[3] }, websiteText: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 14 },
  miniPlayer: { position: 'absolute', left: 16, right: 16, bottom: 92, minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: tokens.radius.card, backgroundColor: 'rgba(24,24,30,0.88)', boxShadow: tokens.shadow.floating }, miniOpenArea: { flex: 1, minHeight: 60, flexDirection: 'row', alignItems: 'center' }, miniArtwork: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceStrong, marginRight: 12 }, miniCopy: { flex: 1 }, miniTitle: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 13 }, miniArtist: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 11, marginTop: 3 }, miniButton: { width: 44, height: 44, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent },
  navDock: { position: 'absolute', left: 16, right: 16, bottom: 12, minHeight: 68, flexDirection: 'row', borderRadius: tokens.radius.pill, backgroundColor: 'rgba(28,28,34,0.76)', boxShadow: tokens.shadow.floating, paddingHorizontal: 8 }, navItem: { flex: 1 }, navRadioItem: { marginTop: -12, marginBottom: 4 }, navTap: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 3 }, navRadioLive: { width: 34, height: 30, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentGlow }, navLabel: { color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 11 }, navLabelActive: { color: colors.accent, fontFamily: fonts.bodySemi },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }, sheet: { maxHeight: '72%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#1B1B22', paddingHorizontal: tokens.space[4], paddingTop: 12, paddingBottom: tokens.space[4] }, sheetHandle: { width: 38, height: 4, borderRadius: tokens.radius.pill, backgroundColor: colors.textTertiary, alignSelf: 'center' }, sheetTitle: { color: colors.text, fontFamily: fonts.display, fontWeight: '700', fontSize: 24, marginTop: tokens.space[4] }, sheetSummary: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15, marginTop: 6, marginBottom: tokens.space[4] }, sheetEmpty: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, paddingVertical: tokens.space[3] }, countryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 62 }, flag: { fontSize: 21, marginRight: 12 }, countryCopy: { flex: 1 }, countryName: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 15 }, cityName: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 12, marginTop: 2 }, countryCount: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 15 }, closeSheetButton: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.pill, backgroundColor: colors.surfaceStrong, marginTop: tokens.space[3] }, closeSheetText: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 15 },
});
