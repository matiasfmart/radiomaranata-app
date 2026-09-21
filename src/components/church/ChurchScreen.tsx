import { Camera, CirclePlay, Clock, ExternalLink, Heart, MapPin, MessageCircle, Music2, Phone, Radio, type LucideIcon, ThumbsUp, Users } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';
import { appConfig } from '../../config/app';
import { copy } from '../../constants/copy';
import { ListenerSnapshot } from '../../services/listeners';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppIcon } from '../ui/AppIcon';
import { AppText } from '../ui/AppText';
import { BubblePressable } from '../ui/BubblePressable';
import { Screen } from '../ui/Screen';
import { ScreenHeader } from '../ui/ScreenHeader';

type ChurchScreenProps = {
  listenerSnapshot: ListenerSnapshot;
};

const socialIcons: Record<string, LucideIcon> = {
  Instagram: Camera,
  YouTube: CirclePlay,
  Facebook: ThumbsUp,
  TikTok: Music2,
  'Canal de WhatsApp': MessageCircle,
};

type ActionRowProps = {
  icon: typeof MapPin;
  label: string;
  detail?: string;
  url: string;
};

function ActionRow({ icon, label, detail, url }: ActionRowProps) {
  const { colors } = useTheme();
  return (
    <BubblePressable accessibilityRole="link" bubbleColor={colors.foregroundSubtle} onPress={() => Linking.openURL(url)} style={styles.actionRow}>
      <AppIcon icon={icon} size={tokens.icon.md} color={colors.foreground} />
      <View style={styles.actionCopy}>
        <AppText variant="label">{label}</AppText>
        {detail && <AppText variant="caption" tone="muted" numberOfLines={2}>{detail}</AppText>}
      </View>
      <AppIcon icon={ExternalLink} size={tokens.icon.sm} color={colors.foregroundSubtle} />
    </BubblePressable>
  );
}

export function ChurchScreen({ listenerSnapshot }: ChurchScreenProps) {
  const { colors } = useTheme();
  const locations = listenerSnapshot.locations
    .map((location) => [location.city, location.country].filter(Boolean).join(', '))
    .filter(Boolean)
    .filter((location, index, list) => list.indexOf(location) === index)
    .slice(0, 3);
  return (
    <Screen scroll>
      <ScreenHeader eyebrow={copy.church.eyebrow} title={copy.church.title} lead={copy.church.lead} />

      <View style={[styles.infoSurface, { backgroundColor: colors.surface }]}>
        <AppIcon icon={Heart} size={tokens.icon.lg} color={colors.foreground} />
        <AppText variant="headline" style={styles.infoTitle}>{appConfig.church.shortName}</AppText>
        <AppText variant="body" tone="muted" style={styles.infoText}>{appConfig.church.auditoriumName}</AppText>
        <AppText variant="caption" tone="subtle" style={styles.historicNote}>{appConfig.church.historicNote}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="headline">Nos encontramos</AppText>
        <ActionRow icon={MapPin} label="Cómo llegar" detail={appConfig.church.address} url={appConfig.church.mapsUrl} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <AppText variant="headline">Comunidad conectada</AppText>
          {listenerSnapshot.available && <AppText variant="caption" tone="subtle">En vivo</AppText>}
        </View>
        <View style={[styles.communitySurface, { backgroundColor: colors.muted }]}>
          <AppIcon icon={Users} size={tokens.icon.md} color={colors.foreground} />
          <View style={styles.communityCopy}>
            <AppText variant="label">{listenerSnapshot.available ? `${listenerSnapshot.listeners} oyentes` : 'Oyentes en vivo'}</AppText>
            <AppText variant="caption" tone="muted" numberOfLines={2}>{locations.length ? locations.join(' · ') : 'Ubicaciones disponibles durante la transmisión.'}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="headline">Acompañamiento</AppText>
        <AppText variant="body" tone="muted" style={styles.sectionLead}>{appConfig.church.prayerIntro}</AppText>
        <ActionRow icon={MessageCircle} label="Pedir oración por WhatsApp" detail={appConfig.church.phone} url={appConfig.church.whatsappUrl} />
        <ActionRow icon={Phone} label="Llamar a la iglesia" detail={appConfig.church.phone} url={`tel:${appConfig.church.phone.replace(/[^+\d]/g, '')}`} />
      </View>

      <View style={styles.section}>
        <AppText variant="headline">Transmisión</AppText>
        <View style={styles.scheduleRow}>
          <AppIcon icon={Radio} size={tokens.icon.md} color={colors.accent} />
          <View style={styles.scheduleCopy}>
            <AppText variant="label">Radio Maranata · 89.3 FM</AppText>
            <View style={styles.scheduleMeta}>
              <AppIcon icon={Clock} size={tokens.icon.sm} color={colors.foregroundSubtle} />
              <AppText variant="caption" tone="muted">{appConfig.church.serviceSchedule}</AppText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="headline">Canales oficiales</AppText>
        {appConfig.church.social.map((channel) => <ActionRow key={channel.label} icon={socialIcons[channel.label] ?? ExternalLink} label={channel.label} url={channel.url} />)}
      </View>

      <View style={styles.section}>
        <AppText variant="headline">{appConfig.church.about.historyTitle}</AppText>
        <AppText variant="body" tone="muted" style={styles.sectionLead}>{appConfig.church.about.historyText}</AppText>
        <AppText variant="label" style={styles.statementTitle}>Visión</AppText>
        <AppText variant="body" tone="muted" style={styles.statementCopy}>{appConfig.church.about.vision}</AppText>
        <AppText variant="label" style={styles.statementTitle}>Misión</AppText>
        <AppText variant="body" tone="muted" style={styles.statementCopy}>{appConfig.church.about.mission}</AppText>
        <AppText variant="caption" tone="subtle" style={styles.values}>{appConfig.church.about.values.join(' · ')}</AppText>
        <AppText variant="body" style={styles.communityStatement}>{appConfig.church.about.communityStatement}</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoSurface: { borderRadius: tokens.radius.md, padding: tokens.space.lg, marginTop: tokens.space.xxl, boxShadow: tokens.shadow.panel },
  infoTitle: { marginTop: tokens.space.base },
  infoText: { marginTop: tokens.space.sm },
  historicNote: { marginTop: tokens.space.md },
  section: { marginTop: tokens.space.xxl },
  sectionHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  sectionLead: { marginTop: tokens.space.sm },
  actionRow: { minHeight: tokens.height.listItem, flexDirection: 'row', alignItems: 'center', gap: tokens.space.md, marginTop: tokens.space.md },
  actionCopy: { flex: 1 },
  communitySurface: { minHeight: tokens.height.listItem, flexDirection: 'row', alignItems: 'center', gap: tokens.space.md, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.space.base, marginTop: tokens.space.md },
  communityCopy: { flex: 1 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.md, marginTop: tokens.space.md },
  scheduleCopy: { flex: 1 },
  scheduleMeta: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.xs, marginTop: tokens.space.xs },
  statementTitle: { marginTop: tokens.space.lg },
  statementCopy: { marginTop: tokens.space.xs },
  values: { marginTop: tokens.space.lg },
  communityStatement: { marginTop: tokens.space.md, marginBottom: tokens.space.xxl },
});

