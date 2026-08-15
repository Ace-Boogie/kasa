import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import type { PropertySummary } from '@/types/property';
import styles from './PropertyCard.module.scss';

interface PropertyCardProps {
  property: PropertySummary;
  /** Charge l'image sans lazy loading. À réserver aux cartes visibles d'emblée. */
  priority?: boolean;
}

/**
 * Carte d'un logement sur la page d'accueil.
 *
 * Composant serveur : seul le bouton favori est client. La carte entière est
 * un lien vers la page de détail.
 */
export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const { id, slug, title, cover, location, pricePerNight } = property;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={cover}
          alt={`${title}, ${location}`}
          fill
          sizes="(max-width: 767px) 100vw, 355px"
          className={styles.image}
          priority={priority}
        />
        <div className={styles.favorite}>
          <FavoriteButton propertyId={id} propertyTitle={title} />
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.text}>
          <h2 className={styles.title}>
            <Link href={`/properties/${slug}`} className={styles.link}>
              {title}
            </Link>
          </h2>
          <p className={styles.location}>{location}</p>
        </div>

        <p className={styles.price}>
          <span className={styles.amount}>{pricePerNight}€</span>
          <span className={styles.unit}>par nuit</span>
        </p>
      </div>
    </article>
  );
}
