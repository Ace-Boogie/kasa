'use client';

import { useFavorites } from '@/context/FavoritesContext';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import type { PropertySummary } from '@/types/property';
import styles from './FavoritesSection.module.scss';

interface FavoritesSectionProps {
  properties: PropertySummary[];
}

/**
 * Section « Vos favoris » de la page d'accueil.
 *
 * Client, car la liste dépend de `localStorage`. Elle filtre les propriétés
 * déjà chargées côté serveur — aucun appel réseau supplémentaire.
 */
export default function FavoritesSection({
  properties,
}: FavoritesSectionProps) {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded || favorites.length === 0) return null;

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <section id="favoris" aria-labelledby="favoris-titre" className={styles.section}>
      <h2 id="favoris-titre" className={styles.title}>
        Vos favoris
      </h2>
      <p className={styles.text}>
        Retrouvez ici tous les logements que vous avez aimés.
      </p>
      <ul className={styles.grid}>
        {favoriteProperties.map((property) => (
          <li key={property.id}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </section>
  );
}
