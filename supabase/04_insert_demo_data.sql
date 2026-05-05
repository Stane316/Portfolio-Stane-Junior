-- ============================================================
-- FICHIER SQL 04: 3 PROJETS PAR DÉFAUT
-- ============================================================
-- Exécute CE fichier APRÈS 03_enable_rls_and_policies.sql
-- 
-- Ce fichier insère les 3 projets initiaux:
-- 1. Maquis Digital
-- 2. CRM Léger
-- 3. Capsule
-- 
-- Une fois dans Supabase, tu pourras les modifier ou en ajouter
-- depuis l'admin panel (/#/admin/projects)
-- ============================================================

-- Insérer les 3 projets initiaux
INSERT INTO projects (
  title_fr, title_en, status, 
  description_fr, description_en,
  stack, live_url, display_order, is_visible, is_featured,
  case_study_fr, case_study_en
) VALUES
(
  'Maquis Digital',
  'Maquis Digital',
  'delivered',
  'Menu digital interactif pour restaurants et maquis. Le client scanne un QR code depuis son téléphone, consulte le menu et passe sa commande directement — sans attendre le serveur. La commande est transmise via WhatsApp.',
  'Interactive digital menu for restaurants. The customer scans a QR code from their phone, browses the menu and places their order directly — no need to wait for a waiter. The order is sent via WhatsApp.',
  ARRAY['HTML', 'CSS', 'JavaScript', 'QR Code API'],
  'https://maquis-digital.netlify.app/',
  1,
  true,
  true,
  '{"step1": {"title": "PROBLÈME", "content": "Dans les maquis et restaurants béninois, le client attend souvent plusieurs minutes juste pour qu''un serveur prenne sa commande. Aux heures de pointe, c''est une expérience frustrante qui fait perdre des clients et du chiffre."}, "step2": {"title": "SOLUTION", "content": "Un menu digital accessible via QR code depuis n''importe quel smartphone. Aucune application à installer. Le client choisit, le serveur reçoit."}, "step3": {"title": "FONCTIONNALITÉS", "content": "- Menu catégorisé avec photos et prix en FCFA\n- Sélection de quantité par article\n- Récapitulatif de commande avant envoi\n- Envoi de la commande formatée via WhatsApp Business"}, "step4": {"title": "OBSTACLE", "content": "Le défi principal était de trouver un canal de transmission de commande accessible aux restaurateurs béninois sans infrastructure complexe. WhatsApp s''est imposé comme la solution évidente."}, "step5": {"title": "RÉSULTAT", "content": "Projet livré et fonctionnel. Un restaurant a utilisé le prototype. Preuve qu''un problème local simple peut être résolu avec une technologie légère et adaptée au contexte."}}'::jsonb,
  '{"step1": {"title": "PROBLEM", "content": "In Beninese maquis and restaurants, customers often wait several minutes just for a waiter to take their order. During peak hours, it''s a frustrating experience that loses customers and revenue."}, "step2": {"title": "SOLUTION", "content": "A digital menu accessible via QR code from any smartphone. No app to install. Customer chooses, server receives."}, "step3": {"title": "FEATURES", "content": "- Categorized menu with photos and prices in FCFA\n- Quantity selection per item\n- Order summary before sending\n- Formatted order sent via WhatsApp Business"}, "step4": {"title": "OBSTACLE", "content": "The main challenge was finding an order transmission channel accessible to Beninese restaurateurs without complex infrastructure. WhatsApp emerged as the obvious solution."}, "step5": {"title": "RESULT", "content": "Project delivered and functional. A restaurant used the prototype. Proof that a simple local problem can be solved with lightweight technology adapted to the context."}}'::jsonb
),
(
  'CRM Léger',
  'Lightweight CRM',
  'in_progress',
  'CRM minimaliste pour indépendants et agences. Centralise les informations clients, le suivi des prospects, les revenus et les statistiques en un seul endroit. Conçu pour GROW TECH, ouvert à tous.',
  'Lightweight CRM for freelancers and agencies. Centralizes client information, prospect tracking, revenue, and statistics in one place. Designed for GROW TECH, open to all.',
  ARRAY['React', 'Supabase', 'TailwindCSS'],
  'https://crm-leger.netlify.app/',
  2,
  true,
  false,
  '{"step1": {"title": "PROBLÈME", "content": "En gérant les prospects de GROW TECH, j''ai réalisé qu''aucun outil CRM existant n''est réellement adapté aux petites agences africaines : trop complexes, trop chers, ou en anglais uniquement."}, "step2": {"title": "SOLUTION", "content": "Un CRM léger, en français, gratuit, déployé sur le web. Accessible depuis un smartphone. Conçu autour des vraies questions qu''on se pose."}, "step3": {"title": "FONCTIONNALITÉS", "content": "- Gestion des contacts clients et prospects\n- Statut des prospects (à contacter, en négociation, signé, perdu)\n- Suivi des revenus par client\n- Tableau de bord avec statistiques"}, "step4": {"title": "OBSTACLE", "content": "La difficulté principale : trouver la bonne balance entre simplicité (un outil qu''on utilise vraiment) et fonctionnalité (un outil qui apporte de la valeur)."}, "step5": {"title": "RÉSULTAT", "content": "Projet en production, utilisé activement pour le suivi commercial de GROW TECH. Il continue d''évoluer en fonction des besoins réels de l''agence."}}'::jsonb,
  '{"step1": {"title": "PROBLEM", "content": "While managing GROW TECH prospects, I realized that no existing CRM tool is really suited for small African agencies: too complex, too expensive, or English only."}, "step2": {"title": "SOLUTION", "content": "A lightweight CRM, in French, free, deployed on the web. Accessible from a smartphone. Designed around the real questions we ask ourselves."}, "step3": {"title": "FEATURES", "content": "- Client and prospect contact management\n- Prospect status (to contact, negotiating, signed, lost)\n- Revenue tracking per client\n- Dashboard with statistics"}, "step4": {"title": "OBSTACLE", "content": "The main difficulty: finding the right balance between simplicity (a tool we actually use) and functionality (a tool that provides value)."}, "step5": {"title": "RESULT", "content": "Project in production, actively used for GROW TECH sales follow-up. It continues to evolve based on the agency''s real needs."}}'::jsonb
),
(
  'Capsule',
  'Capsule',
  'delivered',
  'Plateforme collaborative de partage de souvenirs pour créer une surprise d anniversaire collective. Les proches déposent des messages et photos, tout se révèle le jour J.',
  'Collaborative platform for sharing memories to create a collective birthday surprise. Friends and family leave messages and photos — everything is revealed on the big day.',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Supabase'],
  'https://capsule-anniversaire.netlify.app/',
  3,
  true,
  false,
  '{"step1": {"title": "PROBLÈME", "content": "Faire quelque chose d''unique pour quelqu''un qu''on aime. Quelque chose que seul un développeur peut faire. Pas un cadeau acheté : une expérience créée."}, "step2": {"title": "SOLUTION", "content": "Une plateforme où les proches d''une personne peuvent déposer un message, une photo, un souvenir — et tout se révèle dans un ''livre'' numérique le jour de son anniversaire."}, "step3": {"title": "FONCTIONNALITÉS", "content": "- Formulaire de dépôt de messages et photos (avec validation)\n- Compte à rebours dynamique jusqu''au jour J\n- Page secrète de révélation (accès temporisé)\n- Stockage des contributions via Supabase"}, "step4": {"title": "OBSTACLE", "content": "La gestion de la confidentialité : les messages déposés ne doivent pas être visibles avant la date. La solution : une page de révélation protégée par logique temporelle."}, "step5": {"title": "RÉSULTAT", "content": "Projet livré et utilisé. La surprise a fonctionné. Ce projet prouve que la technique peut servir des moments humains — pas seulement des processus."}}'::jsonb,
  '{"step1": {"title": "PROBLEM", "content": "Do something unique for someone you love. Something only a developer can do. Not a bought gift: a created experience."}, "step2": {"title": "SOLUTION", "content": "A platform where a person''s loved ones can leave a message, a photo, a memory — and everything is revealed in a digital ''book'' on their birthday."}, "step3": {"title": "FEATURES", "content": "- Message and photo submission form (with validation)\n- Dynamic countdown to the big day\n- Secret revelation page (timed access)\n- Storage of contributions via Supabase"}, "step4": {"title": "OBSTACLE", "content": "Managing privacy: submitted messages must not be visible before the date. The solution: a revelation page protected by client-side temporal logic."}, "step5": {"title": "RESULT", "content": "Project delivered and used. The surprise worked. This project proves that technology can serve human moments — not just processes."}}'::jsonb
);

-- Vérifier l'insertion
SELECT id, title_fr, status, display_order, is_visible FROM projects ORDER BY display_order;
