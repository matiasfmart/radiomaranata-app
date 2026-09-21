export interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
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
    // FM Vermilion: warm mineral surfaces with one solid frequency signal.
    // The accent stays opaque so playback, pulses, and moving bubbles retain
    // the same identity in both themes.
    light: {
      background: '#E7E5E1',
      foreground: '#151513',
      muted: '#DDDAD4',
      mutedForeground: '#6B6862',
      border: '#C8C4BC',
      surface: '#F8F7F4',
      surfacePressed: '#E8E4DE',
      foregroundSubtle: '#89847C',
      invertedBackground: '#151513',
      invertedForeground: '#FFFFFF',
      accent: '#E4473D',
      accentForeground: '#FFFFFF',
      accentMuted: '#F6C9C4',
      transparent: 'transparent',
    } satisfies ThemeColors,
    dark: {
      background: '#171716',
      foreground: '#F4F2ED',
      muted: '#2C2A27',
      mutedForeground: '#BBB6AD',
      border: '#45413B',
      surface: '#22211F',
      surfacePressed: '#302D29',
      foregroundSubtle: '#948F87',
      invertedBackground: '#F4F2ED',
      invertedForeground: '#1A0D0B',
      accent: '#FF6B5F',
      accentForeground: '#1A0D0B',
      accentMuted: '#4B2420',
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
    md: 24,
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
    navigationDock: 64,
    searchField: 48,
    minTouch: 44,
  },
  // Single lateral margin token used by every screen.
  screenMargin: 24,
  shadow: {
    floating: '0px 8px 18px rgba(49,42,36,0.14)',
    panel: '0px 8px 18px rgba(49,42,36,0.10)',
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

