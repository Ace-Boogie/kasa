import Link from 'next/link';
import styles from './not-found.module.scss';

export const metadata = {
  title: 'Page introuvable',
};

/** Page 404. Next l'affiche aussi quand un composant appelle `notFound()`. */
export default function NotFound() {
  return (
    <section className={styles.container}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>
        Il semble que la page que vous cherchez ait pris des vacances… ou n’ait
        jamais existé.
      </h1>
      <div className={styles.actions}>
        <Link href="/" className={styles.button}>
          Accueil
        </Link>
        <Link href="/#logements-titre" className={styles.button}>
          Logements
        </Link>
      </div>
    </section>
  );
}
