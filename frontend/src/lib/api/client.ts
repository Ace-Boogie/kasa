const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

/** Erreur portant le code HTTP renvoyé par l'API. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Durée du cache Next, en secondes. 60 par défaut. */
  revalidate?: number;
}

/**
 * Appelle l'API Kasa et renvoie le JSON typé.
 *
 * @param path Chemin commençant par « / », ex. « /api/properties ».
 * @throws {ApiError} Si la réponse n'est pas 2xx.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { revalidate = 60, ...init } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new ApiError(`API ${res.status} sur ${path}`, res.status);
  }

  return res.json() as Promise<T>;
}
