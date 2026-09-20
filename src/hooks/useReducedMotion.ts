import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Motion-heavy components check this instead of animating unconditionally.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
      if (isMounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value) => setReduced(value));
    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  }, []);

  return reduced;
}
