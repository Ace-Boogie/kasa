import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const COOKIE_NAME = 'kasa_token';

interface RegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Backend For Frontend : création de compte.
 *
 * L'API renvoie un jeton dès l'inscription : le nouvel utilisateur est donc
 * connecté immédiatement. Comme pour la connexion, ce jeton est intercepté
 * côté serveur et déposé dans un cookie `httpOnly` sans jamais transiter par
 * le JavaScript du navigateur.
 */
export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Nom, adresse email et mot de passe sont requis.' },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
      { status: 400 }
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        // Tous les comptes sont créés en `owner` : ce rôle donne accès à la
        // publication de logements sans rien retirer des actions ouvertes aux
        // clients (consultation, favoris, réservation). Cela évite de demander
        // un choix au visiteur, et de le bloquer s'il change d'avis.
        role: 'owner',
      }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      { error: 'Service indisponible. Réessayez dans un instant.' },
      { status: 503 }
    );
  }

  if (!response.ok) {
    // 409 : l'adresse est déjà utilisée. C'est le seul cas où l'on peut être
    // explicite, puisque l'utilisateur cherche justement à créer ce compte.
    const message =
      response.status === 409
        ? 'Cette adresse email est déjà associée à un compte.'
        : 'La création du compte a échoué. Vérifiez vos informations.';

    return NextResponse.json({ error: message }, { status: response.status });
  }

  const data: { token?: string } = await response.json();

  if (!data.token) {
    return NextResponse.json(
      { error: 'Réponse inattendue du serveur.' },
      { status: 502 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ ok: true });
}
