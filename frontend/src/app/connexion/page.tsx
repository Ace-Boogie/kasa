import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm/LoginForm';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Connexion',
  description:
    'Connectez-vous à votre compte Kasa pour retrouver vos réservations et vos annonces.',
  // Une page de connexion n'a aucun intérêt dans un index de recherche.
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <section className={styles.card}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Heureux de vous revoir</h1>
        <p className={styles.text}>
          Connectez-vous pour retrouver vos réservations, vos annonces et tout ce
          qui rend vos séjours uniques.
        </p>
      </header>

      <LoginForm />

      <p className={styles.links}>
        {/* Present dans la maquette, mais la reinitialisation par email n'est
            pas implementee : un <span> plutot qu'un lien sans destination,
            qui serait annonce comme cliquable par un lecteur d'ecran. */}
        <span
          className={styles.linkDisabled}
          title="Fonctionnalité à venir"
        >
          Mot de passe oublié
        </span>
        <Link href="/inscription" className={styles.link}>
          Pas encore de compte&nbsp;? Inscrivez-vous
        </Link>
      </p>
    </section>
  );
}
