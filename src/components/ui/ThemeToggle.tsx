import { Moon, Smartphone, Sun, type LucideIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ThemeMode, useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type ModeIcon = LucideIcon;

const options: { mode: ThemeMode; icon: ModeIcon; label: string; caption?: string }[] = [
  { mode: 'light', icon: Sun, label: 'Claro' },
  { mode: 'dark', icon: Moon, label: 'Oscuro' },
  { mode: 'system', icon: Smartphone, label: 'Automático', caption: 'Sigue el tema del dispositivo' },
];

const modeIcon: Record<ThemeMode, ModeIcon> = {
  light: Sun,
  dark: Moon,
  system: Smartphone,
};

const CLOSED_HEIGHT = tokens.height.minTouch;
const CLOSED_WIDTH = CLOSED_HEIGHT;
const PANEL_WIDTH = 208;
const PANEL_HEADER_HEIGHT = 36;
const PANEL_HEIGHT = PANEL_HEADER_HEIGHT + CLOSED_HEIGHT * 2 + 64 + tokens.space.xs * 2;

// One button, one shape: the panel is anchored on the exact same corner as
// the trigger and starts scaled down to its footprint, so it reads as the
// circle itself stretching open — not a second element popping in.
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
      Animated.spring(progress, { toValue, useNativeDriver: true, friction: 9, tension: 60 }).start();
    } else {
      Animated.timing(progress, { toValue, duration: tokens.motion.duration.slow, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start(onDone);
    }
  };

  const toggle = () => (open ? animateTo(0, () => setOpen(false)) : (setOpen(true), animateTo(1)));

  const selectOption = (nextMode: ThemeMode, event: GestureResponderEvent) => {
    event.stopPropagation();
    setMode(nextMode);
    animateTo(0, () => setOpen(false));
  };

  // Independent X/Y scale: at rest the panel's footprint exactly matches the
  // trigger capsule (same corner, same size), so it looks like one shape.
  const scaleX = progress.interpolate({ inputRange: [0, 1], outputRange: [CLOSED_WIDTH / PANEL_WIDTH, 1] });
  const scaleY = progress.interpolate({ inputRange: [0, 1], outputRange: [CLOSED_HEIGHT / PANEL_HEIGHT, 1] });
  const panelOpacity = progress.interpolate({ inputRange: [0, 0.2], outputRange: [0, 1], extrapolate: 'clamp' });
  const optionsOpacity = progress.interpolate({ inputRange: [0.55, 1], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <View style={styles.anchor}>
      <View pointerEvents={open ? 'auto' : 'none'} style={styles.panelHit}>
        <Pressable accessibilityLabel="Cerrar selector de tema" onPress={toggle} style={styles.panelTap}>
          <Animated.View
            style={[
              styles.panel,
              {
                backgroundColor: colors.muted,
                opacity: panelOpacity,
                transform: [{ scaleX }, { scaleY }],
                transformOrigin: 'top right',
              } as never,
            ]}
          >
            <Animated.View style={[styles.options, { opacity: optionsOpacity }]}>
              {options.map((option) => {
                const selected = option.mode === mode;
                return (
                  <Pressable
                    key={option.mode}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={(event) => selectOption(option.mode, event)}
                    style={[styles.row, option.caption && styles.rowWithCaption]}
                  >
                    <AppIcon icon={option.icon} size={tokens.icon.sm} color={selected ? colors.accent : colors.foregroundSubtle} />
                    <View style={styles.rowCopy}>
                      <AppText variant="label" tone={selected ? 'accent' : 'foreground'}>{option.label}</AppText>
                      {option.caption && <AppText variant="caption" tone="subtle">{option.caption}</AppText>}
                    </View>
                    {selected && <View style={[styles.selectedDot, { backgroundColor: colors.accent }]} />}
                  </Pressable>
                );
              })}
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>

      <View style={[styles.trigger, { backgroundColor: colors.muted }, open && styles.triggerOpen]}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${open ? 'Cerrar selector de tema' : `Tema: ${options.find((option) => option.mode === mode)?.label}. Tocar para elegir.`}`} onPress={toggle} style={styles.triggerTap}>
          <AppIcon icon={modeIcon[mode]} size={tokens.icon.sm} color={colors.foregroundSubtle} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { width: CLOSED_WIDTH, height: CLOSED_HEIGHT },
  trigger: { position: 'absolute', top: 0, right: 0, width: CLOSED_WIDTH, height: CLOSED_HEIGHT, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', zIndex: 2, elevation: 9 },
  triggerOpen: { top: tokens.space.xs, right: tokens.space.xs, width: PANEL_HEADER_HEIGHT, height: PANEL_HEADER_HEIGHT, backgroundColor: 'transparent' },
  triggerTap: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  panelHit: { position: 'absolute', top: 0, right: 0, width: PANEL_WIDTH, height: PANEL_HEIGHT, zIndex: 1, elevation: 8 },
  panelTap: { width: '100%', height: '100%' },
  panel: { width: '100%', height: '100%', borderRadius: tokens.radius.md, boxShadow: tokens.shadow.floating },
  options: { paddingTop: PANEL_HEADER_HEIGHT, paddingBottom: tokens.space.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm, minHeight: tokens.height.minTouch, paddingHorizontal: tokens.space.base },
  rowWithCaption: { minHeight: 64 },
  rowCopy: { flex: 1 },
  selectedDot: { width: 6, height: 6, borderRadius: tokens.radius.pill },
});
