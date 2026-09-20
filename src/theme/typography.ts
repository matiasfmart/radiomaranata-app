export const fontFamilies = {
  extraBold: 'Inter_800ExtraBold',
  bold: 'Inter_700Bold',
  medium: 'Inter_500Medium',
  regular: 'Inter_400Regular',
  light: 'Inter_300Light',
} as const;

type TextRole = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '300' | '400' | '500' | '700' | '800';
  letterSpacing: number;
};

// Closed semantic text roles. No component defines its own font size —
// every piece of text picks one of these.
export const textRoles: Record<'display' | 'title' | 'headline' | 'body' | 'label' | 'caption', TextRole> = {
  display: { fontFamily: fontFamilies.extraBold, fontSize: 44, lineHeight: 46, fontWeight: '800', letterSpacing: -1.1 },
  title: { fontFamily: fontFamilies.bold, fontSize: 28, lineHeight: 31, fontWeight: '700', letterSpacing: -0.6 },
  headline: { fontFamily: fontFamilies.bold, fontSize: 20, lineHeight: 24, fontWeight: '700', letterSpacing: -0.4 },
  body: { fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 23, fontWeight: '400', letterSpacing: 0 },
  label: { fontFamily: fontFamilies.medium, fontSize: 13, lineHeight: 18, fontWeight: '500', letterSpacing: 0 },
  caption: { fontFamily: fontFamilies.light, fontSize: 12, lineHeight: 16, fontWeight: '300', letterSpacing: 0.2 },
} as const;
