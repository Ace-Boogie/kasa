'use client';

import { useId, useState, type FormEvent } from 'react';
import styles from './LoginForm.module.scss';

/**
 * Formulaire de connexion.
 *
 * Les identifiants partent vers `/api/auth/login`, un Route Handler qui
 * dialogue avec l'API Express et pose le cookie de session. Le jeton n'arrive
 * jamais jusqu'à ce composant.
 */
/**
 * Page à afficher après connexion.
 *
 * Le middleware ajoute `?suite=/favoris` lorsqu'il redirige un visiteur
 * déconnecté. On n'accepte qu'un chemin interne, commençant par une seule
 * barre oblique : `//exemple.com` serait interprété comme une URL absolue et
 * permettrait une redirection vers un site tiers.
 *
 * Lu depuis `window.location` au moment de l'envoi plutôt qu'avec
 * `useSearchParams` : ce hook impose d'envelopper la page dans un `Suspense`,
 * alors que `/connexion` est prérendue.
 */
function getRedirectTarget(): string {
  const suite = new URLSearchParams(window.location.search).get('suite');

  if (suite && suite.startsWith('/') && !suite.startsWith('//')) {
    return suite;
  }

  return '/';
}

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json();
        setError(data.error ?? 'La connexion a échoué.');
        return;
      }

      // Rechargement complet plutôt que router.push : le header appartient au
      // layout et ne serait pas remonté par une navigation côté client.
      window.location.href = getRedirectTarget();
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* `role="alert"` fait annoncer l'erreur dès son apparition. */}
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor={emailId} className={styles.label}>
          Adresse email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={passwordId} className={styles.label}>
          Mot de passe
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={styles.input}
        />
      </div>

      <button type="submit" disabled={isPending} className={styles.submit}>
        {isPending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
