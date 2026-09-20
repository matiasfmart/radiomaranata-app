import { StyleSheet, View } from 'react-native';
import { tokens } from '../../theme/tokens';
import { AppText } from './AppText';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  lead: string;
};

// Tracks and Church repeated this exact block. One component, one place
// to keep both screens on the same vertical rhythm.
export function ScreenHeader({ eyebrow, title, lead }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <AppText variant="caption" tone="subtle">{eyebrow}</AppText>
      <AppText variant="display" style={styles.title}>{title}</AppText>
      <AppText variant="body" tone="muted" style={styles.lead}>{lead}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: tokens.space.xs },
  title: { marginTop: tokens.space.sm },
  lead: { marginTop: tokens.space.sm },
});
