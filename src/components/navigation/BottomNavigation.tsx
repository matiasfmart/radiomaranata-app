import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppTab, BottomNavigationIcon, bottomNavigationItems } from '../../constants/navigation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppText } from '../ui/AppText';
import { BubblePressable } from '../ui/BubblePressable';

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
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const activeIndex = bottomNavigationItems.findIndex((tab) => tab.id === activeTab);
  const bubblePosition = useRef(new Animated.Value(activeIndex)).current;
  const itemWidth = (width - tokens.screenMargin * 2 - tokens.space.xs * 2) / bottomNavigationItems.length;

  useEffect(() => {
    if (reducedMotion) {
      bubblePosition.setValue(activeIndex);
      return;
    }
    Animated.spring(bubblePosition, {
      toValue: activeIndex,
      friction: 9,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, bubblePosition, reducedMotion]);

  const translateX = bubblePosition.interpolate({
    inputRange: bottomNavigationItems.map((_, index) => index),
    outputRange: bottomNavigationItems.map((_, index) => index * itemWidth),
  });

  return (
    <View style={[styles.navDock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.activeBubble, { width: itemWidth, backgroundColor: colors.accentMuted, transform: [{ translateX }] }]}
      />
      {bottomNavigationItems.map((tab) => <NavItem key={tab.id} tab={tab} active={activeTab === tab.id} isPlaying={isPlaying && tab.id === 'listen'} onPress={() => onTabChange(tab.id)} />)}
    </View>
  );
}

function NavItem({ tab, active, isPlaying, onPress }: NavItemProps) {
  const { colors } = useTheme();
  return (
    <BubblePressable
      accessibilityLabel={tab.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      aria-selected={active}
      bubbleColor={active ? colors.accent : colors.foregroundSubtle}
      containerStyle={styles.navItem}
      onPress={onPress}
      style={styles.navTap}
    >
      <View style={styles.navIconWrap}>
        <Ionicons name={tab.icon} size={tokens.icon.md} color={active ? colors.accent : colors.foregroundSubtle} />
        {isPlaying && <View style={[styles.navPlayingDot, { backgroundColor: colors.accent }]} />}
      </View>
      <AppText variant="caption" tone={active ? 'accent' : 'subtle'}>{tab.label}</AppText>
    </BubblePressable>
  );
}

const styles = StyleSheet.create({
  navDock: { position: 'absolute', left: tokens.screenMargin, right: tokens.screenMargin, bottom: tokens.space.md, minHeight: tokens.height.buttonPrimary - 12, flexDirection: 'row', alignItems: 'center', borderRadius: tokens.radius.pill, borderWidth: 1, boxShadow: tokens.shadow.floating, paddingHorizontal: tokens.space.xs, paddingVertical: tokens.space.xs },
  activeBubble: { position: 'absolute', top: tokens.space.xs, bottom: tokens.space.xs, left: tokens.space.xs, borderRadius: tokens.radius.pill },
  navItem: { flex: 1, zIndex: 1 },
  navTap: { minHeight: tokens.height.minTouch, alignItems: 'center', justifyContent: 'center', gap: tokens.space.xs, borderRadius: tokens.radius.pill },
  navIconWrap: { width: tokens.icon.lg, height: tokens.icon.lg, alignItems: 'center', justifyContent: 'center' },
  navPlayingDot: { position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: tokens.radius.pill },
});
