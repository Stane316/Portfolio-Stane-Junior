# 08 — Public Site Architecture

## OBJECTIF

Comprendre comment le site public fonctionne, comment les données transitent de Supabase vers les composants, et comment chaque section est structurée.

---

## PRÉREQUIS

- Avoir lu `01_PROJECT_OVERVIEW.md` et `02_PROJECT_STRUCTURE.md`

---

## Routes publiques

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `Portfolio` | Page d'accueil (toutes les sections) |
| `/projects` | `ProjectsPage` | Page projets dédiée |
| `/blog` | `BlogList` | Liste des articles |
| `/blog/:slug` | `BlogArticle` | Article individuel (404 si introuvable) |
| `/growtech` | `GrowTechPage` | Page GROW TECH dédiée |
| `*` | `NotFound` | Page 404 |

---

## Flux de données

```
Supabase (database)
    │
    ▼
useSupabaseData (hook)
    │
    ├── projects[] ──────► Projects / ProjectsDetails / ProjectsStrip
    ├── testimonials[] ──► Testimonials
    └── siteConfig{} ────► Hero / About / Contact / Footer / Skills
                                    │
                                    ▼
                            Sections publiques
```

### Hook `useSupabaseData`

C'est le hook central du site public. Il :

1. **Fetch en parallèle** les projets, témoignages et config depuis Supabase
2. **Filtre** les projets/témoignages visibles uniquement (`is_visible = true`)
3. **Transforme** la config en map clé-valeur : `siteConfig['hero_badge'].value_fr`
4. **Fallback** : Si Supabase n'est pas configuré, retourne des données par défaut intégrées

### Sections qui fetch directement

| Section | Données | Méthode |
|---------|---------|---------|
| Vision | `vision_items` | `useAdminData` hook |
| Blog | `blog_posts` | `supabase.from('blog_posts')` direct |
| Contact | Envoi message | `supabase.from('messages').insert()` |

---

## Sections de la page d'accueil

### Hero (`Hero.tsx`)
- Badge d'accroche dynamique (site_config `hero_badge`)
- Titres massifs (Bebas Neue)
- Tagline (site_config `hero_tagline`)
- 3 stats dynamiques (site_config `hero_stat_N` + `hero_stat_N_label`)
- Boutons CTA : Voir projets + Contact
- Arrière-plan 3D (Three.js HeroScene)

### About (`About.tsx`)
- 4 paragraphes dynamiques (site_config `about_text_p1` à `p4`)
- Badges info : Localisation, Éducation, Rôle, Cible, Disponibilité
- Photo profil dynamique (site_config `hero_photo_url`)
- Bouton télécharger CV

### Skills (`Skills.tsx`)
- 3 catégories dynamiques (site_config `skills_mastered/learning/basics`)
- Barres de progression animées
- Note d'honnêteté (site_config `skills_honesty`)

### Projects (`Projects.tsx`)
- Liste des projets Supabase (visibles uniquement)
- Badges statut avec icônes SVG
- Tags tech (stack)
- Bouton "Étude de cas" ouvrant un modal détaillé
- Bouton "Voir le projet" (lien externe)
- Skeleton de chargement pendant le fetch

### Vision (`Vision.tsx`)
- Grille de concepts depuis `vision_items`
- Badges statut (Concept / En développement / En pause)
- Icône ampoule SVG
- Skeleton de chargement

### Testimonials (`Testimonials.tsx`)
- Cartes témoignages depuis Supabase
- Photo + nom + rôle + entreprise
- Bouton vidéo (YouTube/Vimeo) avec modal
- Placeholder si aucun témoignage

### Contact (`Contact.tsx`)
- Formulaire avec React Hook Form + Yup
- 3 sujets : Freelance, GROW TECH, Autre
- Insertion directe dans `messages` via Supabase
- URLs sociales dynamiques (site_config)
- Feedback succès/erreur avec icônes SVG

---

## Système de langue

```
LanguageContext
    │
    ├── lang: 'fr' | 'en'
    ├── t(key) → translate(key, lang)
    ├── toggleLang()
    └── setLang()
            │
            ▼
i18n.ts (translations: Record<Language, Record<string, string>>)
```

- **200+ clés de traduction** centralisées dans `src/lib/i18n.ts`
- **Détection automatique** : Navigateur → FR si pays francophone, EN sinon
- **Persistance** : Choix sauvegardé dans `localStorage`
- **Attribut HTML** : `document.documentElement.lang` mis à jour dynamiquement

---

## Système de thème

```
ThemeContext
    │
    ├── theme: 'dark' | 'light'
    └── toggleTheme()
```

- Mode sombre par défaut
- Bascule via la classe `html.light` sur `<html>`
- CSS variables override en mode light (voir `index.css`)

---

## ERREURS POSSIBLES

### Erreur : Section vide sur le site public

**Cause** : Pas de données dans Supabase ou filtre `is_visible` les cache.
**Solution** : Vérifier dans l'admin que des données existent et sont visibles.

### Erreur : Les stats du Hero affichent des valeurs par défaut

**Cause** : Les clés `hero_stat_N` n'existent pas dans site_config.
**Solution** : Exécuter le script SQL 09, ou configurer dans Admin → Contenu → Hero.

---

## COMMENT VÉRIFIER

1. Ouvrir le site public
2. Chaque section doit afficher du contenu (fallback ou Supabase)
3. Le switch de langue change tous les textes
4. Le formulaire de contact envoie un message (vérifier dans l'admin)
5. Les liens sociaux pointent vers les bonnes URLs

---

## CHECKLIST

- [ ] Page d'accueil affiche toutes les sections
- [ ] Les données dynamiques se chargent depuis Supabase
- [ ] Le switch FR/EN fonctionne sur toute la page
- [ ] Le thème sombre/clair bascule correctement
- [ ] Le formulaire de contact fonctionne
