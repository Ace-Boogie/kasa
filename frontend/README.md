# Kasa — front-end

Interface Next.js (App Router, TypeScript) pour la plateforme de location de
logements entre particuliers Kasa, branchée sur l'API Express fournie par
OpenClassrooms.

**Site en ligne : https://kasa-gamma-sage.vercel.app**

## Sommaire

- [Compte de démonstration](#compte-de-démonstration)
- [Prérequis](#prérequis)
- [Lancement en développement](#lancement-en-développement)
- [Source des données](#source-des-données)
- [Tests](#tests)
- [Build de production](#build-de-production)
- [Architecture](#architecture)
- [Choix techniques](#choix-techniques)
- [Écarts entre la maquette et le backlog](#écarts-entre-la-maquette-et-le-backlog)

## Compte de démonstration

Le back-end démarre avec une base sans identifiants : le jeu de données
initial décrit les hôtes avec un nom et une photo, sans email ni mot de passe.
Il faut donc créer un compte, via la page `/inscription` du site ou via
`POST /auth/register` sur http://localhost:3000/docs.html

Tous les comptes sont créés avec le rôle `owner` : il donne accès à la
publication de logements sans rien retirer des actions ouvertes aux clients
(consultation, favoris, réservation).

## Prérequis

- Node.js 20 ou supérieur
- Le back-end du projet, cloné dans `../backend`

## Lancement en développement

Deux terminaux.

**1. Le back-end**, sur le port 3000 :

```powershell
cd ../backend
npm install
$env:PORT=3000; $env:JWT_SECRET="dev-secret"; npm start
```

Documentation de l'API : http://localhost:3000/docs.html

**2. Le front-end**, sur le port 3001 :

```powershell
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Le site est accessible sur http://localhost:3001

### Variables d'environnement

| Variable | Rôle |
|---|---|
| `API_URL` | URL du back-end Express. Son absence bascule le site sur les données figées. |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, utilisée par le sitemap, `robots.txt` et les balises Open Graph. |

## Source des données

La couche `src/lib/api/` bascule automatiquement entre deux sources selon la
présence de `API_URL` :

| `API_URL` | Source | Contexte |
|---|---|---|
| définie | back-end Express local | développement |
| absente | `src/lib/api/properties.mock.json` | production (Vercel) |

Le fichier de mock est un instantané des 20 logements de la base du back-end.
Il permet au site déployé de rester consultable sans serveur à lancer, comme
le prévoit l'étape 10 du brief.

Pour vérifier ce comportement en local, renommer `.env.local` et relancer :
le site continue de fonctionner, sans back-end.

### La messagerie fait exception

`src/lib/api/messages.ts` lit toujours `conversations.mock.json`, sans
bascule. L'API fournie n'expose aucune route de messagerie — ni table
`conversations`, ni table `messages` — et le brief place cette fonctionnalité
en Sprint 2. Tester `API_URL` reviendrait à interroger une route inexistante
dès que le back-end tourne, et à recevoir une 404.

Le mock reproduit néanmoins la forme qu'aurait la réponse d'Express, en
`snake_case`, et passe par la même normalisation que les logements. Le jour où
les routes existeront, seule cette couche changera : les composants ne voient
que du camelCase normalisé.

## Tests

```powershell
npm test           # exécution unique
npm run test:watch # mode surveillance
```

44 tests répartis sur 4 suites. Les tests sont colocalisés :
`Carousel.test.tsx` vit à côté de `Carousel.tsx`.

| Suite | Couverture |
|---|---|
| `Carousel` | bouclage, cas d'une seule image, clavier, vignettes |
| `FavoritesContext` | ajout, retrait, persistance, données corrompues |
| `FavoriteButton` | états, libellés accessibles, `localStorage` |
| `Collapse` | ouverture, fermeture, `aria-expanded` |

Les composants de la messagerie et la page d'ajout de logement ne sont pas
couverts : le backlog n'exige de tests unitaires que sur le carrousel et les
favoris, et ces deux pages relèvent du Sprint 2.

## Build de production

```powershell
npm run build
npm start
```

Les audits Lighthouse doivent être lancés sur ce build, en navigation privée
et sans extension, après avoir visité chaque page une fois pour remplir le
cache d'images.

**Invariant à vérifier après chaque modification :** la sortie de
`npm run build` doit toujours afficher les 20 pages de logement en `●`,
c'est-à-dire prérendues au build.

## Architecture

```
src/
├── app/                    routes, layouts, pages
│   ├── api/auth/           Route Handlers d'authentification (BFF)
│   │   ├── login/          pose le cookie de session
│   │   ├── logout/         le supprime
│   │   ├── register/       création de compte
│   │   └── me/             état de session, booléen uniquement
│   ├── properties/[slug]/  page détail, prérendue au build
│   ├── messagerie/         liste des conversations
│   │   └── [id]/           fil de discussion
│   ├── ajouter-un-logement/
│   ├── favoris/
│   ├── connexion/ inscription/
│   ├── sitemap.ts
│   └── robots.ts
├── components/             composants d'interface
│   └── Messagerie/         liste, fil, coquille deux panneaux
├── context/                FavoritesContext
├── lib/
│   ├── api/                accès aux données, normalisation
│   └── auth/               lecture de session côté serveur
├── styles/                 variables et styles globaux
├── types/                  types du domaine
└── proxy.ts                protection des pages privées
```

## Choix techniques

**Rendu serveur par défaut.** Seuls le carrousel, le bouton favori, la liste
des favoris, le menu mobile, les liens de navigation, les formulaires et le
fil de discussion portent `"use client"`. Le reste est rendu côté serveur.

**Pages de détail prérendues** au build via `generateStaticParams` : les 20
logements sont des fichiers HTML complets, sans appel API à la visite.

**Résolution du slug.** L'API n'expose que `/api/properties/:id` et n'accepte
pas les slugs. La correspondance slug vers id se fait via la liste, mise en
cache par Next : les URL restent lisibles sans requête supplémentaire.

**Favoris** en Context et `localStorage`, conformément au backlog. Un drapeau
`isLoaded` empêche les erreurs d'hydratation : l'état neutre est affiché tant
que `localStorage` n'a pas été lu.

**Authentification en BFF.** L'API renvoie le JWT dans le corps de sa réponse.
Le Route Handler `/api/auth/login` l'intercepte côté serveur et le dépose dans
un cookie `httpOnly`, inaccessible au JavaScript du navigateur. Le jeton ne
transite jamais par le client.

**État de connexion lu côté client.** Une première version lisait la session
dans l'en-tête, côté serveur. Mais `cookies()` rend la route dynamique, et
comme l'en-tête vit dans le layout racine, les 20 pages de logement
basculaient du prérendu vers un rendu à la demande.

La lecture est donc déléguée à `AuthActions`, un composant client qui
interroge `/api/auth/me`. Cette route ne renvoie qu'un booléen, jamais le
jeton. L'en-tête reste un composant serveur prérendu, et le coût de la
session est isolé dans un seul composant.

**Pages privées protégées par `proxy.ts`.** `/favoris`, `/messagerie` et
`/ajouter-un-logement` redirigent vers `/connexion` en l'absence de session.
La page demandée est mémorisée dans le paramètre `suite`, et l'utilisateur y
est ramené après connexion.

Le choix du proxy plutôt qu'un appel à `cookies()` dans chaque page tient au
mode de rendu : lire le cookie dans un composant serveur forcerait la route à
être rendue à la demande, alors que le proxy s'exécute avant la route sans
rien y changer. Les pages protégées restent prérendues.

Cette vérification teste la présence du cookie, pas la validité du jeton :
c'est un aiguillage d'interface, pas une barrière de sécurité. La véritable
protection reste côté API, où chaque route sensible vérifie la signature du
JWT et le rôle.

`proxy.ts` remplace la convention `middleware.ts`, dépréciée depuis
Next.js 16.

**Messagerie sur données figées.** Liste et fil de discussion sont
fonctionnels, mais les messages envoyés ne sont pas conservés : aucune route
API ne permet de les écrire. Une mention l'indique sous le champ de saisie.

**Page d'ajout de logement en présentation.** L'interface est complète, mais
le formulaire n'envoie rien. C'est un composant serveur sans état : la page
n'expédie aucun JavaScript au navigateur.

**Accessibilité WCAG 2.1 AA** : zéro erreur et zéro alerte WAVE, navigation
clavier complète, respect de `prefers-reduced-motion`.

**browserslist** cible des navigateurs récents, cohérent avec l'usage de
`:has()` et `inert`. Cela supprime environ 13 Kio de polyfills inutiles.

## Écarts entre la maquette et le backlog

### Fonctionnalités

- Le **carrousel** et les **collapses** sont exigés par le backlog mais absents
  de la maquette Figma. Le backlog, qui porte les critères d'acceptation, a été
  suivi. Le carrousel reprend le motif image principale plus vignettes, présent
  sur les deux écrans de la maquette.
- Les pages **Favoris** et **Inscription**, prévues au Sprint 2, ont été
  réalisées : les données et les composants existaient déjà.
- Les pages **Messagerie** et **Ajout de logement** relèvent également du
  Sprint 2. Elles sont présentes en interface, sans traitement : la messagerie
  parce que l'API n'expose aucune route pour elle, l'ajout de logement par
  manque de temps — les routes `POST /api/properties` et
  `POST /api/uploads/image`, elles, existent.

### En-tête et connexion

- La maquette suppose un utilisateur déjà connecté et ne prévoit aucun bouton
  de connexion. Par fidélité à la maquette, l'en-tête affiche donc
  **« + Ajouter un logement » en permanence**, connecté ou non.
- Un visiteur déconnecté qui suit ce lien est redirigé vers la page de
  connexion, puis ramené sur la page d'ajout une fois identifié.
- **Compromis assumé** : l'absence de bouton de connexion explicite est une
  faiblesse d'ergonomie. Un vrai produit afficherait un point d'entrée clair.
  Le choix a été fait de suivre la maquette et de compenser par la redirection.

### Détails d'interface

- Les liens **« Mot de passe oublié »** et **« conditions générales
  d'utilisation »** figurent dans la maquette mais ne mènent nulle part : ils
  sont affichés en texte non cliquable plutôt qu'en liens morts.
- La maquette distingue **nom et prénom** à l'inscription, alors que l'API
  n'expose qu'un champ `name` : les deux sont concaténés à l'envoi.
- Dans la messagerie, les **tailles de police ont été relevées**. La maquette
  descend à 10 px pour l'aperçu d'un message et 8 px pour la ligne d'auteur,
  en dessous du lisible. Les deux sont portées à 12 px.
- Les **heures** sont affichées au format 24 h plutôt que le « 11:04 am » de
  la maquette, pour un site en français.
- L'écran desktop de la messagerie ne montre ni en-tête ni pied de page dans
  la maquette. Les deux sont conservés : ils appartiennent au layout racine et
  valent pour tout le site.