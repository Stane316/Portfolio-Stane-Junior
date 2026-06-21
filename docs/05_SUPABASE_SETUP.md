# 05 — Supabase Setup

## OBJECTIF

Créer et configurer le projet Supabase, exécuter les scripts SQL, et vérifier que tout fonctionne.

---

## PRÉREQUIS

- Un compte Supabase (https://supabase.com — gratuit)
- Le repo cloné localement
- Les variables d'environnement configurées (voir `04_ENVIRONMENT_VARIABLES.md`)

---

## ÉTAPES DÉTAILLÉES

### 1. Créer le projet Supabase

1. Aller sur https://supabase.com/dashboard
2. Cliquer **New Project**
3. Remplir :
   - **Name** : `Portfolio-Stane-Junior`
   - **Database Password** : Choisir un mot de passe fort (le sauvegarder !)
   - **Region** : Choisir la région la plus proche (ex: Europe West ou Africa South)
4. Cliquer **Create new project**
5. Attendre 1-2 minutes que le projet soit provisionné

### 2. Exécuter les scripts SQL dans l'ORDRE

 Aller dans **SQL Editor** (icône base de données dans la barre latérale)

Exécuter chaque script **dans l'ordre** en copiant-collant le contenu :

| Ordre | Fichier | Ce qu'il fait |
|-------|---------|---------------|
| 1 | `supabase/01_create_tables.sql` | Crée les tables principales (projects, testimonials, messages, site_config) |
| 2 | `supabase/02_insert_initial_config.sql` | Insère la configuration par défaut dans site_config |
| 3 | `supabase/03_enable_rls_and_policies.sql` | Active Row Level Security + crée les policies |
| 4 | `supabase/04_insert_demo_data.sql` | Insère des données de démonstration |
| 5 | `supabase/05_security_functions.sql` | Crée les fonctions de sécurité + table admin_logs |
| 6 | `supabase/06_add_logo_fields.sql` | Ajoute les champs logo |
| 7 | `supabase/07_setup_storage.sql` | Crée les buckets storage |
| 8 | `supabase/08_create_missing_tables.sql` | Crée blog_posts + vision_items + policies + données démo |
| 9 | `supabase/09_add_about_skills_config.sql` | Ajoute config About, Skills, Footer, Hero dans site_config |

**Pour chaque script** :
1. Ouvrir le fichier dans votre éditeur
2. Copier tout le contenu
3. Coller dans le SQL Editor de Supabase
4. Cliquer **Run**
5. Vérifier qu'il n'y a pas d'erreur dans le résultat

### 3. Configurer le Storage

Les buckets sont créés par le script 07. Vérifier :

1. Aller dans **Storage** dans la barre latérale
2. Vérifier que les buckets existent :
   - `portfolio-assets` (public — images projets, témoignages, etc.)
   - `portfolio-docs` (public — CV, documents)
3. Si un bucket manque, le créer manuellement : New bucket → nom → toggle Public

### 4. Créer un utilisateur admin

1. Aller dans **Authentication** dans la barre latérale
2. Cliquer **Add user** → **Create new user**
3. Remplir :
   - **Email** : votre email admin
   - **Password** : un mot de passe fort
   - **Auto Confirm User** : ✅ cocher (pas besoin de vérifier l'email en dev)
4. Cliquer **Create user**

C'est cet email et ce mot de passe qui seront utilisés pour se connecter à `/admin/login`.

---

## Tables créées

| Table | Rôle | Accès public | Accès admin |
|-------|------|-------------|-------------|
| `projects` | Projets du portfolio | Lecture (visibles uniquement) | CRUD complet |
| `testimonials` | Témoignages clients | Lecture (visibles uniquement) | CRUD complet |
| `messages` | Messages de contact | Écriture uniquement | Lecture + suppression |
| `site_config` | Configuration key-value | Lecture | Lecture + écriture |
| `blog_posts` | Articles de blog | Lecture (publiés uniquement) | CRUD complet |
| `vision_items` | Concepts / Vision | Lecture | CRUD complet |
| `admin_logs` | Journal d'audit | Aucun | Écriture uniquement |

---

## ERREURS POSSIBLES

### Erreur : "relation already exists" à l'exécution d'un script

**Cause** : Le script a déjà été exécuté. Les `IF NOT EXISTS` protègent contre ça.
**Solution** : Ignorer l'erreur, c'est normal si vous ré-exécutez.

### Erreur : "function update_updated_at_column() does not exist"

**Cause** : Le script 05 n'a pas été exécuté avant le script 08.
**Solution** : Exécuter les scripts dans l'ordre. Le trigger `update_updated_at_column` est créé dans le script 05.

### Erreur : Login admin échoue

**Cause** : L'utilisateur n'a pas été créé dans Authentication.
**Solution** : Voir l'étape 4 ci-dessus.

---

## COMMENT VÉRIFIER

1. Se connecter à `/admin/login` avec les identifiants créés
2. Le dashboard doit afficher les KPIs
3. Chaque section admin doit charger sans erreur "table not found"

---

## CHECKLIST

- [ ] Projet Supabase créé
- [ ] Scripts 01-09 exécutés dans l'ordre
- [ ] Buckets storage existent
- [ ] Utilisateur admin créé dans Authentication
- [ ] Connexion à /admin/login fonctionne
