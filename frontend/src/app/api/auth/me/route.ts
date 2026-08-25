import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/session';

/**
 * Indique si une session est ouverte.
 *
 * Le cookie étant `httpOnly`, le navigateur ne peut pas le lire lui-même :
 * cette route est le seul moyen pour un composant client de connaître
 * l'état de connexion. Elle ne renvoie qu'un booléen, jamais le jeton.
 */
export async function GET() {
  return NextResponse.json(
    { isAuthenticated: await isAuthenticated() },
    // Chaque visiteur a sa propre session : rien ne doit être mis en cache.
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
