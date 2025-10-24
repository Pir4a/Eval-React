# Application de Gestion d'Utilisateurs - React + TypeScript

Une application web moderne et performante pour gérer et afficher une liste d'utilisateurs, développée avec React, TypeScript, et Vite.

Si vous avez le temps checkez mon portfolio hihi : https://stephane-dedu-devportfolio.vercel.app/

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Tests
```bash
npm test              # Exécuter les tests
npm run test:ui       # Interface graphique des tests
npm run test:coverage # Rapport de couverture
```

### Build
```bash
npm run build
npm run preview
```

## 📋 Description du projet

Cette application permet de consulter une liste d'utilisateurs récupérée depuis l'API [DummyJSON](https://dummyjson.com/users), avec des fonctionnalités avancées de recherche, tri, pagination, et gestion des favoris. Le projet met l'accent sur les performances, l'expérience utilisateur, et les bonnes pratiques de développement React.

## ✨ Fonctionnalités

### Niveau 1 – Base dynamique et structurée (10/20) ✅

- ✅ **Affichage de la liste des utilisateurs** chargée depuis l'API avec `useState` et `useEffect`
- ✅ **Données principales affichées** : photo, prénom, nom, email
- ✅ **Navigation vers le détail** : clic sur un utilisateur → affichage de ses détails (âge, société, ville, etc.)
- ✅ **Architecture en composants** :
  - `<UserList />` : Liste paginée des utilisateurs
  - `<UserCard />` : Carte individuelle d'un utilisateur
  - `<UserDetail />` : Page de détail complète d'un utilisateur
- ✅ **Routing avec React Router** :
  - `/` → Liste des utilisateurs
  - `/user/:id` → Fiche de détail
  - `/error-test` → Page de test des erreurs
  - `*` → Page 404
- ✅ **Gestion des états** : Loading avec skeleton, gestion des erreurs réseau avec retry

### Niveau 2 – Interactivité et navigation (13/20) ✅

- ✅ **Recherche en temps réel** : Champ de recherche filtrant par nom, prénom, et email
- ✅ **Tri dynamique** : Par nom ou par âge (ascendant/descendant)
- ✅ **Pagination serveur** : Utilisation des paramètres `limit` et `skip` de l'API
- ✅ **Gestion propre des erreurs** : `try/catch` avec messages d'erreur stylisés et possibilité de retry

### Niveau 3 – Application complète et UX évoluée (15/20) ✅

- ✅ **Système de favoris** : Clic sur l'étoile → ajout/suppression persistant via `localStorage`
- ✅ **Thème clair/sombre** : Toggle dans la navbar avec persistance
- ✅ **Menu de tri dynamique** : Sélection du critère de tri et de la direction
- ✅ **Composants de chargement** : Skeleton screens avec animations
- ✅ **Messages d'erreur stylisés** : Avec bouton de retry
- ✅ **Optimisations** : `useMemo` pour le tri et le filtrage
- ✅ **Transitions CSS** : Animations GSAP pour le carousel, hover effects, fade-in

### Niveau 4 – Projet abouti et approche professionnelle (19-20/20) ✅

- ✅ **Custom hook `useUsers()`** :
  ```typescript
  const {
    users,           // Utilisateurs triés
    total,           // Total d'utilisateurs
    loading,         // État de chargement
    error,           // Message d'erreur
    search,          // Terme de recherche
    sortKey,         // Critère de tri (name/age)
    sortDir,         // Direction (asc/desc)
    page,            // Page actuelle
    pageSize,        // Taille de page
    pageCache,       // Cache des pages
    setSearch,       // Modifier la recherche
    setSort,         // Modifier le tri
    setPage,         // Changer de page
    refetch,         // Recharger les données
    prefetchPages    // Précharger des pages
  } = useUsers({ pageSize: 9 })
  ```

- ✅ **Optimisations avancées** :
  - `useCallback` pour les fonctions
  - `React.memo` pour les composants (UserCard, SearchBar, SortMenu)
  - `ErrorBoundary` pour capturer les erreurs React
  - Prefetching intelligent des pages adjacentes
  - Cache des pages avec carousel à 3 panneaux

- ✅ **Pagination serveur** : Paramètres `limit` et `skip` avec cache intelligent

- ✅ **Mode hors ligne** : Affichage des favoris en cache si l'API est inaccessible

- ✅ **Page 404** : Pour les IDs utilisateurs inexistants

### Bonus ✨

- ✅ **Notifications toast** : Avec `react-hot-toast` pour succès/erreur
- ✅ **Tests unitaires** : Suite complète de 20 tests avec Vitest sur `useUsers()`
- ✅ **Animations avancées** : Carousel avec GSAP, transitions fluides
- ✅ **UI moderne** : Effets visuels avec laser background animé

## 🏗️ Architecture

```
src/
├── features/
│   └── users/
│       ├── components/
│       │   ├── UserList.tsx        # Liste avec carousel et pagination
│       │   ├── UserCard.tsx        # Carte utilisateur (React.memo)
│       │   ├── UserDetail.tsx      # Détail complet d'un utilisateur
│       │   ├── SearchBar.tsx       # Barre de recherche (React.memo)
│       │   ├── SortMenu.tsx        # Menu de tri (React.memo)
│       │   ├── Pagination.tsx      # Contrôles de pagination
│       │   └── FavoritesToggle.tsx # Bouton favoris
│       ├── hooks/
│       │   ├── useUsers.ts         # Hook principal (état + logique)
│       │   └── useUsers.test.ts    # 20 tests unitaires
│       ├── services/
│       │   ├── api.ts              # Client API générique
│       │   └── users.api.ts        # Endpoints utilisateurs
│       └── types/
│           └── User.ts             # Type TypeScript
├── shared/
│   ├── atoms/                      # Composants atomiques
│   ├── molecules/                  # Composants moléculaires
│   └── organisms/                  # Composants organismes
├── providers/
│   ├── ErrorBoundary.tsx          # Gestion des erreurs React
│   └── ThemeProvider.tsx          # Thème clair/sombre
├── pages/
│   ├── Home.tsx                   # Page d'accueil
│   ├── UserPage.tsx               # Page de détail utilisateur
│   ├── NotFound.tsx               # Page 404
│   └── ErrorTest.tsx              # Page de test des erreurs
└── utils/
    └── favorites.ts               # Gestion localStorage
```

## 🛠️ Technologies

- **React 19** avec hooks modernes
- **TypeScript** pour la sécurité des types
- **Vite** pour un build ultra-rapide
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **GSAP** pour les animations
- **Vitest** + **React Testing Library** pour les tests
- **react-hot-toast** pour les notifications

## 🎯 Points techniques remarquables

### Performance
- **Pagination serveur** : Seulement 9-10 utilisateurs chargés à la fois
- **Cache intelligent** : Les pages visitées restent en mémoire
- **Prefetching** : Préchargement des pages adjacentes en arrière-plan
- **Optimisations React** : `useMemo`, `useCallback`, `React.memo`
- **Carousel à 3 panneaux** : Navigation fluide sans re-render visible

### Expérience utilisateur
- **Skeleton screens** : Pas de page blanche pendant le chargement
- **Animations GSAP** : Transitions fluides du carousel
- **Toast notifications** : Feedback immédiat
- **Mode hors ligne** : Affichage des favoris même sans réseau
- **Thème dark/light** : Adaptation à la préférence utilisateur

### Qualité du code
- **TypeScript strict** : Typage complet
- **Tests unitaires** : 20 tests couvrant tous les cas d'usage
- **Architecture modulaire** : Features isolées, composants réutilisables
- **Error Boundary** : Récupération gracieuse des erreurs
- **Gestion d'état robuste** : Hook custom avec cache et prefetch

## 📊 Tests

Suite de 20 tests couvrant :
- ✅ Initialisation de l'état
- ✅ Chargement des données
- ✅ Gestion des erreurs
- ✅ Tri (nom/âge, asc/desc)
- ✅ Recherche
- ✅ Pagination
- ✅ Cache des pages
- ✅ Prefetching
- ✅ Refetch
- ✅ Détail utilisateur
- ✅ Gestion 404

```bash
npm test
# Test Files  1 passed (1)
# Tests  20 passed (20)
```

## 🎨 Fonctionnalités UI

### Navigation
- Carousel 3 panneaux avec animation GSAP
- Pagination numérotée avec jump-to-page
- Boutons précédent/suivant

### Filtres et tri
- Recherche en temps réel (nom, prénom, email)
- Tri par nom ou âge
- Direction ascendante/descendante
- Filtrage par favoris

### Interactions
- Ajout/retrait des favoris avec persistance
- Toggle thème clair/sombre
- Bouton retry sur erreur
- Navigation fluide entre pages

## 🌐 API

Endpoint principal : [https://dummyjson.com/users](https://dummyjson.com/users)

Fonctionnalités utilisées :
- `GET /users?limit=10&skip=0` - Liste paginée
- `GET /users/search?q=John&limit=10&skip=0` - Recherche
- `GET /users/:id` - Détail utilisateur


## 🚀 Améliorations futures possibles

- [X] Déploiement sur Vercel : https://eval-react-ashy.vercel.app/

## 👨‍💻 Développeur

Projet développé par STEPHANE DEDU dans le cadre d'une évaluation React / TypeScript.

## 📄 Licence

Ce projet est à usage éducatif.
