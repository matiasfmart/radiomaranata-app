import { Text, TextProps, TextStyle } from 'react-native';
import { tokens } from '../../theme/tokens';
import { textRoles } from '../../theme/typography';

type Role = keyof typeof textRoles;
type Tone = 'foreground' | 'muted' | 'subtle' | 'inverted' | 'accent';

const toneColor: Record<Tone, string> = {
  foreground: tokens.color.foreground,
  muted: tokens.color.mutedForeground,
  subtle: tokens.color.foregroundSubtle,
  inverted: tokens.color.invertedForeground,
  accent: tokens.color.accent,
};

type AppTextProps = Omit<TextProps, 'role'> & {
  variant: Role;
  tone?: Tone;
  align?: TextStyle['textAlign'];
};

// Every screen picks a variant here instead of defining its own font size.
export function AppText({ variant, tone = 'foreground', align, style, ...rest }: AppTextProps) {
  const roleStyle = textRoles[variant];
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: roleStyle.fontFamily,
          fontSize: roleStyle.fontSize,
          lineHeight: roleStyle.lineHeight,
          fontWeight: roleStyle.fontWeight,
          letterSpacing: roleStyle.letterSpacing,
          color: toneColor[tone],
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
