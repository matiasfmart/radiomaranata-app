import { Image, ImageStyle, StyleProp } from 'react-native';

type BrandMarkProps = {
  size: number;
  color: string;
  style?: StyleProp<ImageStyle>;
};

// Exact supplied logo silhouette, converted to alpha so the app theme controls its color.
export function BrandMark({ size, color, style }: BrandMarkProps) {
  return <Image source={require('../../../assets/logo/radio-mark-transparent.png')} resizeMode="contain" style={[{ width: size, height: size, tintColor: color }, style]} />;
}
