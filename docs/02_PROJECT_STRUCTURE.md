# 02 — Project Structure

## OBJECTIF

Comprendre l'organisation des fichiers et dossiers du projet, pour savoir où trouver chaque chose.

---

## Arborescence complète

```
portfolio/
├── docs/                           # Documentation technique
├── public/                         # Assets statiques servis tel quel
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-image.png
├── src/
│   ├── admin/                      # TOUT le dashboard admin
│   │   ├── components/             # Composants UI de l'admin
│   │   │   ├── AdminBlog.tsx       # CRUD articles de blog
│   │   │   ├── AdminContent.tsx    # Gestion contenu (Hero, About, Footer, Liens)
│   │   │   ├── AdminDashboard.tsx  # Tableau de bord avec KPIs
│   │   │   ├── AdminGrowTech.tsx   # Gestion page GROW TECH
│   │   │   ├── AdminGrowTechMembers.tsx  # CRUD membres équipe
│   │   │   ├── AdminGrowTechProjects.tsx # CRUD projets GROW TECH
│   │   │   ├── AdminGrowTechVision.tsx   # Vision GROW TECH
│   │   │   ├── AdminLayout.tsx     # Layout interne admin
│   │   │   ├── AdminMessages.tsx   # Gestion messages (wrapper)
│   │   │   ├── AdminProjects.tsx   # CRUD projets (version kanban)
│   │   │   ├── AdminProjectsNew.tsx # CRUD projets (version liste premium)
│   │   │   ├── AdminSkills.tsx     # Éditeur visuel compétences
│   │   │   ├── AdminTestimonials.tsx # CRUD témoignages
│   │   │   ├── AdminVision.tsx     # CRUD vision/concepts
│   │   │   ├── AutoTranslateField.tsx # Auto-traduction FR→EN via API
│   │   │   ├── BilingualInput.tsx  # Champ bilingue FR/EN
│   │   │   ├── CaseStudyEditor.tsx # Éditeur études de cas (5 étapes)
│   │   │   ├── ConfirmDialog.tsx   # Dialogue de confirmation modal
│   │   │   ├── EmptyState.tsx      # État vide avec icône + action
│   │   │   ├── FileUpload.tsx      # Upload drag & drop vers Supabase Storage
│   │   │   ├── FormField.tsx       # Champ de formulaire réutilisable
│   │   │   ├── GlobalLoadingIndicator.tsx # Barre de chargement globale
│   │   │   ├── ImageUpload.tsx     # Upload d'image
│   │   │   ├── KPICard.tsx         # Carte métrique animée
│   │   │   ├── MessageList.tsx     # Liste des messages avec filtres
│   │   │   ├── ProjectRow.tsx      # Ligne projet dans la liste admin
│   │   │   ├── ProjectTable.tsx    # Tableau projets (version table)
│   │   │   ├── ProtectedRoute.tsx  # Guard d'authentification
│   │   │   ├── Sidebar.tsx         # Navigation latérale admin
│   │   │   ├── Skeleton.tsx        # Skeletons de chargement admin
│   │   │   ├── Toast.tsx           # Notifications toast
│   │   │   └── Topbar.tsx          # Barre supérieure admin
│   │   ├── hooks/                  # Hooks personnalisés admin
│   │   │   ├── useAdminData.ts     # CRUD générique Supabase
│   │   │   ├── useDebouncedSave.ts # Sauvegarde debouncée
│   │   │   ├── useToast.ts         # Gestion des notifications
│   │   │   └── useUnsavedChanges.ts # Détection modifications non sauvegardées
│   │   ├── ui/                     # Composants UI bas niveau admin
│   │   │   └── ImageUploader.tsx   # Upload image avec onglets URL/Upload
│   │   ├── constant.ts             # Constantes admin
│   │   └── types.ts                # Types TypeScript stricts
│   │
│   ├── components/                 # Composants du site public
│   │   ├── intro/                  # Animation d'intro
│   │   │   └── IntroAnimation.tsx
│   │   ├── layout/                 # Éléments de mise en page
│   │   │   ├── CustomCursor.tsx    # Curseur personnalisé (desktop)
│   │   │   ├── Footer.tsx         # Pied de page
│   │   │   └── Navbar.tsx         # Navigation principale
│   │   ├── sections/               # Sections de la page portfolio
│   │   │   ├── About.tsx          # Section À propos
│   │   │   ├── Blog.tsx           # Aperçu blog
│   │   │   ├── Contact.tsx        # Formulaire de contact
│   │   │   ├── GrowTech.tsx       # Section GROW TECH
│   │   │   ├── Hero.tsx           # Section Hero (accueil)
│   │   │   ├── Projects.tsx       # Section Projets (données Supabase)
│   │   │   ├── ProjectsDetails.tsx # Détails projets (vue étendue)
│   │   │   ├── ProjectsGallery.tsx # Galerie projets
│   │   │   ├── ProjectsStrip.tsx  # Bande projets (vue compacte)
│   │   │   ├── Skills.tsx         # Section Compétences
│   │   │   ├── Testimonials.tsx   # Section Témoignages
│   │   │   └── Vision.tsx         # Section Vision/Concepts
│   │   ├── three/                  # Composants 3D
│   │   │   └── HeroScene.tsx      # Scène 3D arrière-plan Hero
│   │   └── ui/                     # Composants UI réutilisables
│   │       ├── Breadcrumb.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── ImageWithLazyLoad.tsx
│   │       ├── Newsletter.tsx
│   │       ├── ParticlesBackground.tsx
│   │       ├── SectionNumber.tsx   # Numéro de section (01, 02...)
│   │       ├── Skeleton.tsx        # Skeletons de chargement public
│   │       └── SocialShare.tsx     # Boutons partage social
│   │
│   ├── contexts/                   # Contextes React
│   │   ├── LanguageContext.tsx     # Langue FR/EN + détection auto
│   │   └── ThemeContext.tsx        # Thème sombre/clair
│   │
│   ├── hooks/                      # Hooks personnalisés public
│   │   └── useSupabaseData.ts     # Récupération données Supabase + fallbacks
│   │
│   ├── lib/                        # Utilitaires et configuration
│   │   ├── i18n.ts                # Traductions FR/EN centralisées
│   │   ├── supabase.ts            # Client Supabase + helper isConfigured
│   │   ├── translator.ts          # API MyMemory pour auto-traduction
│   │   └── validation.ts          # Validateurs formulaires
│   │
│   ├── routes/                     # Pages / Routes de l'application
│   │   ├── Admin.tsx              # Route admin (login + layout + sous-routes)
│   │   ├── BlogArticle.tsx        # Page article de blog (/blog/:slug)
│   │   ├── BlogList.tsx           # Liste des articles (/blog)
│   │   ├── GrowTechPage.tsx       # Page GROW TECH dédiée (/growtech)
│   │   ├── NotFound.tsx           # Page 404
│   │   ├── Portfolio.tsx          # Page d'accueil principale (/)
│   │   └── ProjectsPage.tsx       # Page projets dédiée (/projects)
│   │
│   ├── utils/
│   │   └── cn.ts                  # Utilitaire classe CSS (clsx + tailwind-merge)
│   │
│   ├── App.tsx                     # Composant racine (routes + providers)
│   ├── index.css                   # Styles globaux + design system
│   └── main.tsx                    # Point d'entrée React
│
├── supabase/                       # Scripts SQL pour Supabase
│   ├── 01_create_tables.sql       # Tables principales
│   ├── 02_insert_initial_config.sql # Configuration initiale
│   ├── 03_enable_rls_and_policies.sql # RLS + policies
│   ├── 04_insert_demo_data.sql    # Données de démonstration
│   ├── 05_security_functions.sql  # Fonctions de sécurité + admin_logs
│   ├── 06_add_logo_fields.sql     # Champs logo
│   ├── 07_setup_storage.sql       # Buckets storage
│   ├── 08_create_missing_tables.sql # Tables blog_posts + vision_items
│   └── 09_add_about_skills_config.sql # Config About, Skills, Footer, Hero
│
├── index.html                      # HTML principal (SEO, meta, fonts)
├── package.json                    # Dépendances
├── vite.config.ts                  # Configuration Vite + PWA + chunks
└── tsconfig.json                   # Configuration TypeScript
```

---

## Logique d'organisation

| Dossier | Contient | Règle |
|---------|----------|-------|
| `src/admin/` | TOUT ce qui concerne l'admin | Jamais importé dans le site public |
| `src/components/` | Composants visibles publiquement | Peut importer de `lib/`, `hooks/`, `contexts/` |
| `src/routes/` | Pages = 1 composant par route | Imports de `components/` seulement |
| `src/lib/` | Config, utilitaires, traductions | Pas de composants React |
| `src/contexts/` | Providers React | Language + Theme |
| `src/hooks/` | Hooks publics | useSupabaseData seulement |
| `supabase/` | Scripts SQL | Exécutés manuellement sur le dashboard |

---

## PRÉREQUIS

- Avoir lu `01_PROJECT_OVERVIEW.md`

---

## CHECKLIST

- [ ] Vous comprenez la structure des dossiers
- [ ] Vous savez où trouver chaque type de fichier
- [ ] Vous comprenez la séparation admin / public

