import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  bottomInset?: number;
};

// Single source of the screen lateral margin. Every screen renders through
// this so left/right edges always land on the same vertical line.
export function Screen({ children, scroll = false, bottomInset = 0 }: ScreenProps) {
  const { colors } = useTheme();

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background, paddingBottom: tokens.height.listItem + tokens.space.xxl + bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.staticScreen, { backgroundColor: colors.background, paddingBottom: bottomInset }]}>{children}</View>;
}

const styles = StyleSheet.create({
  staticScreen: { flex: 1, paddingHorizontal: tokens.screenMargin, paddingTop: tokens.space.xl },
  scrollContent: { paddingHorizontal: tokens.screenMargin, paddingTop: tokens.space.xxl, minHeight: '100%' },
});
