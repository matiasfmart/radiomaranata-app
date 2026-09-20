import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

type TransportButtonProps = {
  playing: boolean;
  loading: boolean;
  disabled: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

// The single most important control in the app. Icon morphs via crossfade +
// scale instead of swapping instantly, and pulses a halo while playing.
export function TransportButton({ playing, loading, disabled, accessibilityLabel, onPress }: TransportButtonProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const pressScale = useRef(new Animated.Value(1)).current;
  const haloPulse = useRef(new Animated.Value(0)).current;
  const iconMorph = useRef(new Animated.Value(playing ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) { haloPulse.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(haloPulse, { toValue: 1, duration: tokens.motion.duration.slow * 2, useNativeDriver: true }),
      Animated.timing(haloPulse, { toValue: 0, duration: tokens.motion.duration.slow * 2, useNativeDriver: true }),
    ]));
    if (playing) loop.start();
    else { loop.stop(); haloPulse.setValue(0); }
    return () => loop.stop();
  }, [haloPulse, playing, reducedMotion]);

  useEffect(() => {
    Animated.timing(iconMorph, {
      toValue: playing ? 1 : 0,
      duration: tokens.motion.duration.medium,
      useNativeDriver: true,
    }).start();
  }, [iconMorph, playing]);

  const haloScale = haloPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const haloOpacity = haloPulse.interpolate({ inputRange: [0, 1], outputRange: [0, 0.22] });
  const playOpacity = iconMorph.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const pauseOpacity = iconMorph.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const playScale = iconMorph.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] });
  const pauseScale = iconMorph.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <Animated.View style={styles.area}>
      <Animated.View style={[styles.halo, { backgroundColor: colors.accent, opacity: playing ? haloOpacity : 0, transform: [{ scale: haloScale }] }]} />
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => Animated.spring(pressScale, { toValue: tokens.motion.pressScale, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start()}
          style={[styles.button, { backgroundColor: colors.accent }, disabled && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color={colors.accentForeground} />
          ) : (
            <>
              <Animated.View style={[styles.iconLayer, { opacity: playOpacity, transform: [{ scale: playScale }] }]}>
                <Ionicons name="play" size={tokens.icon.lg} color={colors.accentForeground} />
              </Animated.View>
              <Animated.View style={[styles.iconLayer, { opacity: pauseOpacity, transform: [{ scale: pauseScale }] }]}>
                <Ionicons name="pause" size={tokens.icon.lg} color={colors.accentForeground} />
              </Animated.View>
            </>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  area: { width: tokens.height.buttonPrimary + 20, height: tokens.height.buttonPrimary + 20, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: tokens.height.buttonPrimary + 20, height: tokens.height.buttonPrimary + 20, borderRadius: tokens.radius.pill },
  button: { width: tokens.height.buttonPrimary, height: tokens.height.buttonPrimary, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', boxShadow: tokens.shadow.floating },
  buttonDisabled: { opacity: 0.46 },
  iconLayer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
