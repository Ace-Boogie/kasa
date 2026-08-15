import Link from 'next/link';
import styles from './ComingSoon.module.scss';

interface ComingSoonProps {
  /** Titre de la fonctionnalité, ex. « Messagerie ». */
  title: string;
  /** Une phrase décrivant ce que la page fera. */
  description: string;
}

/**
 * Page d'attente pour les fonctionnalités du Sprint 2.
 *
 * Elles figurent dans la maquette et sont donc présentes dans la navigation,
 * mais ne sont pas développées : cette page évite les liens morts.
 */
export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className={styles.container}>
      <p className={styles.badge}>Bientôt disponible</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <Link href="/" className={styles.button}>
        Retour aux logements
      </Link>
    </section>
  );
}
