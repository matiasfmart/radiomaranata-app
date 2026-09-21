export const fontFamilies = {
  bold: 'HelveticaNowDisplay_Bold',
  medium: 'HelveticaNowDisplay_Medium',
  regular: 'HelveticaNowDisplay_Regular',
  thin: 'HelveticaNowDisplay_Thin',
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
  display: { fontFamily: fontFamilies.bold, fontSize: 52, lineHeight: 54, fontWeight: '700', letterSpacing: -1.1 },
  title: { fontFamily: fontFamilies.bold, fontSize: 32, lineHeight: 36, fontWeight: '700', letterSpacing: -0.6 },
  headline: { fontFamily: fontFamilies.bold, fontSize: 22, lineHeight: 27, fontWeight: '700', letterSpacing: -0.4 },
  body: { fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25, fontWeight: '400', letterSpacing: 0 },
  label: { fontFamily: fontFamilies.medium, fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 0 },
  caption: { fontFamily: fontFamilies.thin, fontSize: 13, lineHeight: 18, fontWeight: '300', letterSpacing: 0.2 },
} as const;
