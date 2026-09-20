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
  return (
    <View style={[styles.chip, { backgroundColor: tone === 'accent' ? colors.accentMuted : colors.muted }]}>
      <AppText variant="caption" tone={tone === 'accent' ? 'accent' : 'subtle'}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { height: tokens.height.chip, borderRadius: tokens.radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: tokens.space.base },
});
