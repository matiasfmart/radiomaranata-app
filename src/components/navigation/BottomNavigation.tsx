import { Album, Heart, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppTab, BottomNavigationIcon, bottomNavigationItems } from '../../constants/navigation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';
import { AppIcon } from '../ui/AppIcon';
import { AppText } from '../ui/AppText';
import { BrandMark } from '../ui/BrandMark';
import { BubblePressable } from '../ui/BubblePressable';

const ACTIVE_BUBBLE_SIZE = 56;
const NAV_ITEM_GAP = tokens.space.sm;
const NAV_DOCK_PADDING = tokens.space.sm;
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
  itemX: number;
  itemWidth: number;
  showActiveLabel: boolean;
  labelOpacity: Animated.Value;
  reducedMotion: boolean;
  onPress: () => void;
};

function activeBubbleWidth(label: string) {
  const contentWidth = tokens.icon.md + tokens.space.sm + label.length * 8;
  return Math.ceil(contentWidth + tokens.space.lg * 2);
}

export function BottomNavigation({ activeTab, isPlaying, onTabChange }: BottomNavigationProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const activeIndex = bottomNavigationItems.findIndex((tab) => tab.id === activeTab);
  const activeItem = bottomNavigationItems[activeIndex];
  const idealBubbleWidth = activeBubbleWidth(activeItem.label);
  const compactDockWidth = NAV_DOCK_PADDING * 2 + ACTIVE_BUBBLE_SIZE * bottomNavigationItems.length + NAV_ITEM_GAP * (bottomNavigationItems.length - 1);
  const expandedDockWidth = compactDockWidth - ACTIVE_BUBBLE_SIZE + idealBubbleWidth;
  const showActiveLabel = width - tokens.screenMargin * 2 >= expandedDockWidth;
  const targetBubbleWidth = showActiveLabel ? idealBubbleWidth : ACTIVE_BUBBLE_SIZE;
  const targetDockWidth = compactDockWidth - ACTIVE_BUBBLE_SIZE + targetBubbleWidth;
  const tabFrames = bottomNavigationItems.reduce<{ x: number; width: number }[]>((frames, tab) => {
    const previous = frames.at(-1);
    const itemWidth = tab.id === activeTab ? targetBubbleWidth : ACTIVE_BUBBLE_SIZE;
    const itemX = previous ? previous.x + previous.width + NAV_ITEM_GAP : NAV_DOCK_PADDING;
    frames.push({ x: itemX, width: itemWidth });
    return frames;
  }, []);
  const targetBubbleX = tabFrames[activeIndex].x;
  const bubbleX = useRef(new Animated.Value(targetBubbleX)).current;
  const bubbleWidth = useRef(new Animated.Value(targetBubbleWidth)).current;
  const dockWidth = useRef(new Animated.Value(targetDockWidth)).current;
  const labelOpacity = useRef(new Animated.Value(showActiveLabel ? 1 : 0)).current;
  const bubblePulse = useRef(new Animated.Value(1)).current;
  const dockPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      bubbleX.setValue(targetBubbleX);
      bubbleWidth.setValue(targetBubbleWidth);
      dockWidth.setValue(targetDockWidth);
      labelOpacity.setValue(showActiveLabel ? 1 : 0);
      bubblePulse.setValue(1);
      dockPulse.setValue(1);
      return;
    }
    labelOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(bubbleX, { toValue: targetBubbleX, friction: 9, tension: 60, useNativeDriver: false }),
      Animated.spring(bubbleWidth, { toValue: targetBubbleWidth, friction: 9, tension: 60, useNativeDriver: false }),
      Animated.spring(dockWidth, { toValue: targetDockWidth, friction: 9, tension: 60, useNativeDriver: false }),
      Animated.sequence([
        Animated.timing(bubblePulse, { toValue: 1.06, duration: tokens.motion.duration.fast, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(bubblePulse, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(dockPulse, { toValue: 1.018, duration: tokens.motion.duration.fast, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(dockPulse, { toValue: 1, friction: 8, tension: 55, useNativeDriver: true }),
      ]),
    ]).start();
    if (showActiveLabel) {
      Animated.sequence([
        Animated.delay(tokens.motion.duration.fast),
        Animated.timing(labelOpacity, { toValue: 1, duration: tokens.motion.duration.medium, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
  }, [bubblePulse, bubbleWidth, bubbleX, dockPulse, dockWidth, labelOpacity, reducedMotion, showActiveLabel, targetBubbleWidth, targetBubbleX, targetDockWidth]);

  return (
    <Animated.View style={[styles.navDock, { width: dockWidth }]}>
      <Animated.View style={[styles.navSurface, { backgroundColor: colors.surface, transform: [{ scale: dockPulse }] }]}>
        <Animated.View pointerEvents="none" style={[styles.activeBubbleLayout, { left: bubbleX, width: bubbleWidth, height: ACTIVE_BUBBLE_SIZE }]}>
          <Animated.View style={[styles.activeBubble, { backgroundColor: colors.invertedBackground, transform: [{ scale: bubblePulse }] }]} />
        </Animated.View>
        <View style={styles.navItems}>
          {bottomNavigationItems.map((tab, index) => <NavItem key={tab.id} tab={tab} active={activeTab === tab.id} isPlaying={isPlaying && tab.id === 'listen'} itemX={tabFrames[index].x} itemWidth={tabFrames[index].width} showActiveLabel={showActiveLabel} labelOpacity={labelOpacity} reducedMotion={reducedMotion} onPress={() => onTabChange(tab.id)} />)}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function NavItem({ tab, active, isPlaying, itemX, itemWidth, showActiveLabel, labelOpacity, reducedMotion, onPress }: NavItemProps) {
  const { colors } = useTheme();
  const position = useRef(new Animated.Value(itemX)).current;
  const width = useRef(new Animated.Value(itemWidth)).current;
  const iconColor = active ? colors.invertedForeground : colors.foregroundSubtle;

  useEffect(() => {
    if (reducedMotion) {
      position.setValue(itemX);
      width.setValue(itemWidth);
      return;
    }
    Animated.parallel([
      Animated.spring(position, { toValue: itemX, friction: 9, tension: 60, useNativeDriver: false }),
      Animated.spring(width, { toValue: itemWidth, friction: 9, tension: 60, useNativeDriver: false }),
    ]).start();
  }, [itemWidth, itemX, position, reducedMotion, width]);

  return (
    <Animated.View style={[styles.navItem, { left: position, width }]}>
      <BubblePressable
        accessibilityLabel={tab.label}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        aria-selected={active}
        bubbleColor={active ? colors.invertedBackground : colors.foregroundSubtle}
        containerStyle={styles.navItemInner}
        onPress={onPress}
        style={[styles.navTap, active && showActiveLabel && styles.navTapActive]}
      >
        <View style={styles.navIconWrap}>
          {tab.icon === 'radio'
            ? <BrandMark size={tokens.icon.md} color={iconColor} />
            : <AppIcon icon={navIcons[tab.icon]} size={tokens.icon.md} color={iconColor} />}
          {isPlaying && <View style={[styles.navPlayingDot, { backgroundColor: colors.accent }]} />}
        </View>
        {active && showActiveLabel && <Animated.View style={{ opacity: labelOpacity }}><AppText variant="label" style={{ color: colors.invertedForeground }}>{tab.label}</AppText></Animated.View>}
      </BubblePressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navDock: { position: 'absolute', alignSelf: 'center', bottom: tokens.space.md, height: tokens.height.navigationDock, alignItems: 'center', justifyContent: 'center' },
  navSurface: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.md, boxShadow: tokens.shadow.navigation, overflow: 'hidden' },
  navItems: { width: '100%', height: ACTIVE_BUBBLE_SIZE, zIndex: 1 },
  activeBubbleLayout: { position: 'absolute', top: NAV_DOCK_PADDING, zIndex: 0 },
  activeBubble: { width: '100%', height: '100%', borderRadius: tokens.radius.md },
  navItem: { position: 'absolute', top: 0, zIndex: 1 },
  navItemInner: { width: '100%', height: '100%' },
  navTap: { height: ACTIVE_BUBBLE_SIZE, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.md },
  navTapActive: { flexDirection: 'row', gap: tokens.space.sm },
  navIconWrap: { width: tokens.icon.lg, height: tokens.icon.lg, alignItems: 'center', justifyContent: 'center' },
  navPlayingDot: { position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: tokens.radius.pill },
});
