-- ============================================================
-- FICHIER SQL 01: CRÉATION DES TABLES PRINCIPALES
-- ============================================================
-- Exécute CE fichier en PREMIER dans Supabase SQL Editor
-- ============================================================

-- Table: projects
-- Stocke tous les projets du portfolio
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  status TEXT CHECK (status IN ('delivered', 'in_progress', 'concept')) NOT NULL DEFAULT 'concept',
  description_fr TEXT,
  description_en TEXT,
  stack TEXT[],
  live_url TEXT,
  case_study_fr JSONB,
  case_study_en JSONB,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: testimonials
-- Stocke les témoignages clients
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  person_name TEXT NOT NULL,
  person_role TEXT,
  company TEXT,
  content_fr TEXT,
  content_en TEXT,
  photo_url TEXT,
  video_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: messages
-- Stocke les messages du formulaire de contact
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: site_config
-- Stocke le contenu dynamique éditable depuis l'admin
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value_fr TEXT,
  value_en TEXT,
  value_generic TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEX POUR OPTIMISATION PERFORMANCES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(is_visible);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(display_order);

CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON testimonials(is_visible);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);

CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- ============================================================
-- TRIGGERS POUR UPDATED_AT AUTOMATIQUE
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
