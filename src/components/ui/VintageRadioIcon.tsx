import Svg, { Circle, Line, Rect } from 'react-native-svg';

type VintageRadioIconProps = {
  size: number;
  color: string;
};

// No library glyph combines a portable radio receiver with an antenna.
// This keeps that specific metaphor inside the same 2.5px outline system.
export function VintageRadioIcon({ size, color }: VintageRadioIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="8" y1="7" x2="11" y2="3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Rect x="3" y="7" width="18" height="13" rx="3" stroke={color} strokeWidth="2.5" />
      <Circle cx="8" cy="13.5" r="2.4" stroke={color} strokeWidth="2.5" />
      <Line x1="13" y1="12" x2="17.5" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="13" y1="16" x2="17.5" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}