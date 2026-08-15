# Kasa — front-end

Interface Next.js (App Router, TypeScript) branchee sur l'API Express fournie
par OpenClassrooms.

## Prerequis

- Node.js 20 ou superieur
- Le back-end du projet, clone dans `../backend`

## Lancement en developpement

Deux terminaux.

**1. Le back-end**, sur le port 3000 :

```powershell
cd ../backend
npm install
$env:PORT=3000; npm start
```

Documentation de l'API : http://localhost:3000/docs.html

**2. Le front-end**, sur le port 3001 :

```powershell
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Le site est accessible sur http://localhost:3001

## Source des donnees

La couche `src/lib/api/` bascule automatiquement entre deux sources selon la
presence de la variable `API_URL` :

| API_URL | Source | Contexte |
|---|---|---|
| definie | back-end Express local | developpement |
| absente | `src/lib/api/properties.mock.json` | production (Vercel) |

Le fichier de mock est un instantane des 20 logements de la base du back-end.
Il permet au site deploye de rester consultable sans serveur a lancer, comme
le prevoit l'etape 10 du brief.

## Tests

```powershell
npm test
npm run test:watch
```

Les tests sont colocalises : `PropertyCard.test.tsx` vit a cote de
`PropertyCard.tsx`.

## Build de production

```powershell
npm run build
npm start
```

Les audits Lighthouse doivent etre lances sur ce build, en navigation privee,
apres avoir visite chaque page une fois pour remplir le cache d'images.

## Choix techniques

- **Rendu serveur par defaut.** Seuls le carrousel, le bouton favori, la
  section favoris et le menu mobile portent `"use client"`.
- **Pages de detail prerendues** au build via `generateStaticParams`.
- **Favoris** en Context + `localStorage`, conformement au backlog.
- **Accessibilite** WCAG 2.1 AA : zero erreur WAVE sur toutes les pages.
- **browserslist** cible des navigateurs recents, coherent avec l'usage de
  `:has()` et `inert`.

## Ecarts entre la maquette et le backlog

- Le **carrousel** et les **collapses** sont exiges par le backlog mais absents
  de la maquette Figma. Le backlog, qui porte les criteres d'acceptation, a ete
  suivi.
- Les pages Messagerie, Favoris et Ajout de logement relevent du Sprint 2 :
  elles figurent dans la navigation de la maquette et affichent une page
  « Bientot disponible » plutot qu'un lien mort.
