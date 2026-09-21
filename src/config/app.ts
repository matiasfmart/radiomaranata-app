import { env } from './env';

const azuracastBaseUrl = 'https://azuracast-dquna-u78781.vm.elestio.app';
const azuracastStationShortcode = 'maranata';
const publicApiBaseUrl = 'https://manantialdeavivamiento.com';

export const appConfig = {
  environment: env.appEnvironment,
  azuracast: {
    baseUrl: azuracastBaseUrl,
    stationShortcode: azuracastStationShortcode,
    fallbackStreamUrl: `${azuracastBaseUrl}/listen/${azuracastStationShortcode}/radio.mp3`,
  },
  listeners: {
    apiUrl: `${publicApiBaseUrl}/api/radio/listeners`,
  },
  church: {
    websiteUrl: 'https://www.manantialdeavivamiento.com',
    name: 'Ministerio Manantial de Avivamiento',
    shortName: 'Manantial de Avivamiento',
    auditoriumName: 'Auditorio Manantial de Avivamiento',
    historicNote: 'Conocido en el barrio de Lugano como el Ex Cine Progreso.',
    address: 'Av. Riestra 5651, Villa Lugano, Ciudad Autónoma de Buenos Aires',
    mapsUrl: 'https://maps.google.com/?q=Av.%20Riestra%205651%2C%20Villa%20Lugano%2C%20CABA',
    phone: '+54 11 2799-4682',
    whatsappUrl: 'https://wa.me/5491127994682',
    prayerIntro: '¿Necesitás que oremos por vos o por tu familia? Escribinos o llamanos, con toda confianza.',
    serviceSchedule: 'Domingos 19:30 h',
    social: [
      { label: 'Instagram', url: 'https://www.instagram.com/manantialavivamiento/' },
      { label: 'YouTube', url: 'https://www.youtube.com/@ManantialdeAvivamiento' },
      { label: 'Facebook', url: 'https://www.facebook.com/mavivamiento' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@manantialavivamiento' },
      { label: 'Canal de WhatsApp', url: 'https://whatsapp.com/channel/0029VaakItABqbr5DFewW12c' },
    ],
    about: {
      historyTitle: 'Del cine de barrio a casa de fe',
      historyText: 'Durante años, este edificio reunió vecinos para compartir historias. Hoy sigue siendo un lugar de encuentro: una casa de fe, comunidad y esperanza para Villa Lugano.',
      vision: 'Alcanzar cada generación con el amor y la Palabra de Dios.',
      mission: 'Formar discípulos a través de la adoración, la enseñanza, la comunidad y el servicio.',
      values: ['Fe genuina', 'Familia', 'Servicio', 'Excelencia', 'Comunidad'],
      communityStatement: 'Una fe que se vive en comunidad, sirviendo a las personas y al barrio que nos rodea.',
    },
  },
} as const;
