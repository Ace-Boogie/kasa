import { apiFetch } from './client';
import mockProperties from './properties.mock.json';
import type {
  PropertyDetails,
  PropertySummary,
  RawProperty,
} from '@/types/property';

/**
 * Bascule automatique vers les données figées.
 *
 * En développement, `API_URL` pointe sur le back-end Express local.
 * En production (Vercel), cette variable est absente : le site sert alors
 * l'instantané `properties.mock.json`, extrait de la base du back-end.
 * Le site reste ainsi consultable sans serveur à lancer, comme le prévoit
 * l'étape 10 du brief.
 */
const USE_MOCK = !process.env.API_URL;

/**
 * Convertit le snake_case de l'API en camelCase, pour que les composants
 * ne dépendent pas des conventions du back-end.
 */
function normalize(raw: RawProperty): PropertyDetails {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? '',
    cover: raw.cover,
    location: raw.location ?? '',
    pricePerNight: raw.price_per_night,
    rating: Math.round(raw.rating_avg ?? 0),
    ratingsCount: raw.ratings_count ?? 0,
    host: raw.host ?? null,
    pictures: raw.pictures ?? [],
    equipments: raw.equipments ?? [],
    tags: raw.tags ?? [],
  };
}

/** Liste toutes les propriétés. */
export async function getProperties(): Promise<PropertySummary[]> {
  if (USE_MOCK) {
    return (mockProperties as RawProperty[]).map(normalize);
  }
  const rows = await apiFetch<RawProperty[]>('/api/properties');
  return rows.map(normalize);
}

/** Détail complet d'une propriété par son identifiant technique. */
export async function getPropertyById(id: string): Promise<PropertyDetails | null> {
  if (USE_MOCK) {
    const found = (mockProperties as RawProperty[]).find((p) => p.id === id);
    return found ? normalize(found) : null;
  }
  const raw = await apiFetch<RawProperty>(`/api/properties/${id}`);
  return normalize(raw);
}

/**
 * Détail complet d'une propriété par son slug.
 *
 * L'API n'expose que `/api/properties/:id` — le slug n'y est pas accepté.
 * On résout donc slug → id via la liste, mise en cache par Next
 * (`revalidate: 60`) : le second appel ne repart pas sur le réseau.
 *
 * @returns `null` si le slug n'existe pas.
 */
export async function getPropertyBySlug(
  slug: string
): Promise<PropertyDetails | null> {
  if (USE_MOCK) {
    const found = (mockProperties as RawProperty[]).find((p) => p.slug === slug);
    return found ? normalize(found) : null;
  }
  const properties = await getProperties();
  const match = properties.find((p) => p.slug === slug);
  if (!match) return null;
  return getPropertyById(match.id);
}

/** Slugs de toutes les propriétés — pour `generateStaticParams` et le sitemap. */
export async function getAllSlugs(): Promise<string[]> {
  const properties = await getProperties();
  return properties.map((p) => p.slug);
}
