# 03 — Local Installation

## OBJECTIF

Installer et lancer le projet en local sur votre machine, de zéro jusqu'au navigateur.

---

## PRÉREQUIS

- Node.js 18+ (vérifier avec `node --version`)
- Git installé (vérifier avec `git --version`)
- Un terminal (bash, zsh, PowerShell)
- Un éditeur de code (VS Code recommandé)

---

## ÉTAPES DÉTAILLÉES

### 1. Cloner le repository

```bash
git clone https://github.com/Stane316/Portfolio-Stane-Junior.git
cd Portfolio-Stane-Junior
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installe TOUTES les dépendances listées dans `package.json` :
- React, React DOM, React Router DOM
- Framer Motion
- Supabase JS Client
- TailwindCSS v4 + plugin Vite
- Vite + plugins
- TypeScript
- Toutes les autres librairies

**Durée** : 30 secondes à 2 minutes selon votre connexion.

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Si le fichier `.env.example` n'existe pas, créer `.env` manuellement avec :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
```

**Sans ces variables** : Le site fonctionne quand même en mode "fallback" avec des données par défaut. L'admin ne pourra pas se connecter.

**Pour trouver ces valeurs** : Voir `04_ENVIRONMENT_VARIABLES.md`

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site est accessible sur : **http://localhost:5173**

### 5. Lancer un build de production

```bash
npm run build
```

Vérifie que tout compile correctement. Le résultat est dans le dossier `dist/`.

### 6. Prévisualiser le build

```bash
npm run preview
```

Lance un serveur local qui sert le build de production.

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement avec hot-reload |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build de production |

---

## ERREURS POSSIBLES

### Erreur : `npm install` échoue

**Cause** : Version de Node.js trop ancienne.
**Solution** : Mettre à jour Node.js à la version 18+.

### Erreur : Page blanche en local

**Cause** : Variables Supabase non configurées OU erreur dans le code.
**Solution** : Ouvrir la console du navigateur (F12) pour voir l'erreur. Sans Supabase, le site affiche les données fallback.

### Erreur : `vite build` échoue

**Cause** : Erreur TypeScript ou import manquant.
**Solution** : Lire le message d'erreur dans le terminal. Il indique le fichier et la ligne exacte.

---

## COMMENT VÉRIFIER

- [ ] `npm run dev` lance le serveur sans erreur
- [ ] Le site s'affiche sur http://localhost:5173
- [ ] L'animation d'intro se lance
- [ ] La navigation fonctionne (scroll vers les sections)
- [ ] Le switch de langue FR/EN fonctionne
- [ ] `npm run build` compile sans erreur

---

## CHECKLIST

- [ ] Projet cloné
- [ ] Dépendances installées
- [ ] Variables d'environnement configurées (optionnel pour le dev)
- [ ] Serveur de développement fonctionne
- [ ] Build de production passe
