-- ============================================================
-- FICHIER SQL 08: TABLES MANQUANTES (blog_posts + vision_items)
-- ============================================================
-- Exécute CE fichier APRÈS 07_setup_storage.sql
--
-- Ces tables sont utilisées par les composants Admin mais
-- n'avaient jamais été créées dans les scripts précédents.
-- ============================================================

-- ============================================================
-- TABLE: blog_posts
-- Articles de blog avec support bilingue
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt_fr TEXT,
  excerpt_en TEXT,
  content_fr TEXT,
  content_en TEXT,
  category TEXT DEFAULT 'tech',
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour le blog
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_order ON blog_posts(display_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Trigger updated_at pour blog_posts
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: vision_items
-- Concepts / projets en vision pour l'avenir
-- ============================================================

CREATE TABLE IF NOT EXISTS vision_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  status TEXT CHECK (status IN ('concept', 'in_progress', 'paused')) NOT NULL DEFAULT 'concept',
  image_url TEXT,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour vision_items
CREATE INDEX IF NOT EXISTS idx_vision_items_status ON vision_items(status);
CREATE INDEX IF NOT EXISTS idx_vision_items_order ON vision_items("order");

-- Trigger updated_at pour vision_items
CREATE TRIGGER update_vision_items_updated_at BEFORE UPDATE ON vision_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ACTIVER ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES POUR TABLE: blog_posts
-- ============================================================

-- Public peut VOIR les articles publiés
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Authenticated peut TOUT faire sur blog_posts
CREATE POLICY "Authenticated can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- POLICIES POUR TABLE: vision_items
-- ============================================================

-- Public peut VOIR tous les vision items (ils sont publics par nature)
CREATE POLICY "Public can view vision items" ON vision_items
  FOR SELECT USING (true);

-- Authenticated peut TOUT faire sur vision_items
CREATE POLICY "Authenticated can manage vision items" ON vision_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- DONNÉES INITIALES OPTIONNELLES
-- ============================================================

-- Exemple d'article de blog
INSERT INTO blog_posts (title_fr, title_en, slug, excerpt_fr, excerpt_en, content_fr, content_en, category, is_published, published_at, display_order)
VALUES (
  'Mon parcours de développeur étudiant au Bénin',
  'My journey as a student developer in Benin',
  'mon-parcours-developpeur-etudiant-benin',
  'Comment j''ai commencé à coder et où j''en suis aujourd''hui.',
  'How I started coding and where I am today.',
  'J''ai commencé à coder par curiosité. Aujourd''hui, je suis fondateur d''une agence digitale et je développe des solutions pour le marché africain. Ce blog est l''endroit où je partage mes apprentissages, mes erreurs et mes réflexions sur le développement logiciel en Afrique.',
  'I started coding out of curiosity. Today, I''m the founder of a digital agency and I build solutions for the African market. This blog is where I share my learnings, mistakes, and thoughts on software development in Africa.',
  'tech',
  true,
  now(),
  1
) ON CONFLICT (slug) DO NOTHING;

-- Exemples de vision items
INSERT INTO vision_items (title_fr, title_en, description_fr, description_en, status, "order")
VALUES
  ('FacturaPro', 'FacturaPro', 'Système de facturation simple et intelligent pour les petits commerçants de la zone OHADA.', 'Simple and intelligent invoicing system for small merchants in the OHADA zone.', 'paused', 1),
  ('AgriConnect', 'AgriConnect', 'Plateforme de mise en relation entre agriculteurs et acheteurs au Bénin.', 'Platform connecting farmers and buyers in Benin.', 'concept', 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VÉRIFICATION
-- ============================================================

SELECT 'blog_posts' as table_name, COUNT(*) as row_count FROM blog_posts
UNION ALL
SELECT 'vision_items', COUNT(*) FROM vision_items;
