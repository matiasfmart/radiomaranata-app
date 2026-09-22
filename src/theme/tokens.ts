export interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  surface: string;
  surfacePressed: string;
  foregroundSubtle: string;
  invertedBackground: string;
  invertedForeground: string;
  accent: string;
  accentForeground: string;
  accentMuted: string;
  transparent: string;
}

export const tokens = {
  color: {
    gray: {
      0: '#FAFAFA',
      1: '#EDEDED',
      2: '#DADADA',
      3: '#BDBDBD',
      4: '#9B9B9B',
      5: '#767676',
      6: '#555555',
      7: '#363636',
      8: '#1F1F1F',
      9: '#0A0A0A',
    },
    // Broadcast blue on an Instagram-like white surface system.
    // The light theme stays neutral and cool so the logo color carries the
    // identity without competing against beige backgrounds.
    light: {
      background: '#FAFAFA',
      foreground: '#111111',
      muted: '#F5F5F5',
      mutedForeground: '#737373',
      surface: '#FFFFFF',
      surfacePressed: '#EFEFEF',
      foregroundSubtle: '#8E8E8E',
      invertedBackground: '#111111',
      invertedForeground: '#FFFFFF',
      accent: '#2451A6',
      accentForeground: '#FFFFFF',
      accentMuted: '#D7E2F7',
      transparent: 'transparent',
    } satisfies ThemeColors,
    dark: {
      background: '#171716',
      foreground: '#F4F2ED',
      muted: '#2C2A27',
      mutedForeground: '#BBB6AD',
      surface: '#22211F',
      surfacePressed: '#302D29',
      foregroundSubtle: '#948F87',
      invertedBackground: '#F4F2ED',
      invertedForeground: '#1A0D0B',
      accent: '#4E7FE0',
      accentForeground: '#FFFFFF',
      accentMuted: '#1C376D',
      transparent: 'transparent',
    } satisfies ThemeColors,
  },
  // Closed 4px-base spacing scale. Nothing outside this set.
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  // Exactly 3 radii: small, medium, pill.
  radius: {
    sm: 16,
    md: 30,
    pill: 999,
  },
  // Exactly 3 icon sizes, one stroke weight (outline icon set) throughout.
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
  },
  // Standard control heights. Every pressable respects the 44px minimum.
  height: {
    buttonPrimary: 72,
    buttonSecondary: 44,
    chip: 32,
    listItem: 56,
    navigationDock: 72,
    searchField: 48,
    minTouch: 44,
  },
  // Single lateral margin token used by every screen.
  screenMargin: 24,
  shadow: {
    floating: '0px 8px 18px rgba(49,42,36,0.07)',
    navigation: '0px -6px 18px rgba(49,42,36,0.09)',
    panel: '0px 3px 10px rgba(49,42,36,0.045)',
  },
  motion: {
    duration: {
      fast: 160,
      medium: 320,
      slow: 480,
    },
    distance: {
      sm: 8,
      md: 16,
    },
    pressScale: 0.94,
    bubbleScale: 1.1,
    bubbleOpacity: 0.14,
    screenDuration: 320,
    screenDelay: 0,
    staggerStep: 60,
  },
} as const;

