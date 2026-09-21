import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppText } from './AppText';

type ChipProps = {
  label: string;
  tone?: 'neutral' | 'accent';
};

// Single small-status-tag primitive: fixed chip height token, no custom sizes.
export function Chip({ label, tone = 'neutral' }: ChipProps) {
  const { colors } = useTheme();
  const isAccent = tone === 'accent';
  return (
    <View style={[styles.chip, { backgroundColor: isAccent ? colors.accentMuted : colors.muted }]}>
      <View style={[styles.indicator, { backgroundColor: isAccent ? colors.accent : colors.foregroundSubtle }]} />
      <AppText variant="label" tone={isAccent ? 'foreground' : 'subtle'}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { height: tokens.height.buttonSecondary, flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.space.base },
  indicator: { width: 6, height: 6, borderRadius: tokens.radius.pill },
});
