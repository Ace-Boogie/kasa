'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogoutIcon } from '@/components/icons/Icons';
import styles from './AuthActions.module.scss';

/**
 * Actions liées à la session, dans l'en-tête.
 *
 * L'état est récupéré côté client via `/api/auth/me`, et non lu directement
 * depuis le cookie : appeler `cookies()` dans l'en-tête rendrait dynamiques
 * toutes les routes du site, y compris les 20 pages de logement prérendues.
 * Ce composant isole le coût de la session au seul endroit qui en a besoin.
 */
export default function AuthActions() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { isAuthenticated: boolean }) => {
        if (!cancelled) setIsAuth(data.isAuthenticated);
      })
      .catch(() => {
        // En cas d'échec, on suppose l'utilisateur déconnecté.
        if (!cancelled) setIsAuth(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  // Tant que la réponse n'est pas arrivée, on réserve la place sans rien
  // afficher : cela évite un clignotement entre les deux états.
  if (isAuth === null) {
    return <span className={styles.placeholder} aria-hidden="true" />;
  }

  if (!isAuth) {
    return (
      <Link href="/connexion" className={styles.link}>
        Se connecter
      </Link>
    );
  }

  return (
    <>
      <Link href="/ajouter-un-logement" className={styles.link}>
        + Ajouter un logement
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Se déconnecter"
        title="Se déconnecter"
        className={styles.logout}
      >
        <LogoutIcon />
      </button>
    </>
  );
}
