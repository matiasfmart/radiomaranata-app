import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

const nextMode = { light: 'dark', dark: 'system', system: 'light' } as const;
const modeIcon = { light: 'sunny-outline', dark: 'moon-outline', system: 'phone-portrait-outline' } as const;
const modeLabel = { light: 'Tema claro', dark: 'Tema oscuro', system: 'Tema automático' } as const;

// Cycles light -> dark -> system -> light. One tap, no submenu needed.
export function ThemeToggle() {
  const { mode, colors, setMode } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${modeLabel[mode]}. Tocar para cambiar.`}
      onPress={() => setMode(nextMode[mode])}
      style={[styles.button, { backgroundColor: colors.muted }]}
    >
      <Ionicons name={modeIcon[mode]} size={tokens.icon.sm} color={colors.foregroundSubtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: tokens.height.minTouch, height: tokens.height.minTouch, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center' },
});
