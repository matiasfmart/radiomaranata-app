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
    // Two full palettes, symmetric inversion. Accent is a single translucent
    // blue hue in both; accentForeground matches each theme's own foreground
    // because the accent blends into whichever background sits behind it.
    light: {
      background: '#FAFAFA',
      foreground: '#0A0A0A',
      muted: '#EDEDED',
      mutedForeground: '#555555',
      border: '#DADADA',
      surface: '#F5F5F5',
      surfacePressed: '#E3E3E3',
      foregroundSubtle: '#767676',
      invertedBackground: '#0A0A0A',
      invertedForeground: '#FAFAFA',
      accent: 'rgba(59,130,246,0.5)',
      accentForeground: '#0A0A0A',
      accentMuted: 'rgba(59,130,246,0.12)',
      transparent: 'transparent',
    } satisfies ThemeColors,
    dark: {
      background: '#0A0A0A',
      foreground: '#FAFAFA',
      muted: '#1F1F1F',
      mutedForeground: '#BDBDBD',
      border: '#363636',
      surface: '#0F0F0F',
      surfacePressed: '#1F1F1F',
      foregroundSubtle: '#767676',
      invertedBackground: '#FAFAFA',
      invertedForeground: '#0A0A0A',
      accent: 'rgba(59,130,246,0.5)',
      accentForeground: '#FAFAFA',
      accentMuted: 'rgba(59,130,246,0.16)',
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
    floating: '0px 8px 18px rgba(10,10,10,0.10)',
    panel: '0px 8px 18px rgba(10,10,10,0.08)',
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

