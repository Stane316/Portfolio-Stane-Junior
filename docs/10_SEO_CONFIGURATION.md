# 10 — SEO & Analytics Configuration

## OBJECTIF

Comprendre et configurer le SEO du site : meta tags, Open Graph, Twitter Cards, Google Analytics, et Google Search Console.

---

## PRÉREQUIS

- Le site est déployé en production
- Avoir accès au code source (`index.html`)
- Un compte Google (pour Analytics et Search Console)

---

## SEO déjà implémenté

### Meta tags (dans `index.html`)

| Tag | Valeur | Statut |
|-----|--------|--------|
| `<title>` | Stane-Junior Aniambossou \| Étudiant Développeur & Fondateur d'Agence GROW TECH | ✅ Configuré |
| `<meta name="description">` | Portfolio de Stane-Junior Aniambossou... | ✅ Configuré |
| `<meta name="keywords">` | développeur web, Benin, GROW TECH... | ✅ Configuré |
| `<meta name="author">` | Stane-Junior Aniambossou | ✅ Configuré |
| `<meta name="robots">` | index, follow | ✅ Configuré |
| `<meta name="theme-color">` | #0A0A1E | ✅ Configuré |
| `<link rel="canonical">` | https://staneaniambossou.netlify.app/ | ✅ Configuré |

### Open Graph (Facebook, LinkedIn)

| Tag | Valeur |
|-----|--------|
| `og:type` | website |
| `og:url` | https://staneaniambossou.netlify.app/ |
| `og:title` | Stane-Junior Aniambossou \| Étudiant Développeur & Fondateur d'Agence |
| `og:description` | Portfolio de Stane-Junior Aniambossou... |
| `og:image` | https://staneaniambossou.netlify.app/og-image.png |
| `og:locale` | fr_FR |

### Twitter Cards

| Tag | Valeur |
|-----|--------|
| `twitter:card` | summary_large_image |
| `twitter:url` | https://staneaniambossou.netlify.app/ |
| `twitter:title` | Stane-Junior Aniambossou \| Étudiant Développeur & Fondateur d'Agence |
| `twitter:description` | Portfolio de Stane-Junior Aniambossou... |
| `twitter:image` | https://staneaniambossou.netlify.app/og-image.png |

### JSON-LD (Structured Data)

Deux schémas JSON-LD sont intégrés dans `index.html` :

1. **Person** : Nom, titre, entreprise, université, compétences, réseaux sociaux
2. **WebSite** : Nom, URL, description, action de recherche

---

## Google Analytics — À configurer

### Étapes

1. Aller sur https://analytics.google.com
2. Créer un compte → Ajouter un flux de données → Web
3. Entrer l'URL : `https://staneaniambossou.netlify.app`
4. Copier l'ID de mesure (format : `G-XXXXXXXXXX`)
5. Dans `index.html`, trouver le bloc commenté `<!-- Google Analytics -->`
6. Remplacer `GA_MEASUREMENT_ID` par votre ID réel (2 occurrences)
7. Décommenter le bloc (supprimer `<!--` et `-->`)
8. Commit et push

### Code à modifier dans `index.html`

Avant (commenté) :
```html
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', ...);
</script>
-->
```

Après (activé) :
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE-VALEUR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-VOTRE-VALEUR', { page_path: window.location.pathname, send_page_view: true });
  window.addEventListener('hashchange', function() { gtag('config', 'G-VOTRE-VALEUR', { page_path: window.location.pathname }); });
</script>
```

---

## Google Search Console — À configurer

### Étapes

1. Aller sur https://search.google.com/search-console
2. Ajouter une propriété → URL prefix → `https://staneaniambossou.netlify.app`
3. Vérifier la propriété (méthode recommandée : DNS TXT record ou balise HTML)
4. Soumettre le sitemap : `https://staneaniambossou.netlify.app/sitemap.xml`

### Sitemap

Le site est une SPA (Single Page Application). Pour le SEO, un fichier `public/robots.txt` existe. Un sitemap XML peut être ajouté manuellement dans `public/sitemap.xml`.

### robots.txt

Le fichier `public/robots.txt` existe déjà avec :
```
User-agent: *
Allow: /
Sitemap: https://staneaniambossou.netlify.app/sitemap.xml
```

---

## ERREURS POSSIBLES

### Erreur : OG image ne s'affiche pas sur les réseaux sociaux

**Cause** : L'image n'est pas accessible ou trop petite.
**Solution** : Vérifier que `/og-image.png` existe dans `public/` et fait au moins 1200×630px.

### Erreur : Google Analytics ne collecte pas de données

**Cause** : Le bloc GA est encore commenté ou l'ID est incorrect.
**Solution** : Vérifier que l'ID commence par `G-` et que le bloc est décommenté.

---

## COMMENT VÉRIFIER

1. **Meta tags** : Ouvrir le code source de la page → vérifier les tags
2. **OG** : Utiliser https://developers.facebook.com/tools/debug/
3. **Twitter** : Utiliser https://cards-dev.twitter.com/validator
4. **JSON-LD** : Utiliser https://search.google.com/test/rich-results
5. **Analytics** : Vérifier les temps réel dans le dashboard GA

---

## CHECKLIST

- [ ] Meta tags configurés
- [ ] Open Graph configuré
- [ ] Twitter Cards configuré
- [ ] JSON-LD validé
- [ ] Google Analytics activé avec vrai ID
- [ ] Google Search Console configurée
- [ ] robots.txt accessible
- [ ] og-image.png existe (1200×630px min)
