# IMPLEMENTATION ORDER — UNIVERSAL ADMIN MEDIA + CREATIVE DIRECTION

**Project**: Portfolio Stane-Junior  
**Based on**:
- UNIVERSAL ADMIN UPLOAD MEDIA SYSTEM PROMPT
- CREATIVE DIRECTION MASTER PROMPT

---

## PRÉ-REQUIS (Toujours)

Avant **chaque** étape :
1. Vérifier workspace : uniquement `portfolio/` + `uploads/`
2. `git status -sb` + comparer HEAD vs origin/main
3. Si pas sync → arrêter et donner commandes git
4. Livrer **fichiers complets** uniquement

---

## PHASE 1 — INFRASTRUCTURE (Supabase)

### Étape 1.1 — Création Bucket & Storage
- Aller dans Supabase Dashboard → Storage
- Créer bucket **public** nommé `media`
- Créer les dossiers :
  - `hero/`
  - `about/`
  - `vision/`
  - `projects/`
  - `gallery/`

**Commandes / Actions** :
- Dans Supabase UI : New bucket → `media` → Public

### Étape 1.2 — Tables

**Option A (recommandée)** : Exécuter via SQL Editor

```sql
-- Extension de site_config
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'text';

-- Nouvelle table media_items
CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('image','video')),
  url text,
  storage_path text,
  alt_fr text,
  alt_en text,
  section text,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_media_section ON media_items(section);
CREATE INDEX IF NOT EXISTS idx_media_active ON media_items(active);
```

### Étape 1.3 — Row Level Security (RLS)

```sql
-- Policies pour media_items
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read media" 
ON media_items FOR SELECT 
USING (active = true);

CREATE POLICY "Admin full access media" 
ON media_items 
FOR ALL 
USING (auth.role() = 'authenticated');
```

Répéter pour `site_config` si nécessaire.

### Étape 1.4 — Variables d'environnement

Ajouter dans `.env` (local) et Netlify :

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## PHASE 2 — SYSTÈME MÉDIA UNIVERSEL (Code)

### Étape 2.1 — Hook & Helpers

**Fichier à modifier** : `src/hooks/useSupabaseData.ts`

Ajouter support unifié pour médias.

### Étape 2.2 — Composant FileUpload Universel

**Fichier** : `src/admin/components/FileUpload.tsx`

- Accepter image + vidéo
- Détection automatique du type
- Preview conditionnel (img / video)
- Drag & drop amélioré

### Étape 2.3 — AdminContent Complet

**Fichier** : `src/admin/components/AdminContent.tsx`

Onglets à implémenter :
- Hero (image + vidéo)
- About
- Vision
- Projects

Utiliser le nouveau `FileUpload` partout.

---

## PHASE 3 — DIRECTION CRÉATIVE (Expérience)

### Étape 3.1 — Hero (Priorité absolue)

**Fichier** : `src/components/sections/Hero.tsx`

Implémenter :
- 5 couches visuelles
- Support vidéo ou image dynamique
- Typographie monumentale
- Grain cinéma + lumière atmosphérique
- Mouvement organique

### Étape 3.2 — Autres sections créatives

- Vision.tsx → traitement cinématique
- Projects.tsx → présentation éditoriale
- Ajout global de textures et grain

---

## PHASE 4 — DOCUMENTATION

Créer les fichiers suivants dans `docs/` :

1. `01_SUPABASE_SETUP.md`
2. `02_STORAGE_SETUP.md`
3. `03_DATABASE_SETUP.md`
4. `04_AUTH_SETUP.md`
5. `05_ENV_VARIABLES.md`
6. `06_ADMIN_SYSTEM.md`
7. `07_MEDIA_UPLOAD_SYSTEM.md`
8. `08_STORAGE_POLICIES.md`
9. `09_DEPLOYMENT.md`
10. `10_TROUBLESHOOTING.md`

Chaque fichier doit contenir des instructions **pas à pas** (où cliquer, SQL exact, etc.).

---

## PHASE 5 — TESTS & FINALISATION

- Test upload image + vidéo sur toutes les zones
- Test fallback
- Test mobile (priorité)
- Audit Lighthouse
- Commit final

---

## ORDRE EXACT RECOMMANDÉ (À suivre séquentiellement)

1. Phase 1.1 → 1.4 (Supabase dashboard + SQL)
2. Étape 2.1 (Hook)
3. Étape 2.2 (FileUpload complet)
4. Étape 2.3 (AdminContent)
5. Étape 3.1 (Hero cinématique)
6. Étape 3.2 (autres sections)
7. Phase 4 (toute la documentation)
8. Phase 5 (tests + polish)

---

**Statut actuel** : Ce plan est prêt à être exécuté.

Je peux commencer immédiatement par **l'Étape 1.1** ou n'importe quelle phase sur demande.