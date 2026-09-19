import { env } from './env';

const azuracastBaseUrl = 'https://azuracast-dquna-u78781.vm.elestio.app';
const azuracastStationShortcode = 'maranata';

export const appConfig = {
  environment: env.appEnvironment,
  azuracast: {
    baseUrl: azuracastBaseUrl,
    stationShortcode: azuracastStationShortcode,
    fallbackStreamUrl: `${azuracastBaseUrl}/listen/${azuracastStationShortcode}/radio.mp3`,
  },
  listeners: {
    apiUrl: env.listenersApiUrl,
  },
  church: {
    websiteUrl: 'https://www.manantialdeavivamiento.com',
  },
} as const;
