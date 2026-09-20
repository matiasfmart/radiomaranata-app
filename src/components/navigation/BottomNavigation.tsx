import { Album, Heart, RadioReceiver, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppTab, BottomNavigationIcon, bottomNavigationItems } from '../../constants/navigation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppIcon } from '../ui/AppIcon';
import { AppText } from '../ui/AppText';
import { BubblePressable } from '../ui/BubblePressable';
import { VintageRadioIcon } from '../ui/VintageRadioIcon';

const ACTIVE_BUBBLE_SIZE = 48;
const ACTIVE_BUBBLE_WIDTH = 112;
const navIcons: Record<Exclude<BottomNavigationIcon, 'radio'>, LucideIcon> = { albums: Album, heart: Heart };

type BottomNavigationProps = {
  activeTab: AppTab;
  isPlaying: boolean;
  onTabChange: (tab: AppTab) => void;
};

type NavItemProps = {
  tab: { id: AppTab; label: string; icon: BottomNavigationIcon };
  active: boolean;
  isPlaying: boolean;
  itemWidth: number;
  showActiveLabel: boolean;
  onPress: () => void;
};

export function BottomNavigation({ activeTab, isPlaying, onTabChange }: BottomNavigationProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const activeIndex = bottomNavigationItems.findIndex((tab) => tab.id === activeTab);
  const bubblePosition = useRef(new Animated.Value(activeIndex)).current;
  const itemWidth = (width - tokens.screenMargin * 2 - tokens.space.sm * 2) / bottomNavigationItems.length;
  const showActiveLabel = itemWidth >= 88;
  const bubbleWidth = showActiveLabel ? Math.min(ACTIVE_BUBBLE_WIDTH, itemWidth) : Math.min(ACTIVE_BUBBLE_SIZE, itemWidth);
  const bubbleInset = tokens.space.sm + (itemWidth - bubbleWidth) / 2;

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
        style={[styles.activeBubble, { left: bubbleInset, width: bubbleWidth, height: ACTIVE_BUBBLE_SIZE, backgroundColor: colors.accentMuted, transform: [{ translateX }] }]}
      />
      {bottomNavigationItems.map((tab) => <NavItem key={tab.id} tab={tab} active={activeTab === tab.id} isPlaying={isPlaying && tab.id === 'listen'} itemWidth={itemWidth} showActiveLabel={showActiveLabel} onPress={() => onTabChange(tab.id)} />)}
    </View>
  );
}

function NavItem({ tab, active, isPlaying, itemWidth, showActiveLabel, onPress }: NavItemProps) {
  const { colors } = useTheme();
  return (
    <BubblePressable
      accessibilityLabel={tab.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      aria-selected={active}
      bubbleColor={active ? colors.accent : colors.foregroundSubtle}
      containerStyle={[styles.navItem, { width: itemWidth }]}
      onPress={onPress}
      style={[styles.navTap, active && showActiveLabel && styles.navTapActive]}
    >
      <View style={styles.navIconWrap}>
        {tab.icon === 'radio'
          ? <VintageRadioIcon size={tokens.icon.md} color={active ? colors.accent : colors.foregroundSubtle} />
          : <AppIcon icon={navIcons[tab.icon]} size={tokens.icon.md} color={active ? colors.accent : colors.foregroundSubtle} />}
        {isPlaying && <View style={[styles.navPlayingDot, { backgroundColor: colors.accent }]} />}
      </View>
      {active && showActiveLabel && <AppText variant="label" tone="accent">{tab.label}</AppText>}
    </BubblePressable>
  );
}

const styles = StyleSheet.create({
  navDock: { position: 'absolute', left: tokens.screenMargin, right: tokens.screenMargin, bottom: tokens.space.md, height: tokens.height.navigationDock, flexDirection: 'row', alignItems: 'center', borderRadius: tokens.radius.pill, borderWidth: 1, boxShadow: tokens.shadow.floating, paddingHorizontal: tokens.space.sm, paddingVertical: tokens.space.sm },
  activeBubble: { position: 'absolute', top: tokens.space.sm, borderRadius: tokens.radius.pill },
  navItem: { zIndex: 1 },
  navTap: { height: ACTIVE_BUBBLE_SIZE, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.pill },
  navTapActive: { flexDirection: 'row', gap: tokens.space.sm },
  navIconWrap: { width: tokens.icon.lg, height: tokens.icon.lg, alignItems: 'center', justifyContent: 'center' },
  navPlayingDot: { position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: tokens.radius.pill },
});
