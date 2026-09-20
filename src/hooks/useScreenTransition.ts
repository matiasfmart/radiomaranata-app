import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AppTab, bottomNavigationItems } from '../constants/navigation';
import { tokens } from '../theme/tokens';
import { useReducedMotion } from './useReducedMotion';

const tabOrder = bottomNavigationItems.map((tab) => tab.id);

// Directional slide: moving to a tab further right in the dock enters from
// the right, moving left enters from the left. Continuity, not a random fade.
// Falls back to a plain fade (no travel distance) under reduced motion.
export function useScreenTransition(tab: AppTab) {
  const reducedMotion = useReducedMotion();
  const screenTransition = useRef(new Animated.Value(1)).current;
  const previousIndex = useRef(tabOrder.indexOf(tab));
  const direction = useRef(1);

  useEffect(() => {
    const nextIndex = tabOrder.indexOf(tab);
    direction.current = nextIndex >= previousIndex.current ? 1 : -1;
    previousIndex.current = nextIndex;

    screenTransition.setValue(0);
    Animated.timing(screenTransition, {
      toValue: 1,
      duration: tokens.motion.screenDuration,
      useNativeDriver: true,
    }).start();
  }, [tab, screenTransition]);

  const travelDistance = reducedMotion ? 0 : direction.current * tokens.motion.distance.md;
  const transitionX = screenTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [travelDistance, 0],
  });

  return { screenTransition, transitionX };
}
