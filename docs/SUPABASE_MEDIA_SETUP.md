# PHASE 1 — SUPABASE INFRASTRUCTURE + MEDIA SYSTEM

**Date** : 2026-06-24  
**Phase** : 1 / 6  
**Objectif** : Mettre en place l'infrastructure complète pour le système de médias universels (image OU vidéo par zone).

---

## ✅ PRÉ-REQUIS (Vérifiés)

- Workspace contient **uniquement** `/home/user/portfolio/` + `/home/user/uploads/`
- HEAD local : `49fbd369e174773b90335f8b86cc88650f221273`
- Git remote fetch non disponible dans cet environnement (sandbox) — **utilisateur doit vérifier localement**
- Supabase project déjà existant (ou à créer)

---

## 1. CRÉATION DU BUCKET STORAGE `media`

### Étapes dans Supabase Dashboard

1. Aller sur [https://supabase.com](https://supabase.com) → ton projet
2. Dans la sidebar : **Storage**
3. Cliquer **"New bucket"**
4. Remplir :
   - **Name** : `media`
   - **Public bucket** : ✅ **coché**
   - **File size limit** : `100MB` (ou plus)
5. Cliquer **Create bucket**

**Dossiers recommandés (créer manuellement ou via upload)** :
- `media/hero/`
- `media/about/`
- `media/vision/`
- `media/projects/`
- `media/gallery/`

---

## 2. EXÉCUTION DU SCRIPT SQL (PHASE 1)

### Fichier à exécuter :
**`/home/user/portfolio/supabase/10_phase1_universal_media.sql`**

### Comment exécuter :

1. Dans Supabase Dashboard → **SQL Editor** (icône `</>`)
2. Cliquer **New query**
3. **Copier-coller** le contenu complet du fichier `10_phase1_universal_media.sql`
4. Cliquer **Run** (ou `Cmd/Ctrl + Enter`)

**⚠️ IMPORTANT** : Exécuter **après** les scripts existants (01 à 09) si tu veux garder les tables précédentes.

---

## 3. VÉRIFICATION APRÈS EXÉCUTION

Exécute ces requêtes dans SQL Editor pour vérifier :

```sql
-- 1. Buckets
SELECT id, name, public FROM storage.buckets WHERE id = 'media';

-- 2. Table media_items
SELECT * FROM information_schema.columns 
WHERE table_name = 'media_items' 
ORDER BY ordinal_position;

-- 3. Données initiales
SELECT key, type, section, active, url FROM media_items;

-- 4. Policies RLS
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('media_items', 'site_config')
ORDER BY tablename;
```

**Résultats attendus** :
- 1 bucket `media` (public = true)
- Table `media_items` avec 12 colonnes
- 4 enregistrements initiaux
- Policies : "Public read media_items" + "Admin full access media_items"

---

## 4. MISE À JOUR DES VARIABLES D'ENVIRONNEMENT

Ajoute / vérifie dans `.env` (local) et dans Netlify :

```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ne jamais commit le Service Role Key.**

---

## 5. CONTENU DU SCRIPT SQL COMPLET

Le script complet se trouve dans :
`supabase/10_phase1_universal_media.sql`

**Il inclut :**
- Extension de `site_config` (colonne `type`)
- Création complète de `media_items` avec tous les champs
- Création du bucket `media`
- Policies Storage complètes
- RLS + policies pour `media_items`
- Données initiales (4 clés)
- Vérifications intégrées

---

## 6. PROCHAINES ÉTAPES (APRÈS PHASE 1)

Après avoir exécuté le SQL + créé le bucket :

1. **Confirmer** : "push effectué" + **HEAD == origin/main** vérifié
2. Passer à **Phase 2** : Mise à jour du hook + FileUpload universel
3. Mettre à jour `useSupabaseData.ts` pour lire `media_items`

---

## CHECKLIST PHASE 1

- [ ] Bucket `media` créé (public)
- [ ] Script `10_phase1_universal_media.sql` exécuté avec succès
- [ ] Vérifications SQL passées (bucket + table + policies)
- [ ] 4 enregistrements initiaux dans `media_items`
- [ ] Variables d'environnement à jour
- [ ] Capture d'écran des policies (optionnel)
- [ ] **push effectué** sur GitHub

---

**Statut** : Phase 1 prête à exécuter.

Copie le fichier SQL complet ci-dessous et exécute-le dans Supabase.