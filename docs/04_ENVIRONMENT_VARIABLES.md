# 04 — Environment Variables

## OBJECTIF

Comprendre, configurer et sécuriser toutes les variables d'environnement du projet.

---

## PRÉREQUIS

- Avoir un compte Supabase (gratuit sur https://supabase.com)
- Avoir cloné le projet et installé les dépendances

---

## Variables requises

| Variable | Description | Où la trouver |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Dashboard Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Clé publique anon Supabase | Dashboard Supabase → Settings → API → Project API keys → anon public |

---

## Configuration

### 1. Créer le fichier `.env`

À la racine du projet, créer un fichier nommé `.env` :

```env
VITE_SUPABASE_URL=https://abcdef123456.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Où trouver les valeurs dans Supabase

1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet portfolio
3. Cliquer sur **Settings** (icône engrenage) dans la barre latérale
4. Cliquer sur **API**
5. Copier **Project URL** → c'est `VITE_SUPABASE_URL`
6. Copier **anon public** key → c'est `VITE_SUPABASE_ANON_KEY`

### 3. Sécurité

- **JAMAIS** commiter le fichier `.env` sur GitHub — il est dans `.gitignore`
- La clé `anon` est conçue pour être publique (elle est dans le code client)
- La clé `service_role` ne doit **JAMAIS** être dans le code client — elle contourne RLS
- Les politiques RLS (Row Level Security) protègent les données même avec la clé anon

---

## Mode sans Supabase (fallback)

Si les variables ne sont pas configurées :
- Le site public affiche des **données fallback** intégrées dans le code
- L'admin affiche "Supabase non configuré"
- Les formulaires de contact ne fonctionnent pas
- Les uploads d'images ne fonctionnent pas

Ce mode est utile pour :
- Développer le design sans backend
- Tester le responsive et les animations
- Faire des reviews de code

---

## ERREURS POSSIBLES

### Erreur : "Supabase non configuré" dans l'admin

**Cause** : Les variables d'environnement sont absentes ou incorrectes.
**Solution** : Vérifier que le fichier `.env` existe à la racine et contient les bonnes valeurs.

### Erreur : "Invalid API key" dans la console

**Cause** : La clé anon est incorrecte ou a été régénérée.
**Solution** : Copier à nouveau la clé depuis le dashboard Supabase.

### Erreur : Variables définies mais pas prises en compte

**Cause** : Le serveur de dev doit être redémarré après modification du `.env`.
**Solution** : Arrêter le serveur (Ctrl+C) et relancer `npm run dev`.

---

## COMMENT VÉRIFIER

1. Lancer `npm run dev`
2. Ouvrir http://localhost:5173/admin/login
3. Si le formulaire de connexion s'affiche sans erreur → Supabase est configuré
4. Si "Supabase non configuré" apparaît → vérifier les variables

---

## CHECKLIST

- [ ] Fichier `.env` créé à la racine
- [ ] `VITE_SUPABASE_URL` renseigné
- [ ] `VITE_SUPABASE_ANON_KEY` renseigné
- [ ] `.env` est dans `.gitignore`
- [ ] Serveur redémarré après modification
