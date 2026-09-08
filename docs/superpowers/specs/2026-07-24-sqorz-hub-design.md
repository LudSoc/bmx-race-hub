# Sqorz Hub — Design Spec

**Date :** 2026-07-24  
**Statut :** Approuvé

---

## Résumé

Page d'accueil centrale (GitHub Pages) qui liste automatiquement tous les outils Sqorz publiés comme GitHub Pages sous le compte `ludsoc`. Le hub partage exactement le même design system que les projets existants (`sqorz-category`, `sqorz-stats`).

---

## Architecture

- **Type :** Single `index.html` autonome — CSS et JS entièrement embarqués, aucune dépendance externe, aucun build tool.
- **Hébergement :** GitHub Pages (repo `sqorz-hub` → `https://ludsoc.github.io/sqorz-hub/`).
- **Données :** Deux appels API au chargement de la page, côté client uniquement.

---

## Design system

Identique aux projets existants — toutes les variables CSS sont copiées à l'identique :

- **Police :** `"Inter"`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
- **Thème clair/sombre :** Détection `prefers-color-scheme` + toggle manuel, persisté en `localStorage`
- **Variables clés :**
  - `--bg: #f1f4f8` / dark `#1f262e`
  - `--card: #ffffff` / dark `#2a3340`
  - `--accent: #6a8caf` (bleu acier)
  - `--radius: 16px`
  - `--shadow: 0 1px 2px rgba(60,90,120,.10), 0 10px 28px rgba(60,90,120,.14)`
- **Topbar :** `linear-gradient(135deg, #2e4158 0%, #3f566f 35%, #6a8caf 70%, #8aa6c2 100%)` avec overlay radial, hauteur `padding: 48px 24px 120px`
- **Logo hub :** Icône SVG "4 blocs" (grille 2×2), rendu dans le même composant `.logo` que les autres projets

---

## Détection automatique des projets

### Étape 1 — Lister les repos avec GitHub Pages

```
GET https://api.github.com/users/ludsoc/repos?per_page=100&sort=updated
```

Filtre : `repo.has_pages === true`  
Exclusion : le repo du hub lui-même (filtré par nom, ex. `sqorz-hub`)

### Étape 2 — Extraire l'icône SVG de chaque projet

```
GET https://raw.githubusercontent.com/ludsoc/{repo.name}/main/index.html
```

Extraction : contenu de `<span class="logo"...>` via `DOMParser` ou regex.  
**Fallback :** Si le fetch échoue ou si aucun `<span class="logo">` n'est trouvé → affiche les initiales du nom du repo (ex. `SC` pour `sqorz-category`).

Les deux appels (liste repos + fetch SVG par repo) sont parallélisés.

---

## Mise en page

### Topbar
- Logo hub + titre "Sqorz Hub" + bouton thème
- Sous-titre : "Tous mes outils Sqorz — statistiques, historiques pilotes, analyses par catégorie."
- Le `main` remonte sur le topbar avec `margin-top: -72px; z-index: 2` (même pattern que les projets existants)

### Barre de statut
- Petite pastille verte + texte : `{n} outil(s) disponible(s) · mis à jour il y a quelques secondes`
- Mention `via GitHub API` alignée à droite

### Liste de projets (`.project-list`)
- `display: flex; flex-direction: column; gap: 12px`
- Chaque carte : `.project-card` en `display: flex; align-items: center; gap: 18px`

### Carte projet
| Zone | Contenu |
|------|---------|
| Icône (48×48px, border-radius 12px) | SVG extrait du projet, fond dégradé bleu acier. Fallback : initiales |
| Titre | `repo.name` (font-weight 700, 16px) |
| Description | `repo.description` (13px, couleur `--ink-2`) |
| Date | `repo.updated_at` formatée en français (11px, couleur `--muted`) |
| Bouton | "Ouvrir →" lien vers `https://ludsoc.github.io/{repo.name}/` |

### État de chargement
- Skeleton shimmer sur les cartes pendant le chargement (même animation `@keyframes spin`/shimmer que les projets existants)
- Message d'erreur si l'API est inaccessible (ex. rate limit)

### Pied de page
- `Source : github.com/ludsoc · GitHub Pages détectées automatiquement`

---

## Comportement

- **Tri :** Par date de dernière mise à jour décroissante (`repo.updated_at`)
- **Couleur de fond des icônes :** L'index du repo dans la liste triée (0, 1, 2…) sélectionne un dégradé dans un tableau fixe de 4 variantes bleu acier (ex. `#2e4158→#6a8caf`, `#3f566f→#8aa6c2`, `#2e4158→#88ccd0`, `#506f8f→#9bb5cf`), en boucle modulo 4. Résultat déterministe et visuellement cohérent.
- **Repo sans description GitHub :** Affiche un texte placeholder `Aucune description disponible`
- **Rate limit GitHub API :** Affiche un message d'erreur explicite avec lien vers `github.com/ludsoc`

---

## Fichiers produits

```
sqorz-hub/
└── index.html   ← fichier unique, tout embarqué
```

Pas de `package.json`, pas de build, pas de `.github/workflows`. Le déploiement GitHub Pages pointe directement sur `index.html` à la racine de la branche `main`.

> **Note opérationnelle :** La création du repo GitHub, les commits et les pushs sont gérés manuellement par l'utilisateur. Le travail de développement se fait localement ; aucune action git n'est effectuée automatiquement.
