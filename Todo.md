Thème : Créer une application dynamique
traitant une liste d’utilisateurs
Endpoint principal :
https://dummyjson.com/users
Le travail est divisé en niveau de fonctionnalité complémentaire et de complexité progressive.
Est attendu un projet versionné (développé from scratch), un readme « classique », complété d’une
description du travail effectué.
Le rendu sera personnel(lien GitHub public sur César). L’entraide est possible.
Niveau 1 – Base dynamique et structurée (10/20)
Créer une application dynamique et lisible affichant la liste des utilisateurs et le détail d’un
utilisateur au clic.
Attendus
• Afficher la liste des utilisateurs chargée depuis l’API. Utiliser useState et useEffect.
• Afficher les données principales : photo, prénom, nom, email.
• Clic sur un utilisateur → afficher ses détails : âge, société, ville, etc.
• Créer au moins 3 composants :
• <UserList />, <UserCard />, <UserDetail />.
• Navigation entre la liste et la fiche de détail via React Router :
• / → liste
• /user/:id → fiche de détail
• Gérer un état de chargement (Loading…) et une erreur réseau.
Niveau 2 – Interactivité et navigation (13/20)
Améliorer l’interaction et structurer l’application.
Attendus
• Conserver les fonctionnalités du niveau 1.
• Ajouter :
• Un champ de recherche (nom, prénom, email) en temps réel.
• Un tri par nom ou par âge.
• Une pagination (10 utilisateurs par page).
• Gestion propre des erreurs via try/catch.
Niveau 3 – Application complète et UX évoluée (15/20)
Offrir une expérience utilisateur fluide et bien structurée.
Attendus
• Reprendre les fonctionnalités précédentes.
• Ajouter :
• Système de favoris : clic sur une étoile de chaque Card → ajout/suppression,
persistant via localStorage.
• Thème clair/sombre géré par un état global.
• Tri dynamique via un menu déroulant.
• Composant de chargement visuel (spinner ou skeleton).
• Message d’erreur stylisé avec possibilité de relancer la requête.
• Utilisation de useMemo pour optimiser le tri et le filtrage.
• Ajouter de petites transitions CSS (fade-in, hover) pour rendre l’interface vivante.
Niveau 4 – Projet abouti et approche professionnelle (19-
20/20)
Produire une application maintenable, performante et complète, proche d’un projet professionnel.
Attendus
• Reprendre tout ce qui précède.
• Créer un custom hook useUsers() :
const { users, loading, error, search, setSearch, toggleFavorite } =
useUsers();
Ce hook doit gérer :
• chargement / rechargement,
• recherche et tri,
• favoris et erreurs.
• Ajouter :
• Optimisations avec useCallback, React.memo, et un ErrorBoundary.
• Pagination serveur avec les paramètres limit et skip.
• Mode hors ligne : afficher les favoris si l’API est inaccessible.
• Page 404 si l’ID utilisateur n’existe pas.
Astuce technique :
Tester la performance avec React DevTools.
Vérifier les re-renders évitables grâce à React.memo.
Bonus possible :
• Notification “toast” pour succès / erreur (react-hot-toast).
• Test unitaire simple sur useUsers() avec Vitest.
• Déploiement sur Vercel.