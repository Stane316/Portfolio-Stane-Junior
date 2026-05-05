-- ============================================================
-- FICHIER SQL 05: FONCTIONS DE SÉCURITÉ ET UTILITAIRES
-- ============================================================
-- Exécute CE fichier APRÈS 04_insert_demo_data.sql
-- ============================================================

-- ============================================================
-- FONCTION: Vérifier si l'utilisateur est admin
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifie si l'utilisateur connecté est dans la liste des admins
  -- Par défaut, tout utilisateur authentifié est admin
  -- Tu peux personnaliser cette logique si nécessaire
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FONCTION: Log des actions admin (audit trail)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_user ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);

-- Policy pour admin_logs
CREATE POLICY "Authenticated can view admin_logs" ON admin_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert admin_logs" ON admin_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- FONCTION: Nettoyage automatique des vieux messages
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_old_messages(older_than_days INT DEFAULT 90)
RETURNS INT AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM messages 
  WHERE created_at < NOW() - (older_than_days || ' days')::interval
  AND is_read = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FONCTION: Validation email
-- ============================================================

CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Trigger pour valider les emails dans messages
CREATE OR REPLACE FUNCTION check_message_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validate_email(NEW.email) THEN
    RAISE EXCEPTION 'Email invalide: %', NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_message_email
  BEFORE INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION check_message_email();

-- ============================================================
-- FONCTION: Count total des éléments
-- ============================================================

CREATE OR REPLACE FUNCTION get_site_stats()
RETURNS TABLE (
  total_projects BIGINT,
  visible_projects BIGINT,
  total_testimonials BIGINT,
  visible_testimonials BIGINT,
  total_messages BIGINT,
  unread_messages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM projects WHERE is_visible = true) as visible_projects,
    (SELECT COUNT(*) FROM testimonials) as total_testimonials,
    (SELECT COUNT(*) FROM testimonials WHERE is_visible = true) as visible_testimonials,
    (SELECT COUNT(*) FROM messages) as total_messages,
    (SELECT COUNT(*) FROM messages WHERE is_read = false) as unread_messages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TEST DES FONCTIONS
-- ============================================================

-- Tester get_site_stats
-- SELECT * FROM get_site_stats();

-- Tester validate_email
-- SELECT validate_email('test@example.com');
-- SELECT validate_email('invalid-email');
