import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type RadioSound = AudioPlayer;

export async function configureRadioAudioMode(): Promise<void> {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
  });
}

export async function createRadioSound(streamUrl: string): Promise<RadioSound> {
  const player = createAudioPlayer(streamUrl);
  player.play();
  return player;
}
