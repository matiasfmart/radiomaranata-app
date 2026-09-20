import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppTab, BottomNavigationIcon, bottomNavigationItems } from '../../constants/navigation';
import { tokens } from '../../theme/tokens';
import { AppText } from '../ui/AppText';

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

export function BottomNavigation({ activeTab, isPlaying, onTabChange }: BottomNavigationProps) {
  return <View style={styles.navDock}>{bottomNavigationItems.map((tab) => <NavItem key={tab.id} tab={tab} active={activeTab === tab.id} isPlaying={isPlaying && tab.id === 'listen'} onPress={() => onTabChange(tab.id)} />)}</View>;
}

function NavItem({ tab, active, isPlaying, onPress }: NavItemProps) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[styles.navItem, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        aria-selected={active}
        accessibilityLabel={tab.label}
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: tokens.motion.pressScale, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={styles.navTap}
      >
        <View style={styles.navIconWrap}>
          <Ionicons name={tab.icon} size={tokens.icon.md} color={active ? tokens.color.accent : tokens.color.foregroundSubtle} />
          {isPlaying && <View style={styles.navPlayingDot} />}
        </View>
        <AppText variant="caption" tone={active ? 'accent' : 'subtle'}>{tab.label}</AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navDock: { position: 'absolute', left: tokens.screenMargin, right: tokens.screenMargin, bottom: tokens.space.md, minHeight: tokens.height.buttonPrimary - 12, flexDirection: 'row', alignItems: 'center', borderRadius: tokens.radius.md, backgroundColor: tokens.color.surface, borderColor: tokens.color.border, borderWidth: 1, boxShadow: tokens.shadow.floating, paddingHorizontal: tokens.space.xs, paddingVertical: tokens.space.xs },
  navItem: { flex: 1 },
  navTap: { minHeight: tokens.height.minTouch, alignItems: 'center', justifyContent: 'center', gap: tokens.space.xs, borderRadius: tokens.radius.sm },
  navIconWrap: { width: tokens.icon.lg, height: tokens.icon.lg, alignItems: 'center', justifyContent: 'center' },
  navPlayingDot: { position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: tokens.radius.pill, backgroundColor: tokens.color.accent },
});
