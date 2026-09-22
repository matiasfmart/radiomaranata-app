import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TextProps, TextStyle } from 'react-native';
import { fontFamilies, textRoles } from '../../theme/typography';

type GradientTextProps = Omit<TextProps, 'style'> & {
  variant: keyof typeof textRoles;
  style?: TextStyle;
};

const goldGradient = ['#F6C453', '#E69A2E', '#C96A24'] as const;

export function GradientText({ variant, style, ...rest }: GradientTextProps) {
  const role = textRoles[variant];
  const textStyle = {
    fontFamily: role.fontFamily,
    fontSize: role.fontSize,
    lineHeight: role.lineHeight,
    letterSpacing: role.letterSpacing,
    color: '#C96A24',
  } satisfies TextStyle;

  return (
    <MaskedView maskElement={<Text {...rest} style={[textStyle, style]} />}>
      <LinearGradient colors={goldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text {...rest} style={[textStyle, style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
}
