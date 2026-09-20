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
    light: {
      background: '#FAFAFA',
      foreground: '#0A0A0A',
      muted: '#EDEDED',
      mutedForeground: '#555555',
      border: '#DADADA',
      surface: '#F5F5F5',
    },
    dark: {
      background: '#0A0A0A',
      foreground: '#FAFAFA',
      muted: '#1F1F1F',
      mutedForeground: '#BDBDBD',
      border: '#363636',
      surface: '#0F0F0F',
    },
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
    transparent: 'transparent',
    // Single accent hue in the whole app. Warm red, used only where color
    // itself is the information (live/playing state, primary action).
    accent: '#E5483B',
    accentForeground: '#0A0A0A',
    accentMuted: 'rgba(229,72,59,0.14)',
    cssVariables: {
      '--background': '#0A0A0A',
      '--foreground': '#FAFAFA',
      '--muted': '#1F1F1F',
      '--muted-foreground': '#BDBDBD',
      '--border': '#363636',
      '--surface': '#0F0F0F',
      '--accent': '#E5483B',
      '--accent-foreground': '#0A0A0A',
      '--accent-muted': 'rgba(229,72,59,0.14)',
    },
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
    sm: 8,
    md: 16,
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
      fast: 120,
      medium: 220,
      slow: 360,
    },
    distance: {
      sm: 8,
      md: 16,
    },
    pressScale: 0.96,
    screenDuration: 220,
    screenDelay: 0,
    staggerStep: 40,
  },
} as const;
