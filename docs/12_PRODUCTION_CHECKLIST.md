# 12 — Production Checklist

## OBJECTIF

Valider que le site est prêt pour la production : fonctionnalité, performance, sécurité, SEO, accessibilité.

---

## PRÉREQUIS

- Le site est déployé sur Netlify
- Supabase est configuré et les scripts SQL sont exécutés
- Toutes les sections ont été testées

---

## Checklist Fonctionnelle

### Site public

- [ ] Page d'accueil charge sans erreur
- [ ] Animation d'intro fonctionne puis disparaît
- [ ] Navigation smooth scroll vers chaque section
- [ ] Section Hero : badge, titre, tagline, stats, CTA
- [ ] Section About : photo, paragraphes, badges info
- [ ] Section Skills : 3 catégories, barres animées, note honnêteté
- [ ] Section Projects : projets visibles, badges statut, étude de cas
- [ ] Section Vision : concepts avec badges statut
- [ ] Section Testimonials : cartes avec photo/nom/contenu
- [ ] Section Contact : formulaire fonctionnel, liens sociaux
- [ ] Footer : contenu dynamique, liens
- [ ] Switch langue FR/EN fonctionne
- [ ] Switch thème sombre/clair fonctionne
- [ ] Bouton scroll-to-top apparaît après 500px

### Pages dédiées

- [ ] `/projects` — Page projets dédiée
- [ ] `/blog` — Liste des articles publiés
- [ ] `/blog/:slug` — Article individuel (404 si introuvable)
- [ ] `/growtech` — Page GROW TECH
- [ ] `/*` — Page 404 pour routes invalides

### Admin

- [ ] `/admin/login` — Connexion fonctionne
- [ ] `/admin/dashboard` — KPIs et données récentes
- [ ] `/admin/projects` — CRUD projets + études de cas
- [ ] `/admin/testimonials` — CRUD témoignages
- [ ] `/admin/messages` — Filtrer, lire, supprimer
- [ ] `/admin/content` — Édition contenu + auto-save debouncé
- [ ] `/admin/skills` — Éditeur visuel compétences
- [ ] `/admin/blog` — CRUD articles + slug auto
- [ ] `/admin/growtech` — Gestion GROW TECH
- [ ] `/admin/vision` — CRUD concepts
- [ ] Upload d'images fonctionne
- [ ] Détection modifications non sauvegardées (modal)

---

## Checklist Performance

- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse SEO > 90
- [ ] Images lazy-loadées
- [ ] Code splitting actif (chunks vendor/framer/supabase)
- [ ] Fonts préchargées (preconnect)
- [ ] CSS dedupliqué (P-07/P-08 appliqué)
- [ ] PWA installable

---

## Checklist Sécurité

- [ ] RLS activé sur toutes les tables Supabase
- [ ] Policies configurées (public read-only, admin CRUD)
- [ ] Clé `service_role` JAMAIS dans le code client
- [ ] `.env` dans `.gitignore`
- [ ] Headers de sécurité sur Netlify (X-Frame-Options, CSP)
- [ ] Admin protégé par authentification Supabase

---

## Checklist SEO

- [ ] `<title>` configuré et descriptif
- [ ] `<meta name="description">` configuré
- [ ] Open Graph tags complets
- [ ] Twitter Cards tags complets
- [ ] JSON-LD Person + WebSite
- [ ] `robots.txt` accessible
- [ ] `sitemap.xml` accessible
- [ ] URL canonique configurée
- [ ] Balise `lang="fr"` sur `<html>`
- [ ] H1-H6 hiérarchisés

---

## Checklist Accessibilité

- [ ] Skip-to-content link
- [ ] Focus visible au clavier (focus-visible)
- [ ] `aria-label` sur les boutons icônes
- [ ] `role="alert"` sur les messages d'erreur
- [ ] `prefers-reduced-motion` respecté
- [ ] `prefers-contrast: high` supporté
- [ ] Contraste couleurs suffisant
- [ ] Formulaires avec `<label>` associés

---

## Checklist Responsive

- [ ] Mobile 320-414px : Tout lisible et cliquable
- [ ] Tablette 768-1024px : Layout adapté
- [ ] Desktop 1280-2560px : Pleine largeur, pas de débordement
- [ ] Pas de scroll horizontal intempestif
- [ ] Touch targets minimum 44px (min-height sur boutons)

---

## PWA Checklist

- [ ] `manifest.webmanifest` valide
- [ ] Service Worker enregistré (Workbox)
- [ ] Icône PWA présente
- [ ] `theme_color` et `background_color` configurés
- [ ] Site installable sur mobile (prompt "Ajouter à l'écran d'accueil")

---

## CHECKLIST FINALE

- [ ] Toutes les checklists ci-dessus sont validées
- [ ] Le site fonctionne en production
- [ ] L'admin est fonctionnel
- [ ] Aucune erreur dans la console navigateur
- [ ] Google Analytics collecte des données (si configuré)
