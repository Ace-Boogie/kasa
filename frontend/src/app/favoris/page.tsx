import type { Metadata } from 'next';
import { getProperties } from '@/lib/api/properties';
import FavoritesList from '@/components/FavoritesList/FavoritesList';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Vos favoris',
  description:
    'Retrouvez ici tous les logements Kasa que vous avez aimés, prêts à être réservés.',
  // La sélection est propre à chaque visiteur : rien à indexer.
  robots: { index: false, follow: true },
};

/**
 * Page Favoris.
 *
 * La liste complète des logements est chargée côté serveur, puis filtrée
 * côté client selon la sélection enregistrée dans `localStorage`.
 */
export default async function FavorisPage() {
  const properties = await getProperties();

  return (
    <section aria-labelledby="favoris-titre" className={styles.section}>
      <header className={styles.intro}>
        <h1 id="favoris-titre" className={styles.title}>
          Vos favoris
        </h1>
        <p className={styles.text}>
          Retrouvez ici tous les logements que vous avez aimés. Prêts à réserver&nbsp;?
          Un simple clic et votre prochain séjour est en route.
        </p>
      </header>

      <FavoritesList properties={properties} />
    </section>
  );
}
