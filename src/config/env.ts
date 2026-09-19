export type AppEnvironment = 'development' | 'staging' | 'production';

type PublicEnv = {
  appEnvironment: AppEnvironment;
  listenersApiUrl: string | null;
};

function parseAppEnvironment(value: string | undefined): AppEnvironment {
  if (!value) {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }

  if (value === 'development' || value === 'staging' || value === 'production') {
    return value;
  }

  throw new Error('[config] EXPO_PUBLIC_APP_ENV must be development, staging, or production.');
}

function parseOptionalUrl(value: string | undefined, name: string): string | null {
  if (!value) return null;

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`[config] ${name} must be a valid URL when provided.`);
  }
}

export const env: PublicEnv = {
  appEnvironment: parseAppEnvironment(process.env.EXPO_PUBLIC_APP_ENV),
  listenersApiUrl: parseOptionalUrl(process.env.EXPO_PUBLIC_LISTENERS_API_URL, 'EXPO_PUBLIC_LISTENERS_API_URL'),
};
