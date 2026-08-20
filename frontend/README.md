# Kasa — front-end

Interface Next.js (App Router, TypeScript) pour la plateforme de location de
logements entre particuliers Kasa, branchee sur l'API Express fournie par
OpenClassrooms.

**Site en ligne : https://kasa-gamma-sage.vercel.app**

## Sommaire

- [Prerequis](#prerequis)
- [Lancement en developpement](#lancement-en-developpement)
- [Source des donnees](#source-des-donnees)
- [Tests](#tests)
- [Build de production](#build-de-production)
- [Architecture](#architecture)
- [Choix techniques](#choix-techniques)
- [Ecarts entre la maquette et le backlog](#ecarts-entre-la-maquette-et-le-backlog)

## Prerequis

- Node.js 20 ou superieur
- Le back-end du projet, clone dans `../backend`

## Lancement en developpement

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

| Variable | Role |
|---|---|
| `API_URL` | URL du back-end Express. Son absence bascule le site sur les donnees figees. |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, utilisee par le sitemap, `robots.txt` et les balises Open Graph. |

## Source des donnees

La couche `src/lib/api/` bascule automatiquement entre deux sources selon la
presence de `API_URL` :

| `API_URL` | Source | Contexte |
|---|---|---|
| definie | back-end Express local | developpement |
| absente | `src/lib/api/properties.mock.json` | production (Vercel) |

Le fichier de mock est un instantane des 20 logements de la base du back-end.
Il permet au site deploye de rester consultable sans serveur a lancer, comme
le prevoit l'etape 10 du brief.

Pour verifier ce comportement en local, renommer `.env.local` et relancer :
le site continue de fonctionner, sans back-end.

## Tests

```powershell
npm test           # execution unique
npm run test:watch # mode surveillance
```

44 tests repartis sur 4 suites. Les tests sont colocalises : `Carousel.test.tsx`
vit a cote de `Carousel.tsx`.

| Suite | Couverture |
|---|---|
| `Carousel` | bouclage, cas d'une seule image, clavier, vignettes |
| `FavoritesContext` | ajout, retrait, persistance, donnees corrompues |
| `FavoriteButton` | etats, libelles accessibles, `localStorage` |
| `Collapse` | ouverture, fermeture, `aria-expanded` |

## Build de production

```powershell
npm run build
npm start
```

Les audits Lighthouse doivent etre lances sur ce build, en navigation privee
et sans extension, apres avoir visite chaque page une fois pour remplir le
cache d'images.

## Architecture

```
src/
├── app/                    routes, layouts, pages
│   ├── api/auth/           Route Handlers d'authentification (BFF)
│   ├── properties/[slug]/  page detail, prerendue au build
│   ├── sitemap.ts
│   └── robots.ts
├── components/             composants d'interface
├── context/                FavoritesContext
├── lib/
│   ├── api/                acces aux donnees, normalisation
│   └── auth/               lecture de session cote serveur
├── styles/                 variables et styles globaux
└── types/                  types du domaine
```

## Choix techniques

**Rendu serveur par defaut.** Seuls le carrousel, le bouton favori, la liste
des favoris, le menu mobile, les liens de navigation et le formulaire de
connexion portent `"use client"`. Le reste est rendu cote serveur.

**Pages de detail prerendues** au build via `generateStaticParams` : les 20
logements sont des fichiers HTML complets, sans appel API a la visite.

**Resolution du slug.** L'API n'expose que `/api/properties/:id` et n'accepte
pas les slugs. La correspondance slug vers id se fait via la liste, mise en
cache par Next : les URL restent lisibles sans requete supplementaire.

**Favoris** en Context et `localStorage`, conformement au backlog. Un drapeau
`isLoaded` empeche les erreurs d'hydratation : l'etat neutre est affiche tant
que `localStorage` n'a pas ete lu.

**Authentification en BFF.** L'API renvoie le JWT dans le corps de sa reponse.
Le Route Handler `/api/auth/login` l'intercepte cote serveur et le depose dans
un cookie `httpOnly`, inaccessible au JavaScript du navigateur. Le jeton ne
transite jamais par le client.

**En-tete volontairement statique.** Une premiere version lisait la session
pour afficher l'etat de connexion. Mais `cookies()` rend la route dynamique,
et comme l'en-tete vit dans le layout racine, les 20 pages de logement
basculaient du prerendu vers un rendu a la demande. Le brief demandant un
rendu serveur « autant que possible », le prerendu a ete privilegie.

**Accessibilite WCAG 2.1 AA** : zero erreur et zero alerte WAVE sur toutes les
pages, navigation clavier complete, respect de `prefers-reduced-motion`.

**browserslist** cible des navigateurs recents, coherent avec l'usage de
`:has()` et `inert`. Cela supprime environ 13 Kio de polyfills inutiles.

## Ecarts entre la maquette et le backlog

- Le **carrousel** et les **collapses** sont exiges par le backlog mais absents
  de la maquette Figma. Le backlog, qui porte les criteres d'acceptation, a ete
  suivi. Le carrousel reprend le motif image principale plus vignettes, present
  sur les deux ecrans de la maquette.
- Les pages **Messagerie**, **Ajout de logement** et **Inscription** relevent du
  Sprint 2 : elles figurent dans la navigation de la maquette et affichent une
  page « Bientot disponible » plutot qu'un lien mort.
- La maquette suppose un utilisateur deja connecte et ne prevoit pas de point
  d'entree vers la page de connexion. Un lien **« Se connecter »** a ete ajoute
  dans l'en-tete : sans lui, une fonctionnalite du Sprint 1 serait accessible
  uniquement en saisissant son URL.
- La page **Favoris**, prevue au Sprint 2, a ete realisee : les donnees etaient
  deja disponibles cote client et la carte de logement existait.