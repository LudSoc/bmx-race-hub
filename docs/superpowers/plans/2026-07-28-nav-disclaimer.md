# Navigation croisée & Disclaimer — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un lien "← Sqorz Hub" en breadcrumb dans la topbar des 4 outils, et un disclaimer "non officiel" dans le footer du hub.

**Architecture:** Chaque outil HTML/JS vanilla reçoit une constante `HUB_BASE` (même pattern que `SQORZ_STATS_BASE`) et un lien HTML injecté par JS au chargement. Le hub reçoit une ligne de texte dans son footer JS existant.

**Tech Stack:** HTML/JS vanilla inline, History API (aucun framework)

---

## Task 1 : club_stats — breadcrumb ← Sqorz Hub

**Files:**
- Modify: `club_stats/index.html`

### Contexte

- La topbar a cette structure (~ligne 362) :
  ```html
  <div class="topbar-inner">
    <div class="brand-row">...</div>
    <h1>Stats d'un club</h1>
  ```
- Il faut insérer le lien entre `</div>` (fin de `.brand-row`) et `<h1>`
- Le CSS est inline dans `<style>` en haut du fichier

- [ ] **Étape 1 : Ajouter le CSS `.hub-back`**

Localiser le bloc CSS `.theme-btn:active` (~ligne 87). Insérer juste après :

```css
  .hub-back{display:inline-block;margin-top:10px;font-size:12px;color:rgba(255,255,255,.65);text-decoration:none;letter-spacing:.1px}
  .hub-back:hover{color:#fff}
```

- [ ] **Étape 2 : Ajouter la constante `HUB_BASE` et le lien**

Localiser la fermeture de `.brand-row` suivie de `<h1>Stats d'un club</h1>` (~ligne 374). Remplacer :

```html
    </div>
    <h1>Stats d'un club</h1>
```

par :

```html
    </div>
    <a class="hub-back" id="hubBackLink" href="#">← Sqorz Hub</a>
    <h1>Stats d'un club</h1>
```

- [ ] **Étape 3 : Initialiser l'URL du lien par script**

Localiser la fin du `<script>` principal (juste avant `</script>` en fin de fichier). Ajouter avant la fermeture :

```js
  (() => {
    const base = window.location.protocol === 'file:'
      ? '../sqorz_hub/index.html'
      : 'https://ludsoc.github.io/sqorz-hub/';
    document.getElementById('hubBackLink').href = base;
  })();
```

- [ ] **Étape 4 : Vérifier visuellement**

Ouvrir `club_stats/index.html` en local. Vérifier que "← Sqorz Hub" apparaît sous le logo, en petit texte blanc semi-transparent, avant le titre "Stats d'un club".

- [ ] **Étape 5 : Commit**

```bash
git -C /home/ludovic.socie/Documents/sqorz_tools/club_stats add index.html
git -C /home/ludovic.socie/Documents/sqorz_tools/club_stats commit -m "feat: add breadcrumb link back to Sqorz Hub"
```

---

## Task 2 : h2h_stats — breadcrumb ← Sqorz Hub

**Files:**
- Modify: `h2h_stats/index.html`

### Contexte

- La topbar a cette structure (~ligne 1278) :
  ```html
  <div class="topbar-inner">
    <div class="brand-row">...</div>
    <h1>Sqorz Head to Head</h1>
  ```
- Le CSS est inline dans `<style>` en haut du fichier (~lignes 114-123)

- [ ] **Étape 1 : Ajouter le CSS `.hub-back`**

Localiser `.theme-btn:active` (~ligne 123). Insérer juste après :

```css
  .hub-back{display:inline-block;margin-top:10px;font-size:12px;color:rgba(255,255,255,.65);text-decoration:none;letter-spacing:.1px}
  .hub-back:hover{color:#fff}
```

- [ ] **Étape 2 : Ajouter le lien dans la topbar**

Localiser la fermeture de `.brand-row` suivie de `<h1>Sqorz Head to Head</h1>` (~ligne 1290). Remplacer :

```html
    </div>
    <h1>Sqorz Head to Head</h1>
```

par :

```html
    </div>
    <a class="hub-back" id="hubBackLink" href="#">← Sqorz Hub</a>
    <h1>Sqorz Head to Head</h1>
```

- [ ] **Étape 3 : Initialiser l'URL du lien par script**

Les fonctions globales sont définies avant le `loadIndex()` call (~ligne 1940). Insérer juste avant `loadIndex()` (ou juste après les fonctions URL déjà définies) :

```js
(() => {
  const base = window.location.protocol === 'file:'
    ? '../sqorz_hub/index.html'
    : 'https://ludsoc.github.io/sqorz-hub/';
  document.getElementById('hubBackLink').href = base;
})();
```

- [ ] **Étape 4 : Commit**

```bash
git -C /home/ludovic.socie/Documents/sqorz_tools/h2h_stats add index.html
git -C /home/ludovic.socie/Documents/sqorz_tools/h2h_stats commit -m "feat: add breadcrumb link back to Sqorz Hub"
```

---

## Task 3 : category_stats — breadcrumb ← Sqorz Hub

**Files:**
- Modify: `category_stats/index.html`

### Contexte

- La topbar (~ligne 391) :
  ```html
  <div class="topbar-inner">
    <div class="brand-row">...</div>
    <!-- pas de <h1> visible dans l'extrait, chercher la balise suivante -->
  ```
- Le CSS est inline (~lignes 73-82)

- [ ] **Étape 1 : Ajouter le CSS `.hub-back`**

Localiser `.theme-btn:active` (~ligne 81). Insérer juste après :

```css
  .hub-back{display:inline-block;margin-top:10px;font-size:12px;color:rgba(255,255,255,.65);text-decoration:none;letter-spacing:.1px}
  .hub-back:hover{color:#fff}
```

- [ ] **Étape 2 : Ajouter le lien dans la topbar**

Localiser la fermeture de `.brand-row` dans la topbar (~ligne 403). Insérer `<a class="hub-back" id="hubBackLink" href="#">← Sqorz Hub</a>` juste après `</div>` (fin brand-row), avant la balise suivante (`<h1>` ou `<p>`) :

```html
    </div>
    <a class="hub-back" id="hubBackLink" href="#">← Sqorz Hub</a>
    <h1>Stats par catégorie</h1>
```

> Vérifie le titre réel de la `<h1>` dans le fichier avant d'écrire ce bloc.

- [ ] **Étape 3 : Initialiser l'URL du lien**

Dans le IIFE principal, juste avant `await loadIndex()` (fin du fichier, ~ligne 1341) :

```js
  (() => {
    const base = window.location.protocol === 'file:'
      ? '../sqorz_hub/index.html'
      : 'https://ludsoc.github.io/sqorz-hub/';
    document.getElementById('hubBackLink').href = base;
  })();
```

- [ ] **Étape 4 : Commit**

```bash
git -C /home/ludovic.socie/Documents/sqorz_tools/category_stats add index.html
git -C /home/ludovic.socie/Documents/sqorz_tools/category_stats commit -m "feat: add breadcrumb link back to Sqorz Hub"
```

---

## Task 4 : sqorz_stats — breadcrumb ← Sqorz Hub

**Files:**
- Modify: `sqorz_stats/index.html`

### Contexte

- La topbar (~ligne 1109) :
  ```html
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand-row">...</div>
      <h1>Qui cherchez-vous ?</h1>
  ```
- Le CSS est inline en haut du fichier

- [ ] **Étape 1 : Ajouter le CSS `.hub-back`**

Localiser `.theme-btn:active` dans le CSS. Insérer juste après :

```css
  .hub-back{display:inline-block;margin-top:10px;font-size:12px;color:rgba(255,255,255,.65);text-decoration:none;letter-spacing:.1px}
  .hub-back:hover{color:#fff}
```

- [ ] **Étape 2 : Ajouter le lien dans la topbar**

Localiser `</div>` (fin de `.brand-row`) suivi de `<h1>Qui cherchez-vous ?</h1>`. Remplacer :

```html
    </div>
    <h1>Qui cherchez-vous ?</h1>
```

par :

```html
    </div>
    <a class="hub-back" id="hubBackLink" href="#">← Sqorz Hub</a>
    <h1>Qui cherchez-vous ?</h1>
```

- [ ] **Étape 3 : Initialiser l'URL du lien**

Localiser la fonction `init()` au bas du script principal. Ajouter au début de la fonction `init()` :

```js
  (() => {
    const base = window.location.protocol === 'file:'
      ? '../sqorz_hub/index.html'
      : 'https://ludsoc.github.io/sqorz-hub/';
    document.getElementById('hubBackLink').href = base;
  })();
```

> Si `init()` est async, insérer cet IIFE juste avant l'appel `init()` plutôt qu'à l'intérieur.

- [ ] **Étape 4 : Commit**

```bash
git -C /home/ludovic.socie/Documents/sqorz_tools/sqorz_stats add index.html
git -C /home/ludovic.socie/Documents/sqorz_tools/sqorz_stats commit -m "feat: add breadcrumb link back to Sqorz Hub"
```

---

## Task 5 : sqorz_hub — disclaimer dans le footer

**Files:**
- Modify: `sqorz_hub/index.html`

### Contexte

Le hub génère son contenu dynamiquement en JS. Le footer existant est dans un template string (~ligne 302) :

```js
<div class="hub-footer">
  Source : <a href="https://github.com/${GH_USER}" ...>github.com/${GH_USER}</a>
  · GitHub Pages détectées automatiquement
</div>
```

- [ ] **Étape 1 : Ajouter le disclaimer dans le footer**

Localiser le template string du footer (la ligne `· GitHub Pages détectées automatiquement`). Ajouter une ligne après :

```js
        <div class="hub-footer">
          Source : <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a>
          · GitHub Pages détectées automatiquement
          · Projet communautaire non officiel, non affilié à Sqorz
        </div>
```

- [ ] **Étape 2 : Vérifier visuellement**

Ouvrir `sqorz_hub/index.html`. Le footer en bas de page doit afficher les trois éléments en texte grisé.

- [ ] **Étape 3 : Commit**

```bash
git -C /home/ludovic.socie/Documents/sqorz_tools/sqorz_hub add index.html
git -C /home/ludovic.socie/Documents/sqorz_tools/sqorz_hub commit -m "feat: add unofficial project disclaimer to hub footer"
```

---

## Task 6 : Push tous les repos

- [ ] **Push**

```bash
git -C /home/ludovic.socie/Documents/sqorz_tools/club_stats push origin main
git -C /home/ludovic.socie/Documents/sqorz_tools/h2h_stats push origin main
git -C /home/ludovic.socie/Documents/sqorz_tools/category_stats push origin master
git -C /home/ludovic.socie/Documents/sqorz_tools/sqorz_stats push origin main
git -C /home/ludovic.socie/Documents/sqorz_tools/sqorz_hub push origin main
```
