import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { appConfig } from '../../config/app';
import { copy } from '../../constants/copy';
import { tokens } from '../../theme/tokens';
import { AppText } from '../ui/AppText';
import { Screen } from '../ui/Screen';
import { ScreenHeader } from '../ui/ScreenHeader';

export function ChurchScreen() {
  return (
    <Screen scroll>
      <ScreenHeader eyebrow={copy.church.eyebrow} title={copy.church.title} lead={copy.church.lead} />

      <View style={styles.infoSurface}>
        <Ionicons name="heart-outline" size={tokens.icon.lg} color={tokens.color.foreground} />
        <AppText variant="headline" style={styles.infoTitle}>{copy.church.name}</AppText>
        <AppText variant="body" tone="muted" style={styles.infoText}>{copy.church.description}</AppText>
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(appConfig.church.websiteUrl)} style={styles.websiteButton}>
          <AppText variant="label">{copy.church.websiteAction}</AppText>
          <Ionicons name="arrow-up-outline" size={tokens.icon.sm} color={tokens.color.foreground} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoSurface: { borderRadius: tokens.radius.sm, backgroundColor: tokens.color.surface, borderColor: tokens.color.border, borderWidth: 1, padding: tokens.space.lg, marginTop: tokens.space.xxl },
  infoTitle: { marginTop: tokens.space.base },
  infoText: { marginTop: tokens.space.sm },
  websiteButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tokens.space.lg, paddingTop: tokens.space.lg, borderTopColor: tokens.color.border, borderTopWidth: 1, minHeight: tokens.height.minTouch },
});
