'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon, CloseIcon } from '@/components/icons/Icons';
import AuthActions from './AuthActions';
import styles from './MobileMenu.module.scss';

interface NavItem {
  href: string;
  label: string;
}

/**
 * Menu plein écran affiché sous le point de rupture tablette.
 *
 * Se ferme à la croix, à la touche Échap et au changement de page.
 * Le focus revient sur le bouton d'ouverture à la fermeture, et le
 * défilement de la page est bloqué tant que le menu est ouvert.
 */
export default function MobileMenu({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Ferme le menu quand l'utilisateur navigue.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    openButtonRef.current?.focus();
  }

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Ouvrir le menu"
        className={styles.burger}
      >
        <MenuIcon width={29} height={29} />
      </button>

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={styles.panelHeader}>
            <Link href="/" aria-label="Kasa, retour à l'accueil">
              <Image src="/logo-picto.svg" alt="" width={46} height={53} />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Fermer le menu"
              className={styles.close}
            >
              <CloseIcon width={26} height={26} />
            </button>
          </div>

          <nav aria-label="Navigation principale">
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.href} className={styles.item}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={styles.link}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <AuthActions />
          </div>
        </div>
      )}
    </>
  );
}
