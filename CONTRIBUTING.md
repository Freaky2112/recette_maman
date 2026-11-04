# Contribuer à La Cuisine de Maman

Merci de Contribuer au Recette de Maman
et de garder en vie les Recettes de notre jeunesse

Voici comment participer et le format à respecter.

## Façons de contribuer

- **Ajouter une recette** : une nouvelle recette de famille.
- **Corriger une recette** : faute de frappe, quantité, temps de cuisson.
- **Signaler un problème** : recette qui s'affiche mal, lien brisé, bug du site.
- **Proposer une catégorie ou un tag** : nouvelle section ou sous-catégorie.

## Comment proposer ta contribution

**Sans coder (le plus simple)**
1. Va dans le dossier `_posts/` du dépôt sur GitHub.
2. Clique sur **Add file → Create new file**.
3. Nomme le fichier (voir format ci-dessous), colle le modèle et remplis-le.
4. Clique sur **Commit changes**. Le site se met à jour en 1 à 2 minutes.

**Avec une Pull Request**
1. Fais un *fork* du dépôt.
2. Ajoute ou modifie tes fichiers.
3. Ouvre une Pull Request avec une courte description.

**Un problème ou une idée ?** Ouvre une *Issue* dans l'onglet Issues.

## Nom du fichier

```
_posts/YYYY-MM-DD-nom-de-la-recette.md
```

- Date obligatoire, **différente pour chaque recette** si possible.
- Minuscules, tirets à la place des espaces, sans accents : `2025-02-05-bavettes-porto.md`
- Tu peux ranger les fichiers dans des sous-dossiers (`_posts/desserts/`). Ça n'affecte pas le site.

## Modèle de recette

```yaml
---
layout: recipe
title: "Nom de la recette"
description: "Courte description de la recette."
category: "Desserts"
emoji: "🍰"
date: 2025-01-01
prep_time: "20 min"
cook_time: "40 min"
servings: "6-8"
difficulty: Facile
tags: [Gateau, Chocolat]
image: /assets/images/ma-recette.jpg
ingredients:
  - 250 g de farine
  - 3 œufs
  - "— GLAÇAGE —"
  - 100 g de sucre glace
steps:
  - "Préchauffer le four à 180 °C."
  - "Mélanger la farine et les œufs, puis verser dans un moule."
  - "Cuire 40 minutes."
notes: "Le petit conseil de Maman, sur une seule ligne."
---
```

## Champs

| Champ | Obligatoire | Détails |
|---|---|---|
| `layout` | Oui | Toujours `recipe` |
| `title` | Oui | Entre guillemets |
| `description` | Non | Une phrase |
| `category` | Oui | Doit correspondre **exactement** à une catégorie de `_config.yml` |
| `emoji` | Non | Affiché si pas de photo |
| `date` | Oui | `AAAA-MM-JJ`, même date que le nom du fichier |
| `prep_time` / `cook_time` | Non | Texte entre guillemets |
| `servings` | Non | Entre guillemets si c'est une plage (`"4-6"`) |
| `difficulty` | Non | `Facile`, `Moyen` ou `Difficile` |
| `tags` | Non | Sous-catégories : `[Asiatique, Épicé]` |
| `image` | Non | Photo placée dans `assets/images/` |
| `ingredients` | Oui | Liste (voir règles) |
| `steps` | Oui | Liste d'étapes numérotées automatiquement |
| `notes` | Non | Une seule ligne, entre guillemets |

**Catégories actuelles** : Petit-déjeuner, Soupes & Mijotés, Plats principaux, Accompagnements, Desserts, Pâtisserie, Boissons.

## Règles YAML (pour éviter les recettes vides)

Une seule erreur dans l'en-tête et la recette s'affiche vide. À vérifier :

1. **Le fichier commence et se termine par `---`**, seuls sur leur ligne.
2. **2 espaces exactement** avant chaque `-` dans les listes (jamais 3, jamais de tabulation).
3. **Les étapes (`steps`) toujours entre guillemets** `" "`, surtout si elles contiennent `:` ou des parenthèses.
4. **Pas de `:` dans une étape ou un ingrédient** sans guillemets. Utilise ` — ` pour titrer une étape : `"Le sirop — Mélanger..."`.
5. **Sections d'ingrédients** : utilise `"— TITRE —"` entre guillemets, jamais `( Titre )` ni un deuxième `ingredients:`.
6. **Pas de `**gras**`** dans les listes.
7. **`notes:` sur une seule ligne**, entre guillemets.
8. **Pas de champ vide** (`servings:` sans valeur). Mets une valeur ou retire la ligne.
9. **Un fichier = une recette.** Ne colle jamais deux recettes dans le même fichier.

## Photos

1. Ajoute l'image dans `assets/images/` (JPG ou PNG, idéalement moins de 500 Ko).
2. Nom simple, sans espaces ni accents : `tarte-pommes.jpg`.
3. Référence-la avec `image: /assets/images/tarte-pommes.jpg`.

## Avant d'envoyer : checklist

- [ ] Le nom du fichier suit `YYYY-MM-DD-nom.md`
- [ ] L'en-tête commence et finit par `---`
- [ ] `category` correspond exactement à `_config.yml`
- [ ] Les étapes sont entre guillemets, indentées de 2 espaces
- [ ] Aucun champ vide
- [ ] Après le commit, la recette s'affiche bien sur le site (onglet **Actions** vert ✅)

## En cas de problème

Si une recette est vide après publication, ouvre l'onglet **Actions** du dépôt. Un ❌ rouge affiche le message d'erreur et la ligne fautive. Colle-le dans une Issue si tu as besoin d'aide.
