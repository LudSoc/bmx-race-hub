# Navigation croisée & Disclaimer — Design

Date : 2026-07-28

## Objectif

1. Ajouter un lien "← Sqorz Hub" en breadcrumb dans la topbar de chaque outil
2. Ajouter un disclaimer "Projet communautaire non officiel" dans le footer du hub

## Périmètre

| Fichier | Changement |
|---|---|
| `club_stats/index.html` | Lien hub en breadcrumb |
| `h2h_stats/index.html` | Lien hub en breadcrumb |
| `category_stats/index.html` | Lien hub en breadcrumb |
| `sqorz_stats/index.html` | Lien hub en breadcrumb |
| `sqorz_hub/index.html` | Disclaimer dans footer existant |

## Design retenu

### Breadcrumb dans les 4 outils

Placement : après `</div>` de `.brand-row`, avant `<h1>`.

HTML à insérer :
```html
<a class="hub-back" href="<HUB_URL>">← Sqorz Hub</a>
```

CSS à ajouter dans `<style>` :
```css
.hub-back{display:inline-block;margin-top:10px;font-size:12px;color:rgba(255,255,255,.65);text-decoration:none;letter-spacing:.1px}
.hub-back:hover{color:#fff}
```

URL selon contexte :
```js
const HUB_BASE = window.location.protocol === 'file:'
  ? '../sqorz_hub/index.html'
  : 'https://ludsoc.github.io/sqorz-hub/';
```

Le lien est rendu statiquement en HTML (pas dynamique) car `HUB_BASE` dépend de `window.location` — injecter via JS au chargement.

### Disclaimer dans le hub

Le hub a déjà un `.hub-footer` généré dynamiquement (template JS ligne ~302). Ajouter à la fin du template :

```
· Projet communautaire non officiel, non affilié à Sqorz
```

Pas de nouveau style nécessaire — `.hub-footer` existe déjà avec `font-size:11px;color:var(--muted)`.
