import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ThemeMode, useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppText } from './AppText';

type ModeIcon = 'sunny-outline' | 'moon-outline' | 'phone-portrait-outline';

const options: { mode: ThemeMode; icon: ModeIcon; label: string; caption?: string }[] = [
  { mode: 'light', icon: 'sunny-outline', label: 'Claro' },
  { mode: 'dark', icon: 'moon-outline', label: 'Oscuro' },
  { mode: 'system', icon: 'phone-portrait-outline', label: 'Automático', caption: 'Sigue el tema del dispositivo' },
];

const modeIcon: Record<ThemeMode, ModeIcon> = {
  light: 'sunny-outline',
  dark: 'moon-outline',
  system: 'phone-portrait-outline',
};

const CLOSED_SIZE = tokens.height.minTouch;
const PANEL_WIDTH = 208;

// Same circle, same spot: it never leaves this component's own local
// overlay. No Modal, no separate window — just transform + opacity growing
// out of the button's own corner, and shrinking back into it.
export function ThemeToggle() {
  const { mode, colors, setMode } = useTheme();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue: number, onDone?: () => void) => {
    if (reducedMotion) {
      progress.setValue(toValue);
      onDone?.();
      return;
    }
    if (toValue === 1) {
      Animated.spring(progress, { toValue, useNativeDriver: true, friction: 8, tension: 90 }).start();
    } else {
      Animated.timing(progress, { toValue, duration: tokens.motion.duration.medium, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onDone);
    }
  };

  const toggle = () => (open ? animateTo(0, () => setOpen(false)) : (setOpen(true), animateTo(1)));

  const selectOption = (nextMode: ThemeMode, event: GestureResponderEvent) => {
    event.stopPropagation();
    setMode(nextMode);
    animateTo(0, () => setOpen(false));
  };

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });

  return (
    <View style={styles.anchor}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? 'Cerrar selector de tema' : `Tema: ${options.find((option) => option.mode === mode)?.label}. Tocar para elegir.`}
        onPress={toggle}
        style={[styles.trigger, { backgroundColor: colors.muted }]}
      >
        <Ionicons name={modeIcon[mode]} size={tokens.icon.sm} color={colors.foregroundSubtle} />
      </Pressable>

      {open && (
        <Animated.View
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: progress,
              transform: [{ scale }],
              transformOrigin: 'top right',
            } as never,
          ]}
        >
          {options.map((option) => {
            const selected = option.mode === mode;
            return (
              <Pressable
                key={option.mode}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={(event) => selectOption(option.mode, event)}
                style={styles.row}
              >
                <Ionicons name={option.icon} size={tokens.icon.sm} color={selected ? colors.accent : colors.foregroundSubtle} />
                <View style={styles.rowCopy}>
                  <AppText variant="label" tone={selected ? 'accent' : 'foreground'}>{option.label}</AppText>
                  {option.caption && <AppText variant="caption" tone="subtle">{option.caption}</AppText>}
                </View>
                {selected && <View style={[styles.selectedDot, { backgroundColor: colors.accent }]} />}
              </Pressable>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { width: CLOSED_SIZE, height: CLOSED_SIZE },
  trigger: { width: CLOSED_SIZE, height: CLOSED_SIZE, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center' },
  panel: { position: 'absolute', top: CLOSED_SIZE + tokens.space.xs, right: 0, width: PANEL_WIDTH, borderRadius: 22, borderWidth: 1, paddingVertical: tokens.space.xs, boxShadow: tokens.shadow.panel, zIndex: 50, elevation: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm, minHeight: tokens.height.minTouch, paddingHorizontal: tokens.space.base },
  rowCopy: { flex: 1 },
  selectedDot: { width: 6, height: 6, borderRadius: tokens.radius.pill },
});
