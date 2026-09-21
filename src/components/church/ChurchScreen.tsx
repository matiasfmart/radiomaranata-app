import { ExternalLink, Heart } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';
import { appConfig } from '../../config/app';
import { copy } from '../../constants/copy';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppIcon } from '../ui/AppIcon';
import { AppText } from '../ui/AppText';
import { BubblePressable } from '../ui/BubblePressable';
import { Screen } from '../ui/Screen';
import { ScreenHeader } from '../ui/ScreenHeader';

export function ChurchScreen() {
  const { colors } = useTheme();
  return (
    <Screen scroll>
      <ScreenHeader eyebrow={copy.church.eyebrow} title={copy.church.title} lead={copy.church.lead} />

      <View style={[styles.infoSurface, { backgroundColor: colors.surface }]}>
        <AppIcon icon={Heart} size={tokens.icon.lg} color={colors.foreground} />
        <AppText variant="headline" style={styles.infoTitle}>{copy.church.name}</AppText>
        <AppText variant="body" tone="muted" style={styles.infoText}>{copy.church.description}</AppText>
        <BubblePressable accessibilityRole="link" bubbleColor={colors.foregroundSubtle} onPress={() => Linking.openURL(appConfig.church.websiteUrl)} style={styles.websiteButton}>
          <AppText variant="label">{copy.church.websiteAction}</AppText>
          <AppIcon icon={ExternalLink} size={tokens.icon.sm} color={colors.foreground} />
        </BubblePressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoSurface: { borderRadius: tokens.radius.md, padding: tokens.space.lg, marginTop: tokens.space.xxl, boxShadow: tokens.shadow.panel },
  infoTitle: { marginTop: tokens.space.base },
  infoText: { marginTop: tokens.space.sm },
  websiteButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tokens.space.lg, paddingTop: tokens.space.lg, minHeight: tokens.height.minTouch },
});

