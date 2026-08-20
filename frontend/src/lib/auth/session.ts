import { cookies } from 'next/headers';

const COOKIE_NAME = 'kasa_token';

/**
 * Lit le jeton de session, côté serveur uniquement.
 *
 * Le cookie étant `httpOnly`, cette fonction ne peut pas être appelée depuis
 * un composant client — c'est précisément l'intérêt du dispositif.
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/** Indique si une session est ouverte. */
export async function isAuthenticated(): Promise<boolean> {
  return (await getToken()) !== null;
}

/**
 * En-têtes d'authentification à joindre à un appel API protégé.
 *
 * @example
 * const res = await fetch(url, { headers: await authHeaders() });
 */
export async function authHeaders(): Promise<HeadersInit> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
