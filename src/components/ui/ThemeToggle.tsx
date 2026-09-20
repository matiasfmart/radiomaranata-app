import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';
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

// Options unfurl out of this same button and collapse back into it. No
// backdrop dimming, no layout shift — it never touches the screen underneath.
export function ThemeToggle() {
  const { mode, colors, setMode } = useTheme();
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchorTop, setAnchorTop] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue: number, onDone?: () => void) => {
    if (reducedMotion) {
      progress.setValue(toValue);
      onDone?.();
      return;
    }
    if (toValue === 1) {
      Animated.spring(progress, { toValue, useNativeDriver: true, friction: 7, tension: 90 }).start();
    } else {
      Animated.timing(progress, { toValue, duration: tokens.motion.duration.medium, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onDone);
    }
  };

  const openMenu = () => {
    triggerRef.current?.measureInWindow((_x, y, _width, height) => {
      setAnchorTop(y + height + tokens.space.xs);
      setOpen(true);
      animateTo(1);
    });
  };

  const closeMenu = () => animateTo(0, () => setOpen(false));

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <View>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityLabel={`Tema: ${options.find((option) => option.mode === mode)?.label}. Tocar para elegir.`}
        onPress={() => (open ? closeMenu() : openMenu())}
        style={[styles.trigger, { backgroundColor: colors.muted }]}
      >
        <Ionicons name={modeIcon[mode]} size={tokens.icon.sm} color={colors.foregroundSubtle} />
      </Pressable>

      <Modal transparent visible={open} animationType="none" onRequestClose={closeMenu}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
        <Animated.View
          style={[
            styles.menu,
            {
              top: anchorTop,
              right: tokens.screenMargin,
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
                onPress={() => { setMode(option.mode); closeMenu(); }}
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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: { width: tokens.height.minTouch, height: tokens.height.minTouch, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center' },
  menu: { position: 'absolute', width: 224, borderRadius: tokens.radius.md, borderWidth: 1, paddingVertical: tokens.space.xs, boxShadow: tokens.shadow.panel },
  row: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm, minHeight: tokens.height.minTouch, paddingHorizontal: tokens.space.base },
  rowCopy: { flex: 1 },
  selectedDot: { width: 6, height: 6, borderRadius: tokens.radius.pill },
});
