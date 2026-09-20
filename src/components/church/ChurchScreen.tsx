import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { appConfig } from '../../config/app';
import { copy } from '../../constants/copy';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppText } from '../ui/AppText';
import { Screen } from '../ui/Screen';
import { ScreenHeader } from '../ui/ScreenHeader';

export function ChurchScreen() {
  const { colors } = useTheme();
  return (
    <Screen scroll>
      <ScreenHeader eyebrow={copy.church.eyebrow} title={copy.church.title} lead={copy.church.lead} />

      <View style={[styles.infoSurface, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="heart-outline" size={tokens.icon.lg} color={colors.foreground} />
        <AppText variant="headline" style={styles.infoTitle}>{copy.church.name}</AppText>
        <AppText variant="body" tone="muted" style={styles.infoText}>{copy.church.description}</AppText>
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(appConfig.church.websiteUrl)} style={[styles.websiteButton, { borderTopColor: colors.border }]}>
          <AppText variant="label">{copy.church.websiteAction}</AppText>
          <Ionicons name="arrow-up-outline" size={tokens.icon.sm} color={colors.foreground} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoSurface: { borderRadius: tokens.radius.sm, borderWidth: 1, padding: tokens.space.lg, marginTop: tokens.space.xxl },
  infoTitle: { marginTop: tokens.space.base },
  infoText: { marginTop: tokens.space.sm },
  websiteButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tokens.space.lg, paddingTop: tokens.space.lg, borderTopWidth: 1, minHeight: tokens.height.minTouch },
});

