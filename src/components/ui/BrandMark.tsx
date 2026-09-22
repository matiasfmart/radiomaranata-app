import Svg, { Path } from 'react-native-svg';

type BrandMarkProps = {
  size: number;
  color: string;
};

// Monochrome app mark based on the supplied cloud, megaphone, and broadcast-wave logo.
export function BrandMark({ size, color }: BrandMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path d="M7 29.5c0-5.1 4.1-9.2 9.2-9.2 1.4 0 2.8.3 4 .9A10.3 10.3 0 0 1 30 14c5.7 0 10.3 4.6 10.3 10.3 0 .5 0 1-.1 1.5A6.8 6.8 0 0 1 42 31.5c0 3.8-3.1 6.8-6.8 6.8H15.2A8.2 8.2 0 0 1 7 30.1v-.6Z" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m17 28 14-7v14l-14-7Z" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m14.5 28 2.5 10" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M34 23c1.8 1.1 2.9 2.9 2.9 5s-1.1 3.9-2.9 5" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M37.5 19.5c3.1 2 5 5 5 8.5s-1.9 6.5-5 8.5" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}
