import { useEffect, useState } from 'react';
import { playbackConfig } from '../constants/playback';
import { getListenerSnapshot, ListenerSnapshot } from '../services/listeners';

const emptyListeners: ListenerSnapshot = {
  listeners: 0,
  countries: 0,
  locations: [],
  available: false,
};

export function useListenerHeartbeat(): ListenerSnapshot {
  const [listenerSnapshot, setListenerSnapshot] = useState(emptyListeners);

  useEffect(() => {
    const loadListeners = async () => setListenerSnapshot(await getListenerSnapshot());
    loadListeners();
    const interval = setInterval(loadListeners, playbackConfig.listenerHeartbeatMs);

    return () => clearInterval(interval);
  }, []);

  return listenerSnapshot;
}
