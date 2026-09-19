import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppTab, BottomNavigationIcon, bottomNavigationItems } from '../../constants/navigation';
import { tokens } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

type BottomNavigationProps = {
  activeTab: AppTab;
  isPlaying: boolean;
  onTabChange: (tab: AppTab) => void;
};

type NavItemProps = {
  tab: { id: AppTab; label: string; icon: BottomNavigationIcon };
  active: boolean;
  isPlaying: boolean;
  onPress: () => void;
};

const colors = tokens.color;
const fonts = fontFamilies;

export function BottomNavigation({ activeTab, isPlaying, onTabChange }: BottomNavigationProps) {
  return <View style={styles.navDock}>{bottomNavigationItems.map((tab) => <NavItem key={tab.id} tab={tab} active={activeTab === tab.id} isPlaying={isPlaying && tab.id === 'listen'} onPress={() => onTabChange(tab.id)} />)}</View>;
}

function NavItem({ tab, active, isPlaying, onPress }: NavItemProps) {
  const scale = useRef(new Animated.Value(1)).current;
  return <Animated.View style={[styles.navItem, { transform: [{ scale }] }]}><Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} aria-selected={active} accessibilityLabel={tab.label} onPress={onPress} onPressIn={() => Animated.spring(scale, { toValue: 0.985, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()} style={[styles.navTap, active && styles.navTapActive]}><View style={styles.navIconWrap}><Ionicons name={tab.icon} size={tab.id === 'listen' ? 22 : 20} color={active ? colors.text : colors.textTertiary} />{isPlaying && <View style={styles.navPlayingDot} />}</View><Text style={[styles.navLabel, active && styles.navLabelActive]}>{tab.label}</Text></Pressable></Animated.View>;
}

const styles = StyleSheet.create({
  navDock: { position: 'absolute', left: 18, right: 18, bottom: 14, minHeight: 60, flexDirection: 'row', alignItems: 'center', borderRadius: 22, backgroundColor: 'rgba(11,12,14,0.86)', borderColor: 'rgba(255,255,255,0.045)', borderWidth: 1, boxShadow: '0px 10px 26px rgba(0,0,0,0.14)', paddingHorizontal: 6, paddingVertical: 6 },
  navItem: { flex: 1 },
  navTap: { minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 17 },
  navTapActive: { backgroundColor: 'rgba(241,199,107,0.12)' },
  navIconWrap: { width: 24, height: 22, alignItems: 'center', justifyContent: 'center' },
  navPlayingDot: { position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: tokens.radius.pill, backgroundColor: colors.live },
  navLabel: { color: colors.textTertiary, fontFamily: fonts.bodyMedium, fontSize: 11 },
  navLabelActive: { color: colors.text, fontFamily: fonts.bodySemi },
});
