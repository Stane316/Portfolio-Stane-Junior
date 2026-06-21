# 07 — Admin Dashboard

## OBJECTIF

Comprendre le dashboard admin, ses sections, comment chaque partie fonctionne, et comment gérer le contenu du site sans toucher au code.

---

## PRÉREQUIS

- Supabase configuré et scripts SQL exécutés
- Un utilisateur admin créé dans Authentication
- Avoir lu `05_SUPABASE_SETUP.md`

---

## Accès

- **URL** : `/admin/login`
- **Identifiants** : Email + mot de passe créés dans Supabase Authentication
- **Protection** : Route protégée par `ProtectedRoute` — redirection vers login si non authentifié

---

## Architecture du dashboard

```
/admin/login          → Page de connexion
/admin/dashboard      → Vue d'ensemble (KPIs, messages récents, projets récents)
/admin/projects       → CRUD Projets (version liste premium)
/admin/testimonials   → CRUD Témoignages
/admin/messages       → Liste des messages (filtres, lecture, suppression)
/admin/content        → Gestion Contenu (Hero, About, Footer, Liens)
/admin/skills         → Éditeur visuel Compétences
/admin/blog           → CRUD Articles de blog
/admin/growtech       → Gestion GROW TECH (membres, projets, vision)
/admin/vision         → CRUD Vision / Concepts
```

---

## Sections détaillées

### Dashboard (Vue d'ensemble)

- **4 KPIs animés** : Projets publiés, Témoignages actifs, Messages reçus, Messages non lus
- **Messages récents** : Les 5 derniers avec bouton "Marquer lu"
- **Projets récents** : Les 3 derniers avec statut coloré

### Projets (`AdminProjectsNew`)

- **Liste premium** avec colonnes : Image, Projet, Statut, Options, Actions
- **CRUD complet** : Créer, modifier, supprimer
- **Toggle visible/featured** directement dans la liste
- **Éditeur d'étude de cas** : 5 étapes (Problème, Solution, Fonctionnalités, Obstacle, Résultat)
- **Upload d'image** via Supabase Storage
- **Champs bilingues** FR/EN

### Témoignages (`AdminTestimonials`)

- **CRUD complet** avec formulaire
- **Toggle visibilité** (eye/eye-slash)
- **Upload photo** du témoin
- **URL vidéo** (YouTube, Vimeo)
- **Validation** côté client avant envoi

### Messages (`MessageList`)

- **Filtres** : Tous / Non lus / Lus
- **Expansion** : Cliquer sur un message pour voir le contenu complet
- **Actions** : Marquer lu/non lu, Répondre (mailto), Supprimer
- **Virtual scroll simplifié** : Charge par lots de 10

### Contenu (`AdminContent`)

- **4 onglets** : Hero, À propos, Footer, Liens
- **Sauvegarde debouncée** (800ms) : chaque frappe déclenche un save automatique après délai
- **Pattern configRef** : Évite les stale closures dans les debounced saves
- **Upload d'images** : Sauvegarde immédiate (pas de debounce pour les fichiers)
- **Détection modifications non sauvegardées** : Modal de confirmation avant navigation

### Compétences (`AdminSkills`)

- **Éditeur visuel** avec barres de progression
- **3 catégories** : Maîtrisé, En apprentissage, Notions
- **Note d'honnêteté** : Texte éditable
- **Sauvegarde debouncée** via `useDebouncedSave`

### Blog (`AdminBlog`)

- **CRUD complet** d'articles
- **Slug auto-généré** depuis le titre FR
- **Toggle publication** (publié/brouillon)
- **Upload image de couverture**
- **Champs bilingues** via `BilingualInput`
- **Auto-traduction** FR→EN via API MyMemory

### GROW TECH (`AdminGrowTech`)

- **Sous-sections** : Membres, Projets, Vision
- **Membres** : CRUD avec photo upload
- **Projets** : CRUD projets GROW TECH
- **Vision** : CRUD vision GROW TECH

### Vision (`AdminVision`)

- **CRUD** de concepts / projets futurs
- **3 statuts** : Concept, En développement, En pause
- **Upload image** pour chaque concept
- **Champs bilingues** FR/EN

---

## Hooks admin

| Hook | Fichier | Rôle |
|------|---------|------|
| `useAdminData` | `admin/hooks/useAdminData.ts` | CRUD générique pour n'importe quelle table Supabase |
| `useDebouncedSave` | `admin/hooks/useDebouncedSave.ts` | Sauvegarde debouncée avec callback |
| `useToast` | `admin/hooks/useToast.ts` | Gestion des notifications toast |
| `useUnsavedChanges` | `admin/hooks/useUnsavedChanges.ts` | Détection modifications + blocage navigation |

---

## ERREURS POSSIBLES

### Erreur : "Supabase non configuré" dans l'admin

**Cause** : Variables d'environnement absentes.
**Solution** : Voir `04_ENVIRONMENT_VARIABLES.md`

### Erreur : Écran blanc après login

**Cause** : Les tables n'ont pas été créées dans Supabase.
**Solution** : Exécuter les scripts SQL (voir `05_SUPABASE_SETUP.md`)

### Erreur : Les modifications ne se sauvegardent pas

**Cause** : RLS bloque les écritures.
**Solution** : Vérifier que les policies sont créées (script 03)

---

## COMMENT VÉRIFIER

1. Se connecter à `/admin/login`
2. Chaque section doit charger avec les données existantes
3. Créer un élément dans chaque section → vérifier qu'il apparaît
4. Modifier un élément → vérifier que la modification est persistée
5. Supprimer un élément → vérifier qu'il disparaît

---

## CHECKLIST

- [ ] Connexion admin fonctionne
- [ ] Dashboard affiche les KPIs
- [ ] CRUD Projets fonctionne
- [ ] CRUD Témoignages fonctionne
- [ ] Messages sont lisibles et filtrables
- [ ] Contenu est éditable avec auto-save
- [ ] Compétences sont éditables
- [ ] CRUD Blog fonctionne
- [ ] CRUD Vision fonctionne
- [ ] Upload d'images fonctionne
