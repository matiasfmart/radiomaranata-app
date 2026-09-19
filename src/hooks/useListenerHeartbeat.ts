import { useEffect, useState } from 'react';
import { playbackConfig } from '../constants/playback';
import { ListenerSnapshot, sendListenerHeartbeat } from '../services/listeners';

const emptyListeners: ListenerSnapshot = {
  listeners: 0,
  countries: 0,
  locations: [],
  available: false,
};

export function useListenerHeartbeat(isPlaying: boolean): ListenerSnapshot {
  const [listenerSnapshot, setListenerSnapshot] = useState(emptyListeners);

  useEffect(() => {
    if (!isPlaying) return;

    const sendHeartbeat = async () => setListenerSnapshot(await sendListenerHeartbeat());
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, playbackConfig.listenerHeartbeatMs);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return listenerSnapshot;
}
