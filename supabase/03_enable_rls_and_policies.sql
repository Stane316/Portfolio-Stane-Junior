-- ============================================================
-- FICHIER SQL 03: ACTIVER RLS ET CRÉER LES POLICIES
-- ============================================================
-- Exécute CE fichier APRÈS 02_insert_initial_config.sql
-- ============================================================

-- ============================================================
-- ACTIVER ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES POUR TABLE: projects
-- ============================================================

-- Public peut VOIR les projets visibles
CREATE POLICY "Public can view visible projects" ON projects
  FOR SELECT USING (is_visible = true);

-- Authenticated peut TOUT faire sur projects
CREATE POLICY "Authenticated can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- POLICIES POUR TABLE: testimonials
-- ============================================================

-- Public peut VOIR les témoignages visibles
CREATE POLICY "Public can view visible testimonials" ON testimonials
  FOR SELECT USING (is_visible = true);

-- Authenticated peut TOUT faire sur testimonials
CREATE POLICY "Authenticated can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- POLICIES POUR TABLE: messages
-- ============================================================

-- Public peut SEULEMENT INSÉRER des messages (formulaire contact)
CREATE POLICY "Public can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Authenticated peut VOIR et GÉRER les messages
CREATE POLICY "Authenticated can view messages" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update messages" ON messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete messages" ON messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- POLICIES POUR TABLE: site_config
-- ============================================================

-- Public peut VOIR la config (pour charger le contenu dynamique)
CREATE POLICY "Public can view site_config" ON site_config
  FOR SELECT USING (true);

-- Authenticated peut TOUT faire sur site_config
CREATE POLICY "Authenticated can manage site_config" ON site_config
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- VÉRIFICATION DES POLICIES
-- ============================================================

-- Afficher toutes les policies créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
