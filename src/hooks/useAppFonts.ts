import { useFonts } from 'expo-font';

export function useAppFonts(): boolean {
  const [fontsLoaded] = useFonts({
    HelveticaNowDisplay_Thin: require('../../assets/HelveticaNowDisplay-Thin.ttf'),
    HelveticaNowDisplay_Regular: require('../../assets/HelveticaNowDisplay-Regular.ttf'),
    HelveticaNowDisplay_Medium: require('../../assets/HelveticaNowDisplay-Medium.ttf'),
    HelveticaNowDisplay_Bold: require('../../assets/HelveticaNowDisplay-Bold.ttf'),
  });

  return fontsLoaded;
}
