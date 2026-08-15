import Image from 'next/image';
import styles from './Footer.module.scss';

/** Pied de page : picto et mention de copyright. Composant serveur. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image src="/logo-picto.svg" alt="" width={46} height={53} />
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Kasa. Tous droits réservés.
      </p>
    </footer>
  );
}
