export type AppTab = 'listen' | 'schedule' | 'church';
export type BottomNavigationIcon = 'albums' | 'radio' | 'heart';

export const bottomNavigationItems: { id: AppTab; label: string; icon: BottomNavigationIcon }[] = [
  { id: 'schedule', label: 'Tracks', icon: 'albums' },
  { id: 'listen', label: 'Radio', icon: 'radio' },
  { id: 'church', label: 'Iglesia', icon: 'heart' },
];
