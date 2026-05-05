-- ============================================================
-- FICHIER SQL 06: AJOUTER CHAMP LOGO GROW TECH
-- ============================================================
-- Exécute CE fichier APRÈS 05_security_functions.sql
-- ============================================================

-- Ajouter le champ pour le logo GROW TECH
INSERT INTO site_config (key, value_fr, value_en, value_generic) VALUES
  ('growtech_logo_url', NULL, NULL, ''),
  ('growtech_logo_alt', NULL, NULL, 'GROW TECH Logo')
ON CONFLICT (key) DO UPDATE SET
  value_fr = EXCLUDED.value_fr,
  value_en = EXCLUDED.value_en,
  value_generic = EXCLUDED.value_generic;

-- Vérifier l'insertion
SELECT * FROM site_config WHERE key LIKE 'growtech_logo%';
