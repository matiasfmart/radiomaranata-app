import { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { tokens } from '../../theme/tokens';

type BubblePressableProps = Omit<PressableProps, 'children' | 'onPressIn' | 'onPressOut' | 'style'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  bubbleColor: string;
};

// Shared tactile response: every actionable surface yields slightly, then
// releases a soft expanding halo from its own bounds.
export function BubblePressable({ children, style, containerStyle, bubbleColor, ...props }: BubblePressableProps) {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const halo = useRef(new Animated.Value(0)).current;

  const animatePress = (pressed: boolean) => {
    if (reducedMotion) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: pressed ? tokens.motion.pressScale : 1, friction: 7, tension: 70, useNativeDriver: true }),
      Animated.timing(halo, { toValue: pressed ? 1 : 0, duration: tokens.motion.duration.medium, useNativeDriver: true }),
    ]).start();
  };

  const haloScale = halo.interpolate({ inputRange: [0, 1], outputRange: [1, tokens.motion.bubbleScale] });
  const haloOpacity = halo.interpolate({ inputRange: [0, 1], outputRange: [0, tokens.motion.bubbleOpacity] });

  return (
    <Animated.View style={[styles.container, containerStyle, { transform: [{ scale }] }]}>
      <Animated.View pointerEvents="none" style={[styles.halo, { backgroundColor: bubbleColor, opacity: haloOpacity, transform: [{ scale: haloScale }] }]} />
      <Pressable {...props} onPressIn={() => animatePress(true)} onPressOut={() => animatePress(false)} style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  halo: { position: 'absolute', inset: 0, borderRadius: tokens.radius.pill },
});