-- ============================================================
-- PHASE 1 — UNIVERSAL ADMIN MEDIA SYSTEM (INFRASTRUCTURE)
-- ============================================================
-- Exécute CE fichier APRÈS les scripts 01 à 09 existants.
-- Ajoute le support complet pour media dynamique (image OU vidéo).
-- Crée : media_items + bucket 'media' + RLS + policies
-- ============================================================

-- ============================================================
-- 1. EXTENSION DE site_config (pour support type image/video)
-- ============================================================
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text';

-- Ajout de colonnes pour cohérence future (optionnel mais recommandé)
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';

-- ============================================================
-- 2. CRÉATION DE LA TABLE media_items
-- ============================================================
-- Chaque zone média (hero, about, vision, projects, etc.) peut stocker
-- soit une image, soit une vidéo.
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,                    -- ex: 'hero_media', 'about_photo', 'vision_media'
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT,                                     -- URL publique (Supabase Storage ou externe)
  storage_path TEXT,                            -- Chemin dans le bucket 'media'
  alt_fr TEXT,
  alt_en TEXT,
  section TEXT NOT NULL,                        -- 'hero', 'about', 'vision', 'projects', etc.
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_media_items_key ON media_items(key);
CREATE INDEX IF NOT EXISTS idx_media_items_section ON media_items(section);
CREATE INDEX IF NOT EXISTS idx_media_items_active ON media_items(active);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(type);

-- Trigger updated_at automatique
CREATE OR REPLACE FUNCTION update_media_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_media_items_updated_at ON media_items;
CREATE TRIGGER update_media_items_updated_at 
  BEFORE UPDATE ON media_items
  FOR EACH ROW EXECUTE FUNCTION update_media_items_updated_at();

-- ============================================================
-- 3. CRÉATION DU BUCKET STORAGE 'media' (PUBLIC)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. POLICIES STORAGE pour le bucket 'media'
-- ============================================================

-- Lecture publique (tout le monde peut voir les médias)
CREATE POLICY IF NOT EXISTS "Public can view media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Upload réservé aux utilisateurs authentifiés (admin)
CREATE POLICY IF NOT EXISTS "Authenticated can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Update réservé aux utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Authenticated can update media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Delete réservé aux utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Authenticated can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- ============================================================
-- 5. ACTIVER ROW LEVEL SECURITY (RLS) SUR media_items
-- ============================================================
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. POLICIES RLS POUR media_items
-- ============================================================

-- Lecture publique : tout le monde peut lire les médias actifs
CREATE POLICY "Public read media_items"
ON media_items
FOR SELECT
USING (active = true);

-- Admin (authenticated) : accès complet (SELECT/INSERT/UPDATE/DELETE)
CREATE POLICY "Admin full access media_items"
ON media_items
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 7. MISE À JOUR RLS site_config (si pas déjà complet)
-- ============================================================
-- On s'assure que le site_config est déjà protégé (déjà fait dans 03)
-- On ajoute une policy explicite si nécessaire (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_config' 
    AND policyname = 'Public can view site_config'
  ) THEN
    CREATE POLICY "Public can view site_config" 
    ON site_config FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_config' 
    AND policyname = 'Authenticated can manage site_config'
  ) THEN
    CREATE POLICY "Authenticated can manage site_config" 
    ON site_config FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- ============================================================
-- 8. DONNÉES INITIALES — Exemples de clés media (optionnel)
-- ============================================================
-- Ces entrées permettent de commencer immédiatement dans l'admin.
-- Elles seront écrasées par les uploads réels.

INSERT INTO media_items (key, type, url, storage_path, section, alt_fr, alt_en, active)
VALUES 
  ('hero_media', 'image', NULL, NULL, 'hero', 'Portrait professionnel de Stane', 'Professional portrait of Stane', true),
  ('about_photo', 'image', NULL, NULL, 'about', 'Photo de Stane', 'Photo of Stane', true),
  ('vision_media', 'image', NULL, NULL, 'vision', 'Vision pour le futur', 'Vision for the future', true),
  ('projects_default', 'image', NULL, NULL, 'projects', 'Aperçu projet', 'Project preview', true)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 9. VÉRIFICATION FINALE
-- ============================================================

-- Vérifier les buckets
SELECT id, name, public FROM storage.buckets WHERE id IN ('media', 'portfolio-assets');

-- Vérifier la table media_items
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'media_items' 
ORDER BY ordinal_position;

-- Vérifier les policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('media_items', 'site_config') 
ORDER BY tablename, policyname;

-- Vérifier les enregistrements initiaux
SELECT key, type, section, active FROM media_items ORDER BY section;