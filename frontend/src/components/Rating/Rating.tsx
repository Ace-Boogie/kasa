import styles from './Rating.module.scss';

interface RatingProps {
  /** Note du logement, de 0 à 5. */
  value: number;
  /** Nombre d'avis ayant produit cette note. */
  count?: number;
}

/**
 * Note d'un logement : une étoile et la valeur chiffrée.
 *
 * Le texte visible se limite au chiffre, comme dans la maquette ; le sens
 * complet est porté par un libellé réservé aux lecteurs d'écran.
 */
export default function Rating({ value, count }: RatingProps) {
  const label =
    count && count > 0
      ? `Note de ${value} sur 5, ${count} avis`
      : `Note de ${value} sur 5`;

  return (
    <p className={styles.rating}>
      <span className="srOnly">{label}</span>

      <svg
        viewBox="0 0 20 19"
        width="19"
        height="19"
        aria-hidden="true"
        focusable="false"
        className={styles.star}
      >
        <path
          d="M10 0.5l2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L10 14.6 4.4 17.7l1.3-6.3L1 7.1l6.3-.7L10 .5z"
          fill="currentColor"
        />
      </svg>

      <span aria-hidden="true" className={styles.value}>
        {value}
      </span>
    </p>
  );
}
