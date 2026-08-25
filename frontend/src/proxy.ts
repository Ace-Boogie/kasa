import { NextResponse, type NextRequest } from 'next/server';

/** Cookie de session posé par les Route Handlers d'authentification. */
const COOKIE_NAME = 'kasa_token';

/** Page vers laquelle rediriger un visiteur non connecté. */
const LOGIN_PATH = '/connexion';

/**
 * Protège les pages réservées aux utilisateurs connectés.
 *
 * **Pourquoi un proxy plutôt qu'un appel à `cookies()` dans chaque page.**
 * Lire le cookie dans un composant serveur force Next à rendre la route à la
 * demande : elle passe de `●` ou `○` à `ƒ` dans la sortie de `npm run build`.
 * Le proxy s'exécute avant la route, sans rien changer à son mode de
 * rendu — les pages protégées restent prérendues, et les 20 pages de logement
 * ne sont pas concernées du tout.
 *
 * **Ce que cette vérification garantit, et ce qu'elle ne garantit pas.** Elle
 * teste la présence du cookie, pas la validité du jeton : un cookie expiré ou
 * falsifié passerait. C'est suffisant ici, parce qu'il s'agit d'un aiguillage
 * d'interface — éviter d'afficher une page vide à un visiteur déconnecté. La
 * vraie protection reste côté API, où chaque route sensible vérifie la
 * signature du JWT et le rôle. Le proxy ne fait pas d'appel réseau,
 * ce qui le garde instantané.
 */
export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has(COOKIE_NAME);

  if (isAuthenticated) return NextResponse.next();

  const loginUrl = new URL(LOGIN_PATH, request.url);

  // Mémorise la page demandée pour y revenir après la connexion.
  loginUrl.searchParams.set(
    'suite',
    request.nextUrl.pathname + request.nextUrl.search
  );

  return NextResponse.redirect(loginUrl);
}

/**
 * Routes protégées.
 *
 * Le `matcher` est évalué à la compilation : le proxy ne s'exécute que
 * sur ces chemins, et pas sur les pages publiques ni sur les fichiers
 * statiques.
 */
export const config = {
  matcher: ['/favoris', '/messagerie/:path*', '/ajouter-un-logement'],
};
