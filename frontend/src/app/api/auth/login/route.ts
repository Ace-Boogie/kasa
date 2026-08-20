import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const COOKIE_NAME = 'kasa_token';

interface LoginBody {
  email?: string;
  password?: string;
}

/**
 * Backend For Frontend : point d'entrée de la connexion.
 *
 * L'API Express renvoie le JWT dans le corps de sa réponse. S'il transitait
 * jusqu'au navigateur, n'importe quel script pourrait le lire — une faille XSS
 * suffirait à usurper le compte. Ce handler l'intercepte côté serveur et le
 * dépose dans un cookie `httpOnly`, inaccessible au JavaScript client.
 */
export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Adresse email et mot de passe sont requis.' },
      { status: 400 }
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      { error: 'Service indisponible. Réessayez dans un instant.' },
      { status: 503 }
    );
  }

  if (!response.ok) {
    // Message volontairement identique pour un email inconnu et un mot de
    // passe erroné : distinguer les deux révélerait quels comptes existent.
    return NextResponse.json(
      { error: 'Adresse email ou mot de passe incorrect.' },
      { status: 401 }
    );
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
