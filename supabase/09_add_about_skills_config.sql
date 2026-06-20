-- ============================================================
-- FICHIER SQL 09: AJOUT CONFIG ABOUT + SKILLS + FOOTER
-- ============================================================
-- Exécute CE fichier APRÈS 08_create_missing_tables.sql
--
-- Rend les sections About, Skills et Footer éditables
-- depuis l'admin sans toucher au code.
-- ============================================================

-- ============================================================
-- SECTION ABOUT — Paragraphes de texte
-- ============================================================

INSERT INTO site_config (key, value_fr, value_en, value_generic) VALUES
  ('about_text_p1', 'J''ai 18 ans, je suis en Licence 1 à l''IFRI-UAC à Abomey-Calavi, et je code depuis que j''ai compris qu''on pouvait transformer une idée en quelque chose de réel avec juste un clavier.', 'I''m 18, studying Software Development (Licence 1) at IFRI-UAC in Abomey-Calavi, and I''ve been coding since I realized you can turn an idea into something real with just a keyboard.', NULL),
  ('about_text_p2', 'Ce qui me motive n''est pas l''outil. C''est le problème à résoudre. J''ai travaillé dans une agence Mobile Money, j''ai vu comment les petits commerçants béninois gèrent — ou plutôt ne gèrent pas — leurs factures. C''est de là qu''est né FacturaPro. J''ai voulu faire plaisir à quelqu''un d''une façon que personne d''autre ne pouvait faire. C''est de là qu''est né Capsule.', 'What drives me isn''t the tool. It''s the problem to solve. I worked at a Mobile Money agency and watched how small Beninese merchants handle — or rather don''t handle — their invoicing. That''s where FacturaPro came from. I wanted to create something special for someone in a way nobody else could. That''s where Capsule came from.', NULL),
  ('about_text_p3', 'Aujourd''hui, j''ai fondé GROW TECH avec un collaborateur. Six personnes. Une vraie agence. On développe des solutions digitales pour les entreprises du Bénin et de la sous-région.', 'Today, I co-founded GROW TECH with a business partner. Six people. A real agency. We build digital solutions for businesses in Benin and the West African sub-region.', NULL),
  ('about_text_p4', 'Je suis développeur. Mais surtout, je suis quelqu''un qui observe, qui comprend, et qui code pour résoudre.', 'I''m a developer. But above all, I''m someone who observes, understands, and codes to solve.', NULL),
  ('about_location', '📍 Abomey-Calavi, Bénin', '📍 Abomey-Calavi, Benin', NULL),
  ('about_education', '🎓 IFRI-UAC — Licence 1 Dev Logiciel', '🎓 IFRI-UAC — Software Development Licence 1', NULL),
  ('about_role', '🏢 Fondateur & Tech Lead — GROW TECH', '🏢 Founder & Tech Lead — GROW TECH', NULL),
  ('about_target', '🌍 Zone OHADA — 17 pays cibles', '🌍 OHADA Zone — 17 target countries', NULL),
  ('about_available', '⚡ Disponible pour missions freelance', '⚡ Available for freelance missions', NULL)
ON CONFLICT (key) DO UPDATE SET
  value_fr = EXCLUDED.value_fr,
  value_en = EXCLUDED.value_en,
  value_generic = EXCLUDED.value_generic;

-- ============================================================
-- SECTION SKILLS — Données des compétences (JSON)
-- ============================================================

-- Structure JSON pour les compétences
-- Chaque compétence a : name, level (0-100), category (mastered/learning/basics), icon
INSERT INTO site_config (key, value_fr, value_en, value_generic) VALUES
  ('skills_data', NULL, NULL, '[
    {"name": "React", "level": 85, "category": "mastered", "icon": "⚛️"},
    {"name": "JavaScript", "level": 80, "category": "mastered", "icon": "JS"},
    {"name": "TypeScript", "level": 70, "category": "mastered", "icon": "TS"},
    {"name": "Supabase", "level": 75, "category": "mastered", "icon": "SB"},
    {"name": "TailwindCSS", "level": 85, "category": "mastered", "icon": "🎨"},
    {"name": "HTML/CSS", "level": 90, "category": "mastered", "icon": "🌐"},
    {"name": "Node.js", "level": 55, "category": "learning", "icon": "🟢"},
    {"name": "Python", "level": 50, "category": "learning", "icon": "🐍"},
    {"name": "Three.js", "level": 40, "category": "learning", "icon": "🎮"},
    {"name": "Next.js", "level": 45, "category": "learning", "icon": "▲"},
    {"name": "SQL", "level": 35, "category": "basics", "icon": "🗃️"},
    {"name": "Docker", "level": 30, "category": "basics", "icon": "🐳"},
    {"name": "Git", "level": 70, "category": "mastered", "icon": "📦"}
  ]'),
  ('skills_honesty', 'Je travaille avec une approche honnête : je ne liste que ce que je peux défendre et expliquer. Ma capacité à utiliser intelligemment les outils IA pour mener des projets à terme est une compétence à part entière — pas un aveu de faiblesse.', 'I work with an honest approach: I only list what I can defend and explain. My ability to intelligently use AI tools to complete projects is a skill in its own right — not an admission of weakness.', NULL)
ON CONFLICT (key) DO UPDATE SET
  value_fr = EXCLUDED.value_fr,
  value_en = EXCLUDED.value_en,
  value_generic = EXCLUDED.value_generic;

-- ============================================================
-- SECTION FOOTER — Liens sociaux et copyright
-- ============================================================

INSERT INTO site_config (key, value_fr, value_en, value_generic) VALUES
  ('footer_tagline', 'Étudiant Développeur & Fondateur d''Agence', 'Developer Student & Agency Founder', NULL),
  ('footer_founder', 'Fondateur de GROW TECH · Abomey-Calavi, Bénin', 'Founder of GROW TECH · Abomey-Calavi, Benin', NULL)
ON CONFLICT (key) DO UPDATE SET
  value_fr = EXCLUDED.value_fr,
  value_en = EXCLUDED.value_en,
  value_generic = EXCLUDED.value_generic;

-- ============================================================
-- VÉRIFICATION
-- ============================================================

SELECT key, 
  CASE WHEN value_fr IS NOT NULL THEN '✅ FR' ELSE '❌ FR' END as has_fr,
  CASE WHEN value_en IS NOT NULL THEN '✅ EN' ELSE '❌ EN' END as has_en,
  CASE WHEN value_generic IS NOT NULL THEN '✅ Generic' ELSE '❌ Generic' END as has_generic
FROM site_config 
ORDER BY key;
