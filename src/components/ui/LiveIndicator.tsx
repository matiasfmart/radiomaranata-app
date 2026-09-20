import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { tokens } from '../../theme/tokens';
import { AppText } from './AppText';

type LiveIndicatorProps = {
  active: boolean;
  label: string;
  // Set false when this instance is orientation-only and another element on
  // the same screen already owns the accent (keeps one color moment/screen).
  colorize?: boolean;
};

// The one shared "is this on air" signal. Used identically in the Radio
// header and the Tracks status panel instead of two bespoke dot+label pairs.
export function LiveIndicator({ active, label, colorize = true }: LiveIndicatorProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: tokens.motion.duration.slow * 2, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: tokens.motion.duration.slow * 2, useNativeDriver: true }),
    ]));
    if (active) loop.start();
    else { loop.stop(); pulse.setValue(0); }
    return () => loop.stop();
  }, [active, pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] });
  const isAccented = active && colorize;

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.dot, isAccented && styles.dotActive, active && { opacity }]} />
      <AppText variant="label" tone={isAccented ? 'accent' : 'muted'}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm },
  dot: { width: 8, height: 8, borderRadius: tokens.radius.pill, backgroundColor: tokens.color.foregroundSubtle },
  dotActive: { backgroundColor: tokens.color.accent },
});
