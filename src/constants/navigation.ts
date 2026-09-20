export type AppTab = 'listen' | 'schedule' | 'church';
export type BottomNavigationIcon = 'musical-notes-outline' | 'radio-outline' | 'business-outline';

export const bottomNavigationItems: { id: AppTab; label: string; icon: BottomNavigationIcon }[] = [
  { id: 'schedule', label: 'Tracks', icon: 'musical-notes-outline' },
  { id: 'listen', label: 'Radio', icon: 'radio-outline' },
  { id: 'church', label: 'Iglesia', icon: 'business-outline' },
];
