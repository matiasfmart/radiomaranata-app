export type AppTab = 'listen' | 'schedule' | 'church';
export type BottomNavigationIcon = 'albums-outline' | 'play-circle-outline' | 'heart-outline';

export const bottomNavigationItems: { id: AppTab; label: string; icon: BottomNavigationIcon }[] = [
  { id: 'schedule', label: 'Tracks', icon: 'albums-outline' },
  { id: 'listen', label: 'Radio', icon: 'play-circle-outline' },
  { id: 'church', label: 'Iglesia', icon: 'heart-outline' },
];
