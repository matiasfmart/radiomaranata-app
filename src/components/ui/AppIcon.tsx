import { LucideIcon } from 'lucide-react-native';

type AppIconProps = {
  icon: LucideIcon;
  size: number;
  color: string;
};

// Lucide gives the app one deliberate, heavier outline language instead of
// mixing icon-font weights that cannot share a configurable stroke.
export function AppIcon({ icon: Icon, size, color }: AppIconProps) {
  return <Icon color={color} size={size} strokeWidth={2.5} />;
}