/**
 * Formatage des dates de la messagerie.
 *
 * Le fuseau est imposé explicitement. Sans lui, le serveur Node et le
 * navigateur peuvent produire deux chaînes différentes pour la même date,
 * ce que React signale comme une erreur d'hydratation — le même piège que
 * celui évité côté favoris par le drapeau `isLoaded`.
 */

const TIME_ZONE = 'Europe/Paris';

/** Heure seule, au format 24 h utilisé en France : « 11:04 ». */
const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});

/** Date longue pour les séparateurs de journée : « 3 septembre 2025 ». */
const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
});

/** Clé de regroupement par journée : « 2025-09-03 ». */
const dayKeyFormatter = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: TIME_ZONE,
});

/**
 * Heure d'envoi d'un message.
 *
 * @param isoDate Date ISO 8601.
 * @example formatTime('2025-09-03T11:04:00+02:00') // « 11:04 »
 */
export function formatTime(isoDate: string): string {
  return timeFormatter.format(new Date(isoDate));
}

/**
 * Journée d'envoi, telle qu'affichée dans les séparateurs du fil.
 *
 * @example formatDay('2025-09-03T11:04:00+02:00') // « 3 septembre 2025 »
 */
export function formatDay(isoDate: string): string {
  return dayFormatter.format(new Date(isoDate));
}

/**
 * Identifiant de la journée, pour détecter un changement de date entre
 * deux messages consécutifs.
 */
export function dayKey(isoDate: string): string {
  return dayKeyFormatter.format(new Date(isoDate));
}

/**
 * Date lisible par une technologie d'assistance, jointe à l'attribut
 * `dateTime` de la balise `<time>`.
 */
export function formatFullDate(isoDate: string): string {
  return `${formatDay(isoDate)} à ${formatTime(isoDate)}`;
}
