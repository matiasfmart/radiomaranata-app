import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { tokens } from '../theme/tokens';

export function useScreenTransition(dependency: unknown) {
  const screenTransition = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    screenTransition.setValue(0);
    Animated.sequence([
      Animated.delay(tokens.motion.screenDelay),
      Animated.timing(screenTransition, { toValue: 1, duration: tokens.motion.screenDuration, useNativeDriver: true }),
    ]).start();
  }, [dependency, screenTransition]);

  const transitionY = screenTransition.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return { screenTransition, transitionY };
}
