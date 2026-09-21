import { appConfig } from '../config/app';

export type ListenerLocation = {
  city: string;
  region: string;
  country: string;
  connectedTime: number;
};

export type ListenerSnapshot = {
  listeners: number;
  countries: number;
  locations: ListenerLocation[];
  available: boolean;
};

const emptySnapshot: ListenerSnapshot = {
  listeners: 0,
  countries: 0,
  locations: [],
  available: false,
};

const endpoint = appConfig.listeners.apiUrl;

export async function getListenerSnapshot(): Promise<ListenerSnapshot> {
  try {
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) return emptySnapshot;

    const data = await response.json();
    const rawLocations: unknown[] = Array.isArray(data.locations) ? data.locations : [];
    const locations: ListenerLocation[] = rawLocations
          .filter((location: unknown): location is Record<string, unknown> => Boolean(location && typeof location === 'object'))
          .map((location) => ({
            city: String(location.city ?? ''),
            region: String(location.region ?? ''),
            country: String(location.country ?? ''),
            connectedTime: Number(location.connectedTime ?? 0),
          }));
    const listeners = Number(data.totalListeners ?? 0);
    return {
      listeners,
      countries: new Set(locations.map((location) => location.country).filter(Boolean)).size,
      locations,
      available: true,
    };
  } catch {
    return emptySnapshot;
  }
}
