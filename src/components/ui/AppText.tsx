import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ThemeColors } from '../../theme/tokens';
import { textRoles } from '../../theme/typography';

type Role = keyof typeof textRoles;
type Tone = 'foreground' | 'muted' | 'subtle' | 'inverted' | 'accent';

function toneColor(colors: ThemeColors, tone: Tone): string {
  switch (tone) {
    case 'foreground': return colors.foreground;
    case 'muted': return colors.mutedForeground;
    case 'subtle': return colors.foregroundSubtle;
    case 'inverted': return colors.invertedForeground;
    case 'accent': return colors.accent;
  }
}

type AppTextProps = Omit<TextProps, 'role'> & {
  variant: Role;
  tone?: Tone;
  align?: TextStyle['textAlign'];
};

// Every screen picks a variant here instead of defining its own font size.
export function AppText({ variant, tone = 'foreground', align, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
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
          color: toneColor(colors, tone),
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
