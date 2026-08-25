import Link from 'next/link';
import Image from 'next/image';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';
import AuthActions from './AuthActions';
import { HeartIcon, MessageIcon } from '@/components/icons/Icons';
import styles from './Header.module.scss';

/** Navigation reprise de la maquette. */
const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/messagerie', label: 'Messagerie' },
  { href: '/favoris', label: 'Favoris' },
];

/**
 * En-tête du site. Composant serveur, donc prérendu au build.
 *
 * L'état de connexion n'est volontairement pas lu ici : appeler `cookies()`
 * dans un composant du layout racine rendrait dynamiques toutes les routes,
 * y compris les 20 pages de logement prérendues. Cette lecture est déléguée
 * à `AuthActions`, un composant client qui interroge `/api/auth/me`.
 */
export default function Header() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.bar}>
        <div className={styles.inner}>
          <nav aria-label="Navigation principale" className={styles.nav}>
            <ul className={styles.list}>
              <li>
                <NavLink href="/">Accueil</NavLink>
              </li>
              <li>
                <NavLink href="/a-propos">À propos</NavLink>
              </li>
            </ul>
          </nav>

          <Link href="/" aria-label="Kasa, retour à l'accueil" className={styles.logo}>
            <Image
              src="/logo.svg"
              alt=""
              width={113}
              height={40}
              priority
              className={styles.logoDesktop}
            />
            <Image
              src="/logo-picto.svg"
              alt=""
              width={46}
              height={53}
              priority
              className={styles.logoMobile}
            />
          </Link>

          <div className={styles.actions}>
            <AuthActions />

            <div className={styles.iconGroup}>
              <Link href="/favoris" aria-label="Vos favoris" className={styles.iconLink}>
                <HeartIcon />
              </Link>
              <span className={styles.separator} aria-hidden="true" />
              <Link href="/messagerie" aria-label="Votre messagerie" className={styles.iconLink}>
                <MessageIcon />
              </Link>
            </div>
          </div>

          <MobileMenu items={NAV_ITEMS} />
        </div>
      </header>
    </div>
  );
}
