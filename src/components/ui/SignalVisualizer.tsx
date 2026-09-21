import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

const BAR_HEIGHTS = [10, 20, 14, 28, 18, 34, 16, 24, 12];

type SignalVisualizerProps = {
  active: boolean;
};

// A quiet signal meter: it only animates when audio is actually playing,
// tying motion to the stream instead of treating it as decoration.
export function SignalVisualizer({ active }: SignalVisualizerProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const bars = useRef(BAR_HEIGHTS.map(() => new Animated.Value(0.32))).current;

  useEffect(() => {
    if (!active || reducedMotion) {
      bars.forEach((bar) => bar.stopAnimation(() => bar.setValue(active ? 0.5 : 0.2)));
      return;
    }

    const loops = bars.map((bar, index) => Animated.loop(Animated.sequence([
      Animated.timing(bar, {
        toValue: index % 2 === 0 ? 1 : 0.72,
        duration: tokens.motion.duration.slow + index * tokens.motion.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(bar, {
        toValue: index % 2 === 0 ? 0.42 : 0.24,
        duration: tokens.motion.duration.medium + index * tokens.motion.duration.fast,
        useNativeDriver: true,
      }),
    ])));
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [active, bars, reducedMotion]);

  return (
    <View accessibilityLabel={active ? 'Señal de audio activa' : 'Señal de audio detenida'} style={styles.meter}>
      {bars.map((bar, index) => (
        <Animated.View
          key={BAR_HEIGHTS[index]}
          style={[
            styles.bar,
            {
              height: BAR_HEIGHTS[index],
              backgroundColor: colors.accent,
              opacity: active ? 0.78 : 0.2,
              transform: [{ scaleY: bar }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  meter: { height: 40, flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm, overflow: 'hidden' },
  bar: { width: 3, borderRadius: tokens.radius.pill },
});