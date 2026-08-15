'use client';

import type { MouseEvent } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { HeartIcon } from '@/components/icons/Icons';
import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  propertyId: string;
  /** Titre du logement, utilisé dans le libellé accessible. */
  propertyTitle: string;
}

/** Bouton d'ajout/retrait des favoris. */
export default function FavoriteButton({
  propertyId,
  propertyTitle,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  // Tant que localStorage n'est pas lu, on affiche l'état neutre :
  // c'est ce que le serveur a rendu, donc pas d'écart d'hydratation.
  const active = isLoaded && isFavorite(propertyId);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // La carte entière est un lien : sans ça, un clic sur le cœur navigue.
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(propertyId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={
        active
          ? `Retirer ${propertyTitle} de vos favoris`
          : `Ajouter ${propertyTitle} à vos favoris`
      }
      className={`${styles.button} ${active ? styles.active : ''}`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
