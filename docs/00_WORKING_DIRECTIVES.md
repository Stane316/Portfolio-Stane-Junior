# 00 — DIRECTIVES DE TRAVAIL (RÈGLES NON-NÉGOCIABLES)

## Règle absolue n°1 : Vérifier GitHub AVANT chaque implémentation

**AVANT** de commencer toute implémentation :
1. Vérifier si la dernière implémentation est sur GitHub
2. Si OUI → continuer
3. Si NON → arrêter, pousser d'abord, puis continuer

**Jamais** accumuler des modifications non poussées.

## Règle absolue n°2 : Workflow obligatoire par implémentation

Chaque implémentation DOIT suivre cet ordre :

### Étape 1 : Vérification GitHub
- `git fetch origin`
- Comparer `HEAD` avec `origin/main`
- Si désynchronisé → résoudre AVANT de continuer

### Étape 2 : Liste des fichiers modifiés/créés
Pour CHAQUE fichier, donner :
- Chemin complet du fichier
- Type : CRÉÉ ou MODIFIÉ
- Problème résolu
- Ce qui a été modifié/ajouté concrètement
- Ce que la modification change sur le site

### Étape 3 : Explication détaillée par fichier
Pour CHAQUE fichier :
- Quel était le problème ?
- Qu'est-ce qui a été modifié ?
- Qu'est-ce qui n'était pas là avant ?
- Qu'est-ce qui a été ajouté ?
- Que change concrètement cette modification ?

### Étape 4 : Commandes Git pour le push
Fournir les commandes complètes :
```bash
git add [fichiers]
git commit -m "message descriptif"
git push origin main
```

### Étape 5 : Checklist de vérification fonctionnelle
Liste des choses à vérifier sur le site après déploiement :
- [ ] L'animation X est-elle plus fluide ?
- [ ] La section Y a-t-elle un skeleton loading ?
- [ ] Le bouton Z affiche-t-il une icône SVG au lieu d'un emoji ?
- etc.

Chaque point doit être VÉRIFIABLE et OBSERVABLE sur le site.

## Règle absolue n°3 : Fichiers complets uniquement

- TOUJOURS fournir le FICHIER COMPLET
- JAMAIS de snippets, extraits, ou patches
- L'utilisateur copie-colle directement dans son éditeur local

## Règle absolue n°4 : Ne pas oublier ces directives

Ces directives sont le mot d'ordre de TOUT le projet. Elles s'appliquent à chaque implémentation, sans exception.
