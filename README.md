# Smart Identity

> Évaluation individuelle — Vue / Nuxt + Node / Express + MongoDB

Bracelet NFC phygital permettant de partager son profil professionnel (réseaux, contact, portfolio) en un simple scan. L'utilisateur crée une page publique personnalisée accessible via l'URL générée par son bracelet — sans app à installer pour la personne qui scanne.

---

## Concept retenu : Smart Identity (option recommandée)

**Problème résolu** : échanger des cartes de visite ou dicter ses coordonnées est lent et peu mémorable. Un scan de bracelet NFC ouvre instantanément le profil complet de la personne.

**Cible** : freelances, designers, développeurs, commerciaux — tout professionnel qui fait du networking.

**Parcours utilisateur** :
1. L'utilisateur commande un bracelet → le configure dans son dashboard → personnalise sa page publique
2. Lors d'une rencontre, il approche son bracelet → le smartphone de l'interlocuteur ouvre `/u/son-slug`
3. Le profil (bio, liens, réseaux) s'affiche instantanément, sans friction

---

## Stack technique

| Côté | Technologies | Justification |
|------|-------------|---------------|
| Frontend | **Nuxt 4**, Vue 3, Pinia, Tailwind CSS | SSR natif pour le SEO du site marketing ; file-based routing ; Pinia recommandé par le sujet |
| Backend | **Node.js**, Express 5, Mongoose | Léger, orienté JSON, parfaitement adapté à une API REST |
| Base de données | **MongoDB** via Docker | Documents flexibles, adapté aux profils utilisateur à structure variable |
| Auth | **JWT** (cookie + header) | Stateless, partageable entre SaaS et e-commerce sans session serveur |
| Validation | **Zod** | Validation schéma avec messages d'erreur précis par champ |
| Logs | **Winston** | Multi-transport (console + fichier), niveaux configurables |
| Tests | **Vitest + Supertest** | Tests d'intégration sur l'API réelle (pas de mocks) |

---

## Architecture

**Choix central : une seule app Nuxt avec 3 layouts** plutôt que 3 projets séparés.

Cela permet une **auth partagée naturellement** (même store Pinia, même cookie JWT pour SaaS et e-commerce), une **cohérence visuelle garantie**, et le **SSR de Nuxt** assure le SEO sur le site marketing sans configuration supplémentaire.

```
projet_vue_js/
├── backend/
│   ├── src/
│   │   ├── config/        db.js (connexion Mongoose), logger.js (Winston)
│   │   ├── controllers/   auth, profile, nfc, product, order, marketing, public
│   │   ├── middlewares/   auth.js, errorHandler.js, requestLogger.js, notFound.js
│   │   ├── models/        User, NfcObject, Product, Order, MarketingContent
│   │   ├── routes/        auth, profile (/me/*), products, orders, marketing, public
│   │   ├── services/      authService.js (register / login / signToken)
│   │   └── utils/         AppError.js
│   ├── scripts/seed.js    données de démo
│   └── tests/             auth.test.js, products.test.js, profile.test.js
├── frontend/
│   └── app/
│       ├── layouts/       marketing.vue · shop.vue · dashboard.vue
│       ├── pages/         17 pages (file-based routing Nuxt)
│       ├── stores/        auth.ts · cart.ts · profile.ts
│       ├── composables/   useApi.ts (wrapper $fetch + injection token)
│       └── assets/css/    main.css (design system complet)
└── docker-compose.yml     MongoDB 7 + mongo-express (UI)
```

---

## Lancement

### Prérequis
- Node.js ≥ 20
- Docker Desktop démarré

### Base de données
```bash
docker compose up -d
# MongoDB sur localhost:27017
# mongo-express (UI) sur http://localhost:8081
```

### Backend
```bash
cd backend
npm install
npm run seed   # insère produits, users démo, contenu marketing
npm run dev    # → http://localhost:4000
npm test       # lance la suite de tests
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # → http://localhost:3000
```

### Variables d'environnement

`backend/.env` :
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/smart-identity
MONGO_URI_TEST=mongodb://localhost:27017/smart-identity-test
JWT_SECRET=smart-identity-dev-secret-2025-change-in-prod
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

`frontend/.env` :
```
NUXT_PUBLIC_API_BASE=http://localhost:4000/api
```

### Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Utilisateur | demo@smart-identity.dev | password123 |
| Admin | admin@smart-identity.dev | admin1234 |

Page publique démo : http://localhost:3000/u/alex-martin

---

## Modèle de données (MongoDB)

Cinq collections Mongoose, avec relations par référence :

| Collection | Champs principaux | Relations |
|---|---|---|
| `users` | email, passwordHash, name, role, profile `{ bio, avatar, theme, publicSlug, links[] }` | — |
| `nfcobjects` | code (unique), label, isActive, scanCount | → User (owner) |
| `products` | name, slug, price, images[], variants `[{ color, sku, stock }]` | — |
| `orders` | items `[{ product, variantSku, qty, unitPrice }]`, total, status, shippingAddress | → User, → Product |
| `marketingcontents` | type (`feature`/`faq`/`testimonial`), title, body, meta, order | — |

Le profil utilisateur est un **sous-document embarqué** dans `User` (pas une collection séparée) car il est toujours chargé avec l'utilisateur et n'est jamais accédé indépendamment.

---

## Fonctionnalités par partie

### 1. Site marketing (layout `marketing`, SSR)
- Page d'accueil avec hero, statistiques, sections fonctionnalités + cas d'usage + témoignages
- Contenu **entièrement dynamique** : chargé depuis `GET /api/marketing/:type` (features, testimonials, FAQ)
- Pages : À propos, Contact (formulaire)
- SEO via `useSeoMeta` (title, description, og:*) sur chaque page
- Design responsive, navigation avec indicateur panier

### 2. E-commerce (layout `shop`)
- Catalogue de 4 produits avec variantes (couleur, SKU)
- Page détail : galerie d'images, sélecteur de variante, ajout au panier
- Panier : modification des quantités, suppression, total calculé
- Checkout avec formulaire d'adresse — **auth requise** (redirection automatique si non connecté)
- Confirmation de commande avec numéro de commande
- Historique des commandes dans le dashboard

### 3. SaaS — Dashboard (layout `dashboard`, auth requise)
- Tableau de bord : stats en temps réel (scans totaux, bracelets actifs, nombre de liens)
- **Profil** : bio, avatar (URL), thème de page publique (dark / light / neon), slug personnalisé
- **Liens** : CRUD complet — ajout, modification inline, suppression avec retour visuel immédiat
- **Bracelets NFC** : création avec génération de code unique, simulation de scan, suivi des scans
- **Statistiques** : répartition des scans par bracelet avec barre de progression
- **Commandes** : historique e-commerce accessible depuis le même compte

### 4. Page publique NFC (`/u/:slug`, sans auth)
- Accessible à tous, pas d'authentification requise
- Affiche : avatar, nom, bio, liste de liens cliquables
- Thème visuel choisi par l'utilisateur (dark / light / neon)
- SEO : title et og:image basés sur le profil

---

## Points d'implémentation notables

### Auth unique partagée
Un seul `User` en base, un seul token JWT. Le même compte donne accès au dashboard SaaS **et** à l'e-commerce. Le token est stocké via `useCookie` de Nuxt (compatible SSR) et envoyé en `Authorization: Bearer` sur chaque requête protégée.

### Simulation NFC
`POST /api/public/nfc/:code/scan` incrémente le compteur de scans côté serveur et retourne le slug du propriétaire. Le dashboard ouvre ensuite `/u/:slug` dans un nouvel onglet — parcours identique à un scan physique.

### Sécurité panier
Le panier est géré en client-side (Pinia + `localStorage`) pour la performance. Mais à la commande, **les prix sont recalculés côté serveur** depuis MongoDB : le client envoie des IDs de produits et quantités, le serveur calcule le total — impossible de falsifier un montant.

### Gestion des erreurs centralisée
Middleware `errorHandler` en fin de chaîne Express qui normalise toutes les erreurs en `{ error: { message, code, details } }`. Cas spécifiques : `ZodError` → 400 + détail par champ, duplicate key MongoDB → 409, `AppError` custom → code HTTP configuré.

### Validation Zod avec retour champ par champ
Les schémas Zod sont définis dans les controllers. En cas d'erreur, le frontend reçoit `error.details[]` avec `{ field, message }` par champ invalide — affichage inline sous chaque input dans les formulaires.

### Design system CSS
`main.css` définit les variables CSS (`--accent`, `--surface`, `--bg`...) et des classes utilitaires (`btn-primary`, `btn-secondary`, `card`, `input-field`, `glass`, `gradient-text`) réutilisées dans tous les composants. Un changement de variable touche l'ensemble de l'UI.

---

## API — endpoints complets

```
# Auth
POST   /api/auth/register          inscription (name, email, password)
POST   /api/auth/login             connexion → token JWT
GET    /api/auth/me            🔒  utilisateur courant

# Profil & liens (CRUD démontrable)
GET    /api/me/profile         🔒  profil complet + objets NFC
PATCH  /api/me/profile         🔒  mise à jour (bio, avatar, theme, slug)
POST   /api/me/links           🔒  ajouter un lien
PUT    /api/me/links/:id       🔒  modifier un lien
DELETE /api/me/links/:id       🔒  supprimer un lien

# Bracelets NFC
GET    /api/me/nfc             🔒  liste des objets NFC
POST   /api/me/nfc             🔒  créer (génère un code unique)
DELETE /api/me/nfc/:id         🔒  supprimer

# E-commerce
GET    /api/products                catalogue (public)
GET    /api/products/:slug          détail produit (public)
POST   /api/orders             🔒  créer une commande (recalcul prix serveur)
GET    /api/me/orders          🔒  historique

# Marketing (public)
GET    /api/marketing/:type         type = feature | faq | testimonial

# Public / NFC
GET    /api/public/profile/:slug    page publique (sans auth)
POST   /api/public/nfc/:code/scan   simulation scan → incrémente compteur, retourne slug
```

---

## Tests

```bash
cd backend && npm test
```

Suite couvrant les cas critiques de la démo :

| Fichier | Ce qui est testé |
|---------|-----------------|
| `auth.test.js` | Register OK, email dupliqué → 409, mot de passe trop court → 400, login OK, mauvais mdp → 401, `/me` sans token → 401, `/me` avec token → 200 |
| `products.test.js` | Liste produits, détail par slug, slug inconnu → 404 |
| `profile.test.js` | Route protégée sans auth → 401, PATCH bio, POST lien → 201, DELETE lien |
