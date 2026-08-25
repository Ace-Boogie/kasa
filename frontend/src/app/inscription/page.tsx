import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm/RegisterForm';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Inscription',
  description:
    'Créez votre compte Kasa pour réserver un logement ou proposer le vôtre.',
  robots: { index: false, follow: true },
};

/**
 * Page de création de compte.
 *
 * La coquille est statique ; seul le formulaire est un composant client.
 * Les informations transitent par `/api/auth/register`, qui pose le cookie
 * de session côté serveur.
 */
export default function InscriptionPage() {
  return (
    <section className={styles.card}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Rejoignez la communauté Kasa</h1>
        <p className={styles.text}>
          Créez votre compte et commencez à voyager autrement&nbsp;: réservez des
          logements uniques, découvrez de nouvelles destinations et partagez vos
          propres lieux avec d’autres voyageurs.
        </p>
      </header>

      <RegisterForm />

      <p className={styles.links}>
        <Link href="/connexion" className={styles.link}>
          Déjà membre&nbsp;? Se connecter
        </Link>
      </p>
    </section>
  );
}
