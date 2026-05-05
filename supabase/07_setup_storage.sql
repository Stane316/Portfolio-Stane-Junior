-- ============================================================
-- FICHIER SQL 07: CONFIGURATION SUPABASE STORAGE
-- ============================================================
-- Exécute CE fichier APRÈS 06_add_logo_fields.sql
-- 
-- Crée les buckets et policies pour l'upload d'images
-- ============================================================

-- ============================================================
-- CRÉER LES BUCKETS
-- ============================================================

-- Bucket pour les images générales (logos, photos, etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les CV (PDF)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-docs', 'portfolio-docs', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- POLICIES POUR portfolio-assets (images)
-- ============================================================

-- Public peut LIRE les images
CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

-- Authenticated peut UPLOAD des images
CREATE POLICY "Authenticated can upload portfolio assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-assets' 
    AND auth.role() = 'authenticated'
  );

-- Authenticated peut UPDATE des images
CREATE POLICY "Authenticated can update portfolio assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-assets' 
    AND auth.role() = 'authenticated'
  );

-- Authenticated peut DELETE des images
CREATE POLICY "Authenticated can delete portfolio assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-assets' 
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- POLICIES POUR portfolio-docs (CV PDF)
-- ============================================================

-- Public peut LIRE les documents
CREATE POLICY "Public can view portfolio docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-docs');

-- Authenticated peut UPLOAD des documents
CREATE POLICY "Authenticated can upload portfolio docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-docs' 
    AND auth.role() = 'authenticated'
  );

-- Authenticated peut DELETE des documents
CREATE POLICY "Authenticated can delete portfolio docs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-docs' 
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- AJOUTER CHAMP IMAGE AUX TABLES EXISTANTES
-- ============================================================

-- Ajouter champ image_url à projects (pour l'aperçu du projet)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Ajouter champ hero_image_url à site_config pour la photo professionnelle
INSERT INTO site_config (key, value_fr, value_en, value_generic) VALUES
  ('hero_image_url', NULL, NULL, ''),
  ('growtech_logo_url', NULL, NULL, ''),
  ('growtech_logo_alt', NULL, NULL, 'GROW TECH Logo'),
  ('cv_url', NULL, NULL, '')
ON CONFLICT (key) DO UPDATE SET
  value_fr = EXCLUDED.value_fr,
  value_en = EXCLUDED.value_en,
  value_generic = EXCLUDED.value_generic;

-- ============================================================
-- VÉRIFICATION
-- ============================================================

-- Vérifier les buckets
SELECT id, name, public FROM storage.buckets;

-- Vérifier les policies
SELECT policyname, tablename, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' 
ORDER BY tablename;
