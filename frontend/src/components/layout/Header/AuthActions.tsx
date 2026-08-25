'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogoutIcon } from '@/components/icons/Icons';
import styles from './AuthActions.module.scss';

/**
 * Actions liées à la session, dans l'en-tête.
 *
 * **Le lien « + Ajouter un logement » est affiché en permanence**, connecté ou
 * non, pour rester fidèle à la maquette — qui ne prévoit aucun point d'entrée
 * vers la connexion. Un visiteur déconnecté qui le suit est redirigé vers
 * `/connexion` par le middleware, puis ramené sur la page d'ajout une fois
 * identifié. Le lien n'a donc pas besoin de connaître l'état de la session :
 * la protection vit à un seul endroit, `src/middleware.ts`.
 *
 * L'état de session n'est utilisé que pour le bouton de déconnexion, qui
 * n'aurait aucun sens hors session. Il est récupéré via `/api/auth/me`, et non
 * lu directement depuis le cookie : appeler `cookies()` dans l'en-tête rendrait
 * dynamiques toutes les routes du site, y compris les 20 pages de logement
 * prérendues.
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

  return (
    <>
      <Link href="/ajouter-un-logement" className={styles.link}>
        + Ajouter un logement
      </Link>

      {isAuth === null ? (
        // Tant que la réponse n'est pas arrivée, on réserve la place de
        // l'icône : cela évite que l'en-tête ne se décale à son apparition.
        <span className={styles.placeholder} aria-hidden="true" />
      ) : (
        isAuth && (
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className={styles.logout}
          >
            <LogoutIcon />
          </button>
        )
      )}
    </>
  );
}
