-- ============================================================
-- FICHIER SQL 02: DONNÉES INITIALES SITE_CONFIG
-- ============================================================
-- Exécute CE fichier APRÈS 01_create_tables.sql
-- ============================================================

-- Insérer les configurations par défaut du site
INSERT INTO site_config (key, value_fr, value_en, value_generic) VALUES
  -- Hero Section
  ('hero_badge', 'Disponible pour missions freelance', 'Available for freelance missions', NULL),
  ('hero_tagline', 'Je ne construis pas juste des sites web. Je code des solutions à des problèmes que j''ai observés, vécus, compris.', 'I don''t just build websites. I code solutions to problems I''ve observed, lived, and understood.', NULL),
  
  -- Stats Hero
  ('hero_stat_1_value', NULL, NULL, '5+'),
  ('hero_stat_1_label', 'Projets livrés', 'Delivered projects', NULL),
  ('hero_stat_2_value', NULL, NULL, '6'),
  ('hero_stat_2_label', 'Membres GROW TECH', 'GROW TECH members', NULL),
  ('hero_stat_3_value', NULL, NULL, '2'),
  ('hero_stat_3_label', 'Co-fondateurs', 'Co-founders', NULL),
  
  -- GROW TECH
  ('growtech_url', NULL, NULL, ''),
  ('growtech_cta_badge', 'Bientôt disponible', 'Coming soon', NULL),
  
  -- Testimonials
  ('testimonials_placeholder', 'Les témoignages arrivent bientôt — les projets, eux, sont déjà là.', 'Testimonials coming soon — the projects are already there.', NULL),
  
  -- Contacts
  ('whatsapp', NULL, NULL, '+2290199218112'),
  ('github', NULL, NULL, 'https://github.com/Stane316/'),
  ('linkedin', NULL, NULL, 'https://www.linkedin.com/in/stane-aniambossou-2a412b3b8/'),
  ('email_contact', NULL, NULL, 'contact@stanejunior.com'),
  
  -- Disponibilité
  ('is_available', NULL, NULL, 'true'),
  
  -- CV
  ('cv_url', NULL, NULL, '');

-- Vérifier l'insertion
SELECT COUNT(*) as config_count FROM site_config;
