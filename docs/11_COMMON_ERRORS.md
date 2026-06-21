# 11 — Common Errors & Troubleshooting

## OBJECTIF

Résoudre rapidement les erreurs les plus fréquentes rencontrées lors du développement, du déploiement et de l'utilisation du site.

---

## PRÉREQUIS

- Avoir lu les documents 01 à 06

---

## Erreurs de Build

### `npm run build` échoue avec erreur TypeScript

**Symptôme** : Message d'erreur dans le terminal avec nom de fichier + ligne.

**Cause** : Un type TypeScript est incorrect ou un import manque.

**Solution** :
1. Lire le message d'erreur → il indique le fichier et la ligne
2. Corriger le type ou l'import
3. Relancer le build

### `Could not resolve "..." from "..."`

**Symptôme** : Rollup ne trouve pas un module.

**Cause** : L'import pointe vers un chemin inexistant.

**Solution** :
1. Vérifier que le fichier importé existe
2. Vérifier la casse (sensible sur Linux, pas sur Windows)
3. Vérifier l'extension (.tsx, .ts)

---

## Erreurs Supabase

### "Supabase non configuré"

**Symptôme** : Message dans l'admin, pas de données sur le site.

**Cause** : Variables d'environnement absentes ou incorrectes.

**Solution** :
1. Vérifier que `.env` existe avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
2. Redémarrer le serveur de dev après modification

### "relation « xxx » does not exist"

**Symptôme** : Erreur dans la console ou dans l'admin.

**Cause** : Un script SQL n'a pas été exécuté.

**Solution** : Exécuter les scripts dans l'ordre (voir `05_SUPABASE_SETUP.md`)

### PGRST116 — "JSON object requested, multiple (or no) rows returned"

**Symptôme** : Erreur dans BlogArticle ou autre page.

**Cause** : La requête `.single()` a trouvé 0 ou plusieurs résultats.

**Solution** : C'est géré par le code (P-12). Si la page 404 apparaît pour un article existant, vérifier que `is_published = true`.

### "new row violates row-level security policy"

**Symptôme** : L'écriture en base échoue silencieusement.

**Cause** : L'utilisateur n'est pas authentifié, ou les policies RLS sont trop restrictives.

**Solution** :
1. Se connecter à l'admin d'abord
2. Vérifier les policies dans le dashboard Supabase → Authentication → Policies

### Upload d'image échoue

**Symptôme** : L'image ne s'upload pas, erreur dans la console.

**Cause** : Le bucket storage n'existe pas ou les policies sont absentes.

**Solution** :
1. Vérifier que le bucket `portfolio-assets` existe dans Storage
2. Vérifier que le bucket est marqué **Public**
3. Vérifier les policies du bucket (script 07)

---

## Erreurs Runtime (navigateur)

### Page blanche

**Symptôme** : L'écran est blanc, pas de contenu.

**Cause** : Erreur JavaScript non catchée.

**Solution** :
1. Ouvrir la console du navigateur (F12 → Console)
2. Lire l'erreur
3. Si "undefined is not an object" → vérifier les données Supabase

### Animation d'intro ne se termine pas

**Symptôme** : L'intro reste bloquée.

**Cause** : L'intro écoute l'événement `onFinish`. Si le composant IntroAnimation a une erreur, onFinish n'est jamais appelé.

**Solution** :
1. Rafraîchir la page (l'intro est skippée si déjà vue dans la session)
2. Vérifier la console pour des erreurs dans IntroAnimation

### Routes internes donnent 404 après refresh

**Symptôme** : /blog fonctionne en cliquant un lien, mais 404 après F5.

**Cause** : Le serveur ne redirige pas vers `index.html` pour les routes SPA.

**Solution** :
1. Vérifier que `public/_redirects` contient `/* /index.html 200`
2. Vérifier la configuration Netlify (voir `09_DEPLOYMENT_NETLIFY.md`)

### Le formulaire de contact ne s'envoie pas

**Symptôme** : Le bouton "Envoyer" tourne indéfiniment ou affiche une erreur.

**Cause** : Supabase non configuré OU policy RLS bloque INSERT sur `messages`.

**Solution** :
1. Vérifier les variables d'environnement
2. Vérifier que la policy "Public can insert messages" existe sur la table `messages`

---

## Erreurs Mobile

### Texte trop petit sur iOS

**Cause** : iOS Safari auto-zoom sur les inputs avec font-size < 16px.

**Solution** : Les inputs du projet utilisent déjà `text-sm` (14px). Si le zoom est gênant, passer à `text-base` (16px) pour les inputs mobile.

### Scroll saccadé sur mobile

**Cause** : Animations Framer Motion lourdes + backdrop-filter.

**Solution** : Le code inclut déjà `@media (prefers-reduced-motion: reduce)` pour désactiver les animations.

---

## CHECKLIST

- [ ] Vous savez diagnostiquer une erreur de build
- [ ] Vous savez résoudre les erreurs Supabase courantes
- [ ] Vous savez résoudre les erreurs de déploiement
- [ ] Vous savez vérifier la console navigateur
