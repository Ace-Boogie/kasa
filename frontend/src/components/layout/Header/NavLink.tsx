'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavLink.module.scss';

interface NavLinkProps {
  href: string;
  children: string;
  className?: string;
}

/**
 * Lien de navigation qui signale la page courante via `aria-current`.
 *
 * Client uniquement pour lire l'URL. Le libellé est dupliqué dans
 * `data-text` : le pseudo-élément `::after` en réserve la largeur en gras,
 * ce qui évite que les items voisins bougent au survol.
 */
export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      data-text={children}
      className={`${styles.link} ${isCurrent ? styles.current : ''} ${className ?? ''}`}
    >
      {children}
    </Link>
  );
}
