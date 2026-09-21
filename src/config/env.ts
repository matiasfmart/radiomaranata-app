export type AppEnvironment = 'development' | 'staging' | 'production';

type PublicEnv = {
  appEnvironment: AppEnvironment;
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

export const env: PublicEnv = {
  appEnvironment: parseAppEnvironment(process.env.EXPO_PUBLIC_APP_ENV),
};
