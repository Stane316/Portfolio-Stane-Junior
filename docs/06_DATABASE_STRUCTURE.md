# 06 — Database Structure

## OBJECTIF

Comprendre la structure de la base de données Supabase, les tables, leurs colonnes, leurs relations et les politiques de sécurité.

---

## PRÉREQUIS

- Avoir lu `05_SUPABASE_SETUP.md`
- Les scripts SQL ont été exécutés

---

## Schéma relationnel

```
site_config (key-value)
├── hero_* (badges, stats, tagline, photo)
├── about_* (paragraphs, location, education, role)
├── footer_* (tagline, founder)
├── skills_* (catégories, items, honesty)
├── testimonials_placeholder
├── whatsapp / github / linkedin / email_contact
└── growtech_* (url, cta_badge)

projects
├── id (UUID, PK)
├── title_fr / title_en
├── description_fr / description_en
├── status (delivered | in_progress | concept)
├── stack (text[])
├── live_url / image_url
├── case_study_fr / case_study_en (JSONB)
├── display_order / is_visible / is_featured
└── created_at

testimonials
├── id (UUID, PK)
├── person_name / person_role / company
├── content_fr / content_en
├── photo_url / video_url
├── is_visible / display_order
└── created_at

messages
├── id (UUID, PK)
├── full_name / email / subject / message
├── is_read
└── created_at

blog_posts
├── id (UUID, PK)
├── title_fr / title_en / slug (UNIQUE)
├── excerpt_fr / excerpt_en
├── content_fr / content_en
├── category / image_url
├── is_published / published_at
├── display_order
└── created_at / updated_at

vision_items
├── id (UUID, PK)
├── title_fr / title_en
├── description_fr / description_en
├── status (concept | in_progress | paused)
├── image_url / order
└── created_at / updated_at

admin_logs
├── id (UUID, PK)
├── user_id / action / table_name / record_id
├── details (JSONB)
└── created_at
```

---

## Table site_config — Le magasin key-value universel

C'est la table la plus importante du projet. Elle fonctionne comme un **magasin clé-valeur** qui stocke TOUT le contenu textuel et les URLs du site.

### Structure

| Colonne | Type | Description |
|---------|------|-------------|
| `key` | TEXT (PK) | Identifiant unique de la config |
| `value_fr` | TEXT | Valeur en français |
| `value_en` | TEXT | Valeur en anglais |
| `value_generic` | TEXT | Valeur langue-agnostique (URLs, nombres) |

### Clés utilisées

| Clé | Type | Usage |
|-----|------|-------|
| `hero_badge` | bilingue | Badge d'accroche hero |
| `hero_tagline` | bilingue | Phrase d'accroche hero |
| `hero_photo_url` | generic | Photo profil hero |
| `hero_stat_1` | generic | Valeur stat 1 (ex: "5+") |
| `hero_stat_1_label` | bilingue | Label stat 1 |
| `hero_stat_2` | generic | Valeur stat 2 |
| `hero_stat_2_label` | bilingue | Label stat 2 |
| `hero_stat_3` | generic | Valeur stat 3 |
| `hero_stat_3_label` | bilingue | Label stat 3 |
| `about_text_p1` à `p4` | bilingue | Paragraphes À propos |
| `about_location` | bilingue | Localisation |
| `about_education` | bilingue | Formation |
| `about_role` | bilingue | Rôle |
| `about_target` | bilingue | Cible marché |
| `about_available` | bilingue | Disponibilité |
| `footer_tagline` | bilingue | Tagline footer |
| `footer_founder` | bilingue | Fondateur footer |
| `whatsapp` | generic | URL WhatsApp |
| `github` | generic | URL GitHub |
| `linkedin` | generic | URL LinkedIn |
| `email_contact` | generic | Email contact |
| `growtech_url` | generic | URL GROW TECH |
| `growtech_cta_badge` | generic | Badge CTA GROW TECH |
| `skills_mastered` | bilingue | Compétences maîtrisées (JSON) |
| `skills_learning` | bilingue | Compétences en apprentissage (JSON) |
| `skills_basics` | bilingue | Compétences notions (JSON) |
| `skills_honesty` | bilingue | Note d'honnêteté |
| `testimonials_placeholder` | bilingue | Placeholder témoignages |

---

## Row Level Security (RLS)

Chaque table a des politiques RLS qui contrôlent qui peut lire/écrire :

| Table | Public (anon) | Authentifié |
|-------|--------------|-------------|
| `projects` | SELECT WHERE is_visible = true | ALL |
| `testimonials` | SELECT WHERE is_visible = true | ALL |
| `messages` | INSERT uniquement | ALL |
| `site_config` | SELECT | ALL |
| `blog_posts` | SELECT WHERE is_published = true | ALL |
| `vision_items` | SELECT (tout) | ALL |
| `admin_logs` | Aucun accès | INSERT + SELECT |

---

## ERREURS POSSIBLES

### Erreur : "new row violates row-level security policy"

**Cause** : Vous essayez d'écrire sans être authentifié.
**Solution** : Se connecter à l'admin d'abord.

### Erreur : PGRST116 — "0 rows" ou "not a single row"

**Cause** : La requête `.single()` n'a trouvé aucun résultat.
**Solution** : C'est géré par le code (BlogArticle 404). Vérifier que les données existent dans la table.

---

## COMMENT VÉRIFIER

1. Dans le dashboard Supabase → Table Editor
2. Vérifier que chaque table contient des données
3. Vérifier que RLS est activé sur chaque table (petit bouclier vert)

---

## CHECKLIST

- [ ] Vous comprenez le schéma de chaque table
- [ ] Vous savez comment site_config fonctionne comme key-value store
- [ ] Vous comprenez les politiques RLS
- [ ] Les tables contiennent des données dans le dashboard Supabase
