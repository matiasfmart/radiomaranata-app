import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors, tokens } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = 'radiomaranata.themeMode';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') setModeState(stored);
    });
  }, []);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(STORAGE_KEY, nextMode);
  };

  const scheme: ColorScheme = mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;
  const colors = tokens.color[scheme];

  const value = useMemo(() => ({ mode, scheme, colors, setMode }), [mode, scheme, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider.');
  return context;
}
