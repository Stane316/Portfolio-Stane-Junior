# 09 — Deployment (Netlify)

## OBJECTIF

Déployer le site en production sur Netlify, configurer le domaine, les variables d'environnement et le build.

---

## PRÉREQUIS

- Le repo est sur GitHub : https://github.com/Stane316/Portfolio-Stane-Junior
- Un compte Netlify (gratuit sur https://netlify.com)
- Les variables Supabase sont connues
- Le build passe en local (`npm run build` sans erreur)

---

## ÉTAPES DÉTAILLÉES

### 1. Connecter le repo à Netlify

1. Aller sur https://app.netlify.com
2. Cliquer **Add new site** → **Import an existing project**
3. Choisir **GitHub** comme déploiement
4. Autoriser Netlify à accéder au repo `Portfolio-Stane-Junior`
5. Sélectionner le repo

### 2. Configurer le build

| Paramètre | Valeur |
|-----------|--------|
| **Branch to deploy** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

Cliquer **Deploy site**.

### 3. Configurer les variables d'environnement

1. Aller dans **Site configuration** → **Environment variables**
2. Ajouter :

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://votre-projet.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `votre-anon-key` |

3. **Déclencher un nouveau deploy** : Deploys → Trigger deploy → Deploy site

### 4. Configurer le domaine personnalisé (optionnel)

1. Aller dans **Domain management** → **Add custom domain**
2. Entrer le domaine (ex: `stanejunior.com`)
3. Configurer les DNS chez le registrar :
   - **CNAME** : `www` → votre-site.netlify.app
   - **A record** : `@` → 75.2.60.5 (Netlify load balancer)
4. Activer **HTTPS** automatique (Let's Encrypt)

### 5. Configurer les redirects pour SPA

Le fichier `netlify.toml` ou `_redirects` dans `public/` doit contenir :

```
/*    /index.html   200
```

Cela garantit que React Router fonctionne correctement : toutes les routes reviennent vers `index.html` pour que le JavaScript gère le routing.

### 6. Headers de sécurité

Dans `netlify.toml` :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Déploiement automatique

Chaque `git push origin main` déclenche automatiquement un nouveau déploiement sur Netlify.

### Processus :

```
git push origin main
    │
    ▼
Netlify détecte le push
    │
    ▼
npm run build
    │
    ▼
Si succès → Site mis à jour (1-2 minutes)
Si échec → Notification d'erreur + log disponible
```

---

## ERREURS POSSIBLES

### Erreur : Build échoue sur Netlify mais pas en local

**Cause** : Variables d'environnement non configurées sur Netlify.
**Solution** : Ajouter les variables dans Site configuration → Environment variables.

### Erreur : Page 404 sur les routes internes (/blog, /admin)

**Cause** : Le fichier `_redirects` est manquant.
**Solution** : Créer `public/_redirects` avec `/* /index.html 200`.

### Erreur : Assets manquants (images, fonts)

**Cause** : Le publish directory est incorrect.
**Solution** : Vérifier qu'il est bien sur `dist`.

---

## COMMENT VÉRIFIER

1. Ouvrir l'URL Netlify du site
2. Toutes les sections s'affichent
3. La navigation fonctionne (toutes les routes)
4. L'admin est accessible (/admin/login)
5. Le build Netlify est en vert (succès)

---

## CHECKLIST

- [ ] Site connecté à Netlify
- [ ] Variables d'environnement configurées
- [ ] Build réussit sur Netlify
- [ ] Redirects SPA fonctionnent
- [ ] HTTPS activé
- [ ] Domaine personnalisé configuré (optionnel)
