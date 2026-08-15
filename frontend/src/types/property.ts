/** Hôte d'un logement. */
export interface Host {
  id: number;
  name: string;
  picture: string;
}

/** Logement tel que renvoyé par `GET /api/properties` (liste). */
export interface PropertySummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  pricePerNight: number;
  rating: number;
  ratingsCount: number;
  host: Host | null;
}

/** Logement tel que renvoyé par `GET /api/properties/:id` (détail). */
export interface PropertyDetails extends PropertySummary {
  pictures: string[];
  equipments: string[];
  tags: string[];
}

/**
 * Réponse brute de l'API, en snake_case.
 * Utilisée uniquement par la couche `lib/api` — les composants ne la voient jamais.
 */
export interface RawProperty {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover: string;
  location: string | null;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host?: Host;
  pictures?: string[];
  equipments?: string[];
  tags?: string[];
}
