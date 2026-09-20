import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { tokens } from '../theme/tokens';

// Fades text back in whenever its value changes, instead of swapping
// instantly (frequency, track title, listener count, etc).
export function useTextTransition(value: string | number) {
  const opacity = useRef(new Animated.Value(1)).current;
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: tokens.motion.duration.medium, useNativeDriver: true }).start();
  }, [opacity, value]);

  return opacity;
}
