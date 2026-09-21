import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppText } from './AppText';
import { BubblePressable } from './BubblePressable';

type ListItemProps = {
  index: string;
  title: string;
  subtitle: string;
  trailing: string;
};

// One row shape for every list in the app. Fixed height token, same
// left/right edges as everything else on screen.
export function ListItem({ index, title, subtitle, trailing }: ListItemProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <AppText variant="caption" tone="subtle" style={styles.index}>{index}</AppText>
      <View style={styles.copy}>
        <AppText variant="label" numberOfLines={1} style={styles.title}>{title}</AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>{subtitle}</AppText>
      </View>
      <AppText variant="caption" tone="subtle">{trailing}</AppText>
    </View>
  );
}

type PillButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

// The single secondary CTA shape used across screens ("Abrir radio", etc).
export function PillButton({ label, icon, onPress }: PillButtonProps) {
  const { colors } = useTheme();
  return (
    <BubblePressable accessibilityRole="button" bubbleColor={colors.accent} containerStyle={styles.pillContainer} onPress={onPress} style={[styles.pill, { backgroundColor: colors.accent }]}>
      {icon}
      <AppText variant="label" style={{ color: colors.accentForeground }}>{label}</AppText>
    </BubblePressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: tokens.height.listItem, flexDirection: 'row', alignItems: 'center', paddingHorizontal: tokens.space.base, borderBottomWidth: 1 },
  index: { width: 32 },
  copy: { flex: 1, paddingRight: tokens.space.base },
  title: { marginBottom: 2 },
  pillContainer: { alignSelf: 'flex-start' },
  pill: { height: tokens.height.buttonSecondary, flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm, borderRadius: tokens.radius.pill, paddingHorizontal: tokens.space.base },
});
