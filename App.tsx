import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { ChurchScreen } from './src/components/church/ChurchScreen';
import { BottomNavigation } from './src/components/navigation/BottomNavigation';
import { RadioScreen } from './src/components/radio/RadioScreen';
import { TracksScreen } from './src/components/tracks/TracksScreen';
import { AppTab } from './src/constants/navigation';
import { useAppFonts } from './src/hooks/useAppFonts';
import { useListenerHeartbeat } from './src/hooks/useListenerHeartbeat';
import { useNowPlaying } from './src/hooks/useNowPlaying';
import { useRadioPlayer } from './src/hooks/useRadioPlayer';
import { useScreenTransition } from './src/hooks/useScreenTransition';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const { colors, scheme } = useTheme();
  const fontsLoaded = useAppFonts();
  const [activeTab, setActiveTab] = useState<AppTab>('listen');
  const { currentTrack, history, isOnline, listenerCount, streamUrl } = useNowPlaying();
  const { isLoading, isPlaying, playbackError, playbackStatus, retryPlayback, togglePlayback } = useRadioPlayer(streamUrl);
  const listenerSnapshot = useListenerHeartbeat(isPlaying);
  const { screenTransition, transitionX } = useScreenTransition(activeTab);

  if (!fontsLoaded) {
    return <View style={[styles.loadingScreen, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.foreground} /></View>;
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.screen, { opacity: screenTransition, transform: [{ translateX: transitionX }] }]}>
          {activeTab === 'listen' && <RadioScreen currentTrack={currentTrack} isLoading={isLoading} isOnline={isOnline} isPlaying={isPlaying} playbackStatus={playbackStatus} playbackError={playbackError} listenerCount={listenerSnapshot.available ? listenerSnapshot.listeners : listenerCount} listenerCountries={listenerSnapshot.available ? listenerSnapshot.countries : 0} streamReady={Boolean(streamUrl)} onToggle={togglePlayback} onRetry={retryPlayback} />}
          {activeTab === 'schedule' && <TracksScreen history={history} currentTrack={currentTrack} isPlaying={isPlaying} onGoToListen={() => setActiveTab('listen')} />}
          {activeTab === 'church' && <ChurchScreen />}
        </Animated.View>
        <BottomNavigation activeTab={activeTab} isPlaying={isPlaying} onTabChange={setActiveTab} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

