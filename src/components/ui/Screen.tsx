import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { tokens } from '../../theme/tokens';

const colors = tokens.color;

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  bottomInset?: number;
};

// Single source of the screen lateral margin. Every screen renders through
// this so left/right edges always land on the same vertical line.
export function Screen({ children, scroll = false, bottomInset = 0 }: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tokens.height.listItem + tokens.space.xxl + bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.staticScreen, { paddingBottom: bottomInset }]}>{children}</View>;
}

const styles = StyleSheet.create({
  staticScreen: { flex: 1, paddingHorizontal: tokens.screenMargin, paddingTop: tokens.space.xl, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: tokens.screenMargin, paddingTop: tokens.space.xxl, backgroundColor: colors.background, minHeight: '100%' },
});
