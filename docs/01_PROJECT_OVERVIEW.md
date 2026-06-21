# 01 — Project Overview

## OBJECTIF

Comprendre ce qu'est le projet, pour qui il est construit, et ce qu'il fait concrètement.

---

## Présentation générale

**Stane-Junior Aniambossou — Portfolio** est un site web portfolio professionnel, bilingue (FR/EN), conçu pour présenter le parcours, les compétences, les projets et la vision de Stane-Junior Aniambossou, étudiant développeur à l'IFRI-UAC (Bénin) et fondateur de l'agence digitale GROW TECH.

### Ce que le site fait

| Fonctionnalité | Description |
|---------------|-------------|
| **Portfolio public** | Présentation personnelle, projets, compétences, témoignages, contact |
| **Page GROW TECH** | Présentation de l'agence, équipe, services, vision |
| **Blog** | Articles bilingues avec slugs URL |
| **Admin dashboard** | Gestion complète du contenu sans toucher au code |
| **Bilingue** | FR/EN avec détection automatique de la langue du navigateur |
| **PWA** | Installable sur mobile comme une application native |
| **SEO** | Meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt |

### Pour qui

- **Visiteur** : Consulte le portfolio, les projets, envoie un message
- **Stane-Junior** : Gère tout le contenu via le dashboard admin
- **Développeur** : Reprend, maintient, fait évoluer le projet

---

## Stack technique

| Catégorie | Technologie | Version |
|-----------|------------|---------|
| Framework | React | 19.2.3 |
| Build tool | Vite | 7.3.2 |
| CSS | TailwindCSS v4 | 4.1.17 |
| Animations | Framer Motion | 12.38.0 |
| Routing | React Router DOM | 7.14.2 |
| Backend/BDD | Supabase | 2.105.3 |
| Langage | TypeScript | 5.9.3 |
| PWA | vite-plugin-pwa (Workbox) | 1.3.0 |
| Formulaires | React Hook Form + Yup | 7.75.0 / 1.7.1 |
| 3D | Three.js + React Three Fiber | 0.184.0 / 9.6.1 |
| Graphiques | Recharts | 3.8.1 |
| Déploiement | Netlify | — |

---

## URLs

| Environnement | URL |
|--------------|-----|
| Production | https://staneaniambossou.netlify.app |
| Repo GitHub | https://github.com/Stane316/Portfolio-Stane-Junior |
| Supabase Dashboard | https://supabase.com/dashboard |

---

## Design System

### Couleurs

| Token | Valeur | Usage |
|-------|--------|-------|
| `--bg-primary` | `#0A0A1E` | Fond principal (bleu nuit profond) |
| `--bg-secondary` | `#0F0F2E` | Fond secondaire |
| `--bg-card` | `#141430` | Fond des cartes |
| `--accent-cyan` | `#00BFFF` | Accent principal (cyan vif) |
| `--accent-blue` | `#1A6FC4` | Accent secondaire (bleu) |
| `--text-primary` | `#FFFFFF` | Texte principal |
| `--text-secondary` | `#A8B4C8` | Texte secondaire |
| `--text-muted` | `#4A5568` | Texte discret |

### Typographie

| Police | Rôle | Poids |
|--------|------|-------|
| Bebas Neue | Headings massifs (H1, numéros de section) | 400 |
| Syne | Display (titres de section, labels) | 700, 800 |
| DM Sans | Corps de texte (par défaut) | 400–700 |
| DM Mono | Code, slugs, métadonnées | 400–600 |

### Breakpoints responsive

| Breakpoint | Largeur | Appareil |
|-----------|---------|----------|
| Mobile | 320px – 414px | Téléphones |
| Tablette | 768px – 1024px | Tablettes |
| Desktop | 1280px – 2560px | Ordinateurs |

---

## PRÉREQUIS

- Node.js 18+ installé
- Un éditeur de code (VS Code recommandé)
- Git installé
- Un compte Supabase (gratuit)
- Un compte Netlify (gratuit, pour le déploiement)

---

## CHECKLIST

- [ ] Vous comprenez l'objectif du projet
- [ ] Vous connaissez la stack technique
- [ ] Vous avez les prérequis installés
