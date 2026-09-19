import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { appConfig } from '../../config/app';
import { copy } from '../../constants/copy';
import { tokens } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

const colors = tokens.color;
const fonts = fontFamilies;

export function ChurchScreen() {
  return <ScrollView contentContainerStyle={styles.contentScreen} showsVerticalScrollIndicator={false}>
    <Text style={styles.screenEyebrow}>{copy.church.eyebrow}</Text><Text style={styles.screenTitle}>{copy.church.title}</Text><Text style={styles.screenLead}>{copy.church.lead}</Text>
    <View style={styles.infoSurface}><Ionicons name="heart-outline" size={22} color={colors.foreground} /><Text style={styles.infoTitle}>{copy.church.name}</Text><Text style={styles.infoText}>{copy.church.description}</Text><Pressable accessibilityRole="link" onPress={() => Linking.openURL(appConfig.church.websiteUrl)} style={styles.websiteButton}><Text style={styles.websiteText}>{copy.church.websiteAction}</Text><Ionicons name="arrow-up-outline" size={16} color={colors.foreground} /></Pressable></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  contentScreen: { paddingHorizontal: tokens.space[3], paddingTop: tokens.space[6], paddingBottom: 200, backgroundColor: colors.background, minHeight: '100%' },
  screenEyebrow: { color: colors.foregroundSubtle, fontFamily: fonts.detail, fontSize: 11, marginBottom: 8 },
  screenTitle: { color: colors.foreground, fontFamily: fonts.display, fontWeight: '800', fontSize: 44, lineHeight: 46, letterSpacing: -1.1 },
  screenLead: { color: colors.mutedForeground, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: tokens.space[2] },
  infoSurface: { borderRadius: tokens.radius.card, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, padding: tokens.space[3] },
  infoTitle: { color: colors.foreground, fontFamily: fonts.title, fontWeight: '700', fontSize: 24, lineHeight: 26, letterSpacing: -0.55, marginTop: 16 },
  infoText: { color: colors.mutedForeground, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 8 },
  websiteButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tokens.space[4], paddingTop: tokens.space[3], borderTopColor: colors.border, borderTopWidth: 1 },
  websiteText: { color: colors.foreground, fontFamily: fonts.bodySemi, fontSize: 14 },
});
