import { Audio } from 'expo-av';

export type RadioSound = Audio.Sound;

export async function configureRadioAudioMode(): Promise<void> {
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
  });
}

export async function createRadioSound(streamUrl: string): Promise<RadioSound> {
  const { sound } = await Audio.Sound.createAsync({ uri: streamUrl }, { shouldPlay: true, isLooping: false });
  return sound;
}
