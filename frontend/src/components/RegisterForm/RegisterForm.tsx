'use client';

import { useId, useState, type FormEvent } from 'react';
import styles from './RegisterForm.module.scss';

/** Longueur minimale imposée par l'API. */
const MIN_PASSWORD_LENGTH = 6;

/**
 * Vérifie la structure d'une adresse : du texte, une arobase, un domaine
 * avec extension. Volontairement simple — les motifs exhaustifs rejettent
 * des adresses pourtant valides, et seul un email de confirmation prouve
 * qu'une adresse existe. L'API ne validant pas le format, ce contrôle est
 * le seul garde-fou.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Formulaire de création de compte.
 *
 * La maquette distingue nom et prénom, alors que l'API n'expose qu'un seul
 * champ `name` : les deux sont concaténés à l'envoi.
 *
 * L'API renvoie un jeton dès l'inscription, l'utilisateur est donc redirigé
 * vers l'accueil déjà connecté. Le rechargement complet est volontaire :
 * l'en-tête appartient au layout et ne serait pas remonté par une navigation
 * côté client.
 */
export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const lastNameId = useId();
  const firstNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordHintId = useId();
  const termsId = useId();
  const errorId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const lastName = String(formData.get('lastName') ?? '').trim();
    const firstName = String(formData.get('firstName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const terms = formData.get('terms');

    // Validation côté client pour un retour immédiat ; l'API revérifie.
    if (!lastName || !firstName) {
      setError('Veuillez renseigner votre nom et votre prénom.');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
      );
      return;
    }

    if (!terms) {
      setError('Vous devez accepter les conditions générales d’utilisation.');
      return;
    }

    setIsPending(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json();
        setError(data.error ?? 'La création du compte a échoué.');
        return;
      }

      window.location.href = '/';
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor={lastNameId} className={styles.label}>Nom</label>
        <input
          id={lastNameId}
          name="lastName"
          type="text"
          autoComplete="family-name"
          required
          aria-describedby={error ? errorId : undefined}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={firstNameId} className={styles.label}>Prénom</label>
        <input
          id={firstNameId}
          name="firstName"
          type="text"
          autoComplete="given-name"
          required
          aria-describedby={error ? errorId : undefined}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={emailId} className={styles.label}>Adresse email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby={error ? errorId : undefined}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={passwordId} className={styles.label}>Mot de passe</label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          aria-describedby={`${passwordHintId}${error ? ` ${errorId}` : ''}`}
          className={styles.input}
        />
        <p id={passwordHintId} className={styles.hint}>
          {MIN_PASSWORD_LENGTH} caractères minimum.
        </p>
      </div>

      <div className={styles.terms}>
        <input id={termsId} name="terms" type="checkbox" required />
        <label htmlFor={termsId} className={styles.termsLabel}>
          J’accepte les{' '}
          {/* Les CGU ne font pas partie du périmètre : un <span> plutôt qu'un
              lien sans destination, qui serait annoncé comme cliquable. */}
          <span className={styles.termsLink} title="Document à venir">
            conditions générales d’utilisation
          </span>
        </label>
      </div>

      <button type="submit" disabled={isPending} className={styles.submit}>
        {isPending ? 'Inscription…' : 'S’inscrire'}
      </button>
    </form>
  );
}
