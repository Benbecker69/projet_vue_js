# QA_NOTES — Stratégie de tests · Smart Identity

## 1. Types de tests utilisés

### Tests unitaires
Vérifient une unité isolée (fonction, composable, store) sans dépendances externes.  
**Présents dans le projet** : tests du store `useCartStore` (logique panier), tests du composable `useToast`.  
**Ce qu'ils sécurisent** : la logique de calcul du total, l'ajout/suppression d'articles, le comportement des toasts.

### Tests d'intégration
Vérifient les interactions entre plusieurs couches (routes API → contrôleurs → modèles → MongoDB).  
**Présents dans le projet** : suite Vitest + Supertest (`auth.test.js`, `products.test.js`, `profile.test.js`, `orders.test.js`, `errors.test.js`).  
**Ce qu'ils sécurisent** : le flux complet d'une requête HTTP, la validation Zod, la gestion des erreurs, les middlewares d'auth.

### Tests fonctionnels (composants)
Vérifient qu'un composant Vue se comporte correctement vis-à-vis de ses props, événements et rendu.  
**Présents dans le projet** : tests `AppToast.test.ts`, `auth.store.test.ts` avec mocks API.  
**Ce qu'ils sécurisent** : l'affichage conditionnel des erreurs, les états loading/success/error des formulaires.

### Tests End-to-End (E2E)
Simulent un vrai utilisateur naviguant dans le navigateur, du frontend jusqu'à la base de données.  
**Présents dans le projet** : Playwright (`full-flow.spec.ts`).  
**Ce qu'ils sécurisent** : le parcours complet inscription → dashboard → e-commerce → commande, la cohérence entre les trois parties de l'application.

---

## 2. Risques identifiés dans l'application

| Risque | Zone | Couverture |
|--------|------|------------|
| Token JWT invalide ou expiré accepté | Auth middleware | ✅ Testé (tests backend auth) |
| Email déjà pris → crash non géré | Register | ✅ Testé (409 EMAIL_TAKEN) |
| Mot de passe trop court accepté | Validation Zod | ✅ Testé (400 VALIDATION_ERROR) |
| Prix manipulable côté client | Création commande | ✅ Prix recalculé serveur (testé orders.test.js) |
| Route protégée accessible sans token | Middlewares | ✅ Testé sur /me, /me/profile, /orders |
| Panier non synchronisé avec le stock | CartStore | ✅ Testé (store pur, localStorage mock) |
| Slug dupliqué → conflit MongoDB | Profile update | ✅ Géré par sparse unique index |
| Accès aux données d'un autre utilisateur | Authorization | ✅ Testé (orders.test.js — mauvais userId) |
| Erreurs API non affichées à l'utilisateur | Frontend forms | ✅ Testé (auth.store.test.ts) |
| NFC scan sur bracelet inactif | publicController | ✅ Vérifié isActive dans le contrôleur |

---

## 3. Ce qui est testé / ce qui ne l'est pas

### Testé ✅
- Auth complète : register, login, /me, routes protégées
- CRUD profil + liens : getProfile, updateProfile, addLink, updateLink, deleteLink
- Produits : liste, détail, 404
- Commandes : création (recalcul prix), historique, validation panier vide
- Gestion des erreurs : 404 routes inconnues, 400 validation, 401 non authentifié, 403/404 ressource d'un autre user
- Store panier : add, remove, updateQty, total, clear, merge de doublons
- Composable useToast : show, success, error, info, suppression différée
- Store auth : état initial, login (succès + échec), gestion erreurs API

### Non testé (hors périmètre pour ce TP)
- Tests visuels (snapshots CSS/UI) : relève du testing visuel avancé
- Tests de charge/performance : hors scope d'un TP individuel
- Tests de sécurité avancés (injection NoSQL, rate limiting) : hors scope
- Middleware de logs Winston : comportement identique à n'importe quelle requête
- Pages marketing statiques (about, contact) : pas de logique à tester

---

## 4. Stratégie de tests et choix techniques

### Backend
- **Outil** : Vitest + Supertest  
- **Raison** : Supertest permet de tester l'app Express réelle sans démarrer de serveur HTTP. Vitest offre une syntaxe moderne (describe/it/expect) et une configuration simple.  
- **Isolation** : base de données de test séparée (`MONGO_URI_TEST`), nettoyage automatique après chaque test (`afterEach` → deleteMany sur toutes les collections), suppression complète après la suite (`afterAll` → dropDatabase).
- **Pas de mocks MongoDB** : on teste contre la vraie base pour détecter les vrais problèmes (index uniques, validations Mongoose, etc.).

### Frontend
- **Outil** : Vitest + @nuxt/test-utils + @vue/test-utils  
- **Raison** : `@nuxt/test-utils` fournit l'environnement Nuxt (auto-imports, useState, useCookie, etc.) dans les tests unitaires, sans démarrer de serveur.  
- **Mocks** : `mockNuxtImport` pour isoler les composants de l'API réseau, `createTestingPinia` pour les stores.  
- **Stratégie** : tester la logique métier indépendamment du backend réel.

### E2E
- **Outil** : Playwright  
- **Raison** : API moderne, support TypeScript natif, rapide, multi-navigateurs, meilleure alternative à Cypress pour Nuxt SSR.  
- **Scénario couvert** : parcours utilisateur complet (inscription → dashboard → e-commerce → commande).  
- **Prérequis** : backend sur port 4000 et frontend sur port 3000 démarrés manuellement (ou via `webServer` Playwright).

### Priorités de test
1. Auth (bloque tout le reste si cassée)
2. CRUD liens du profil (fonctionnalité principale démontrée)
3. Commandes (implique la sécurité prix)
4. Stores frontend (logique panier utilisée partout)
5. E2E (validation end-to-end du parcours complet)

---

## 5. Commandes

```bash
# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test

# Tests E2E (backend + frontend doivent être démarrés)
npm run e2e         # depuis la racine
```
