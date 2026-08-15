import type { Metadata } from 'next';
import Image from 'next/image';
import { getProperties } from '@/lib/api/properties';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import FavoritesSection from '@/components/FavoritesSection/FavoritesSection';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Kasa — Location de logements entre particuliers',
  description:
    'Trouvez un logement unique parmi nos annonces en Île-de-France. Appartements, studios et maisons sélectionnés avec soin par nos hôtes.',
};

/**
 * Page d'accueil : bandeau, liste complète des logements, section favoris.
 * Composant serveur — les données sont récupérées au rendu, pas dans le navigateur.
 */
export default async function HomePage() {
  const properties = await getProperties();

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Chez vous, partout et ailleurs</h1>
        <p className={styles.heroText}>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
      </section>

      {/* Bandeau d'illustration. Décoratif : alt vide, il n'apporte
          aucune information que le texte ne porte déjà. */}
      <div className={styles.banner}>
        <Image
          src="/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 1023px) 100vw, 1115px"
          priority
          className={styles.bannerImage}
        />
      </div>

      <section aria-labelledby="logements-titre">
        <h2 id="logements-titre" className="srOnly">
          Nos logements
        </h2>
        <ul className={styles.grid}>
          {properties.map((property) => (
            <li key={property.id}>
              {/* Le bandeau porte désormais le LCP : les cartes peuvent
                  toutes être chargées paresseusement. */}
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>
      </section>

      <FavoritesSection properties={properties} />

      <HowItWorks />
    </>
  );
}
