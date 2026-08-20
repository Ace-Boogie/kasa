'use client';

import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import type { PropertySummary } from '@/types/property';
import styles from './FavoritesList.module.scss';

interface FavoritesListProps {
  properties: PropertySummary[];
}

/**
 * Contenu de la page Favoris.
 *
 * Client, car la sélection vit dans `localStorage`. Les logements sont
 * fournis par la page serveur : aucun appel réseau supplémentaire, on se
 * contente de filtrer une liste déjà chargée.
 */
export default function FavoritesList({ properties }: FavoritesListProps) {
  const { favorites, isLoaded } = useFavorites();

  // Avant la lecture de localStorage, le rendu serveur et le premier rendu
  // client doivent être identiques : on n'affiche donc rien de définitif.
  if (!isLoaded) {
    return (
      <p className={styles.status} aria-live="polite">
        Chargement de vos favoris…
      </p>
    );
  }

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  if (favoriteProperties.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          Vous n’avez pas encore de favoris. Parcourez nos logements et touchez
          le cœur sur ceux qui vous plaisent&nbsp;: vous les retrouverez ici.
        </p>
        <Link href="/" className={styles.button}>
          Découvrir les logements
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className={styles.status}>
        {favoriteProperties.length}{' '}
        {favoriteProperties.length > 1 ? 'logements' : 'logement'} en favori
      </p>
      <ul className={styles.grid}>
        {favoriteProperties.map((property) => (
          <li key={property.id}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </>
  );
}
