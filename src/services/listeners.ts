export type ListenerCountry = {
  country: string;
  flag: string;
  listeners: number;
  cities: { name: string; listeners: number }[];
};

export type ListenerSnapshot = {
  listeners: number;
  countries: number;
  locations: ListenerCountry[];
  available: boolean;
};

const emptySnapshot: ListenerSnapshot = {
  listeners: 0,
  countries: 0,
  locations: [],
  available: false,
};

const sessionId = `radio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const endpoint = process.env.EXPO_PUBLIC_LISTENERS_API_URL;

export async function sendListenerHeartbeat(): Promise<ListenerSnapshot> {
  if (!endpoint) return emptySnapshot;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) return emptySnapshot;

    const data = await response.json();
    return {
      listeners: Number(data.listeners ?? 0),
      countries: Number(data.countries ?? 0),
      locations: Array.isArray(data.locations) ? data.locations : [],
      available: true,
    };
  } catch {
    return emptySnapshot;
  }
}
