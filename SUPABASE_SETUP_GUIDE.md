# 📘 GUIDE COMPLET CONFIGURATION SUPABASE

**Portfolio Stane-Junior Aniambossou**  
**Version:** 1.0.0  
**Date:** 2025

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#1-prérequis)
2. [Créer un projet Supabase](#2-créer-un-projet-supabase)
3. [Exécuter les scripts SQL](#3-exécuter-les-scripts-sql)
4. [Créer un utilisateur admin](#4-créer-un-utilisateur-admin)
5. [Configurer les variables d'environnement](#5-configurer-les-variables-denvironnement)
6. [Tester la connexion](#6-tester-la-connexion)
7. [Dépannage](#7-dépannage)
8. [Maintenance et bonnes pratiques](#8-maintenance-et-bonnes-pratiques)

---

## 1. PRÉREQUIS

### Ce dont tu as besoin

- ✅ Un compte [Supabase](https://supabase.com) (gratuit)
- ✅ Le code du portfolio cloné localement
- ✅ Node.js installé (pour tester localement)
- ✅ 30-45 minutes pour la configuration complète

### Fichiers SQL fournis

Les fichiers SQL sont dans le dossier `supabase/` :

```
supabase/
├── 01_create_tables.sql           → CRÉER LES TABLES (1er)
├── 02_insert_initial_config.sql   → DONNÉES INITIALES (2ème)
├── 03_enable_rls_and_policies.sql → SÉCURITÉ RLS (3ème)
├── 04_insert_demo_data.sql        → DONNÉES DÉMO (4ème, optionnel)
└── 05_security_functions.sql      → FONCTIONS UTILITAIRES (5ème)
```

**⚠️ IMPORTANT:** Exécute les fichiers DANS L'ORDRE !

---

## 2. CRÉER UN PROJET SUPABASE

### Étape 1: Se connecter à Supabase

1. Va sur https://supabase.com
2. Clique sur **"Sign In"** ou **"Get Started"**
3. Crée un compte avec ton email ou GitHub

### Étape 2: Créer un nouveau projet

1. Dans le dashboard, clique sur **"New Project"**
2. Remplis les informations:
   - **Name:** `portfolio-stane` (ou ton choix)
   - **Database password:** Choisis un mot de passe SÉCURISÉ (note-le !)
   - **Region:** Choisis la région la plus proche (ex: `Paris` pour l'Europe)
   - **Plan:** Free tier (suffisant pour commencer)

3. Clique sur **"Create new project"**

### Étape 3: Attendre la création

Le projet prend 2-3 minutes à créer. Tu verras un écran de progression.

### Étape 4: Récupérer les clés API

Une fois le projet créé:

1. Va dans **Settings** (icône engrenage dans la sidebar)
2. Clique sur **API**
3. Note ces deux informations:

```
Project URL:
https://xxxxxxxxxxxxx.supabase.co

Anon Key (public):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Service Role Key (privé - ne jamais partager):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT:**
- `Project URL` et `Anon Key` → À mettre dans Netlify (variables d'environnement)
- `Service Role Key` → À garder secret, ne jamais committer dans Git

---

## 3. EXÉCUTER LES SCRIPTS SQL

### Étape 1: Ouvrir l'éditeur SQL

1. Dans le dashboard Supabase, clique sur **SQL Editor** (icône `</>` dans la sidebar)
2. Clique sur **"New query"**

### Étape 2: Exécuter le fichier 01

1. Ouvre le fichier `supabase/01_create_tables.sql`
2. Copie TOUT le contenu
3. Colle-le dans l'éditeur SQL Supabase
4. Clique sur **"Run"** (ou Ctrl+Enter)

**Résultat attendu:**
```
✅ CREATE TABLE projects
✅ CREATE TABLE testimonials
✅ CREATE TABLE messages
✅ CREATE TABLE site_config
✅ CREATE INDEX ... (plusieurs)
✅ CREATE TRIGGER ... (plusieurs)
```

Si tu vois des erreurs rouges, vérifie l'ordre d'exécution.

### Étape 3: Exécuter le fichier 02

1. Clique sur **"New query"** (pour avoir un nouvel onglet)
2. Ouvre `supabase/02_insert_initial_config.sql`
3. Copie le contenu
4. Colle et **"Run"**

**Résultat attendu:**
```
✅ INSERT 0 16 (16 lignes insérées)
✅ config_count: 16
```

### Étape 4: Exécuter le fichier 03

1. Nouveau query
2. Copie `supabase/03_enable_rls_and_policies.sql`
3. Colle et **"Run"**

**Résultat attendu:**
```
✅ ALTER TABLE (4 fois)
✅ CREATE POLICY (10 fois)
```

### Étape 5: Exécuter le fichier 04 (OPTIONNEL)

**Ce fichier ajoute des données de test pour vérifier que tout fonctionne.**

1. Nouveau query
2. Copie `supabase/04_insert_demo_data.sql`
3. Colle et **"Run"**

**Résultat attendu:**
```
✅ INSERT 0 3 (3 projets)
✅ INSERT 0 2 (2 témoignages)
```

### Étape 6: Exécuter le fichier 05

1. Nouveau query
2. Copie `supabase/05_security_functions.sql`
3. Colle et **"Run"**

**Résultat attendu:**
```
✅ CREATE FUNCTION (plusieurs)
✅ CREATE TABLE admin_logs
✅ CREATE TRIGGER
```

### Vérification finale

Exécute cette requête pour vérifier tout:

```sql
SELECT 
  'projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'site_config', COUNT(*) FROM site_config
UNION ALL
SELECT 'admin_logs', COUNT(*) FROM admin_logs;
```

**Résultat attendu:**
```
table_name    | count
--------------+-------
projects      | 3
testimonials  | 2
messages      | 0
site_config   | 16
admin_logs    | 0
```

---

## 4. CRÉER UN UTILISATEUR ADMIN

### Étape 1: Aller dans Authentication

1. Dans le dashboard Supabase, clique sur **Authentication** (icône personnes)
2. Clique sur **Users**

### Étape 2: Ajouter un utilisateur

1. Clique sur **"Add user"**
2. Choisis **"Create new user"**

### Étape 3: Remplir les informations

```
Email: ton-email@exemple.com
Password: [Choisis un mot de passe fort]
Email confirmation: [Coche cette case pour éviter la confirmation par email]
```

**IMPORTANT:**
- Utilise un email que tu contrôles
- Mot de passe: minimum 8 caractères, avec majuscule, minuscule, chiffre
- **Coche "Auto confirm user"** pour éviter l'email de confirmation

### Étape 4: Vérifier

L'utilisateur apparaît dans la liste avec un statut **"active"**.

**Note:** Ces identifiants seront utilisés pour se connecter à l'admin panel du portfolio (`/#/admin`).

---

## 5. CONFIGURER LES VARIABLES D'ENVIRONNEMENT

### Option A: Pour le développement local

1. Crée un fichier `.env` à la racine du projet (dans le même dossier que `package.json`)

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT:**
- Le fichier `.env` doit être dans `.gitignore`
- Ne jamais committer `.env` sur GitHub

### Option B: Pour le déploiement Netlify

1. Va sur https://app.netlify.com
2. Sélectionne ton site
3. Clique sur **Site settings** > **Environment variables**
4. Clique sur **"Add a variable"**

Ajoute ces deux variables:

```
Key: VITE_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co

Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Clique sur **"Save"**
6. Déploie à nouveau ton site (Netlify détectera le changement)

---

## 6. TESTER LA CONNEXION

### Test 1: Vérifier le fichier .env

```bash
# Dans le dossier du projet
cat .env
```

**Résultat attendu:**
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test 2: Lancer le projet localement

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

### Test 3: Accéder à l'admin panel

1. Va sur http://localhost:5173/#/admin
2. Entre tes identifiants Supabase
3. Tu devrais voir le dashboard

### Test 4: Vérifier les données

Dans l'admin panel:
1. Va sur **Projects**
2. Tu devrais voir les 3 projets de démo (si tu as exécuté le fichier 04)
3. Essaie de créer un nouveau projet
4. Va sur le portfolio public, la section Projets
5. Le nouveau projet devrait apparaître

**⚠️ IMPORTANT:** 
Si tu as exécuté le fichier 04, les projets sont déjà dans Supabase.
Si tu ne l'as pas exécuté, la liste sera vide → c'est normal !

---

## 7. DÉPANNAGE

### Problème: "Invalid API key"

**Cause:** Les clés Supabase sont incorrectes ou manquantes.

**Solution:**
1. Vérifie `.env` ou les variables Netlify
2. Copie-les exactement depuis Supabase Settings > API
3. Redémarre le serveur de développement
4. Sur Netlify: redéployer après avoir ajouté les variables

### Problème: "Permission denied"

**Cause:** Les policies RLS ne sont pas correctes.

**Solution:**
1. Vérifie que le fichier 03 a été exécuté
2. Dans Supabase, va dans Table Editor
3. Clique sur la table (ex: projects)
4. Va dans l'onglet **Security**
5. Vérifie que les policies sont présentes

### Problème: "Table does not exist"

**Cause:** Les tables n'ont pas été créées.

**Solution:**
1. Vérifie que le fichier 01 a été exécuté
2. Dans Supabase, va dans Table Editor
3. Tu devrais voir: projects, testimonials, messages, site_config
4. Si pas là, réexécute le fichier 01

### Problème: Login admin ne fonctionne pas

**Cause:** L'utilisateur admin n'existe pas ou mot de passe incorrect.

**Solution:**
1. Dans Supabase: Authentication > Users
2. Vérifie que ton email est dans la liste
3. Si pas là: ajoute-le (voir section 4)
4. Si mot de passe oublié: réinitialise-le depuis Supabase

### Problème: Données ne s'affichent pas dans le portfolio

**Cause:** Le portfolio ne charge pas depuis Supabase (données hardcoded).

**Solution:**
- C'est normal pour l'instant ! Le CRUD admin fonctionne, mais le portfolio public doit être connecté à Supabase.
- Voir la section "Prochaines étapes" ci-dessous.

---

## 8. MAINTENANCE ET BONNES PRATIQUES

### Sauvegarde régulière

Supabase fait des sauvegardes automatiques, mais tu peux aussi:

1. Dans le dashboard: Settings > Database
2. Clique sur **"Take backup"**
3. Télécharge le fichier SQL

### Surveillance des logs

1. Dans le dashboard: Settings > Audit logs
2. Vérifie les actions sur ta base de données

### Nettoyage des messages anciens

La fonction `cleanup_old_messages()` supprime automatiquement les messages lus de plus de 90 jours.

Pour exécuter manuellement:
```sql
SELECT cleanup_old_messages(90);
```

### Ajouter un nouvel admin

1. Authentication > Users > Add user
2. Même procédure que section 4
3. Tous les utilisateurs authentifiés ont les mêmes permissions

### Changer le mot de passe admin

1. Authentication > Users
2. Clique sur les 3 points à côté de l'utilisateur
3. **"Change password"**
4. Entre le nouveau mot de passe

---

## PROCHAINES ÉTAPES

Une fois Supabase configuré:

### ✅ À faire maintenant
1. [ ] Exécuter tous les fichiers SQL dans l'ordre
2. [ ] Créer l'utilisateur admin
3. [ ] Configurer les variables d'environnement
4. [ ] Tester l'admin panel

### 🔄 À faire ensuite
1. [ ] Connecter le portfolio public à Supabase (charger les projets depuis la DB)
2. [ ] Ajouter ta photo professionnelle
3. [ ] Uploader ton CV PDF
4. [ ] Tester sur mobile
5. [ ] Déployer sur Netlify

---

## RÉFÉRENCES

### Liens utiles

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/quickstarts/react)

### Fichiers SQL

```
supabase/
├── 01_create_tables.sql           → Tables principales
├── 02_insert_initial_config.sql   → Config par défaut
├── 03_enable_rls_and_policies.sql → Sécurité RLS
├── 04_insert_demo_data.sql        → Données de test (optionnel)
└── 05_security_functions.sql      → Fonctions utilitaires
```

---

## CONTACT SUPPORT

En cas de problème persistant:

1. Vérifie les logs dans Supabase: Settings > Database > Logs
2. Vérifie la console navigateur (F12)
3. Vérifie les erreurs dans Netlify: Deploys > [deploy] > Functions logs

---

**Guide créé par:** Senior Frontend Developer IA  
**Date:** 2025  
**Version:** 1.0.0

**Statut:** ✅ **PRÊT À ÊTRE UTILISÉ**
