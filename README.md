# Sqorz Hub

**[🇬🇧 English](#english) · [🇫🇷 Français](#français)**

---

## English

Central hub for BMX Race statistics tools, built on public [Sqorz](https://our.sqorz.com) data.

### Tools

| Tool | Description | Link |
|------|-------------|------|
| Stats Club | Club performance analysis: rankings, win rates, active pilots | [sqorz-club](https://ludsoc.github.io/sqorz-club/) |
| Head to Head | Face-to-face comparison between two pilots | [sqorz-head2head](https://ludsoc.github.io/sqorz-head2head/) |
| Stats Catégorie | Rankings and stats by age category | [sqorz-category](https://ludsoc.github.io/sqorz-category/) |
| Stats Pilote | Individual pilot history: results, progression, comparisons | [sqorz-stats](https://ludsoc.github.io/sqorz-stats/) |

### Live

**[ludsoc.github.io/sqorz-hub](https://ludsoc.github.io/sqorz-hub/)**

### Tech

Single-file HTML/CSS/JS — no framework, no build step. Hosted on GitHub Pages. Each tool is a separate repository auto-detected by the hub.

`hub-search.json` (vendored copy for offline-proof universal search: top 1500 pilots + clubs) is generated in sqorz-stats (`node tools/build-hub-search.cjs`) and copied here after each weekly index rebuild.

> Community project, not affiliated with Sqorz.

---

## Français

Hub centralisé pour les outils de statistiques BMX Race, alimentés par les données publiques [Sqorz](https://our.sqorz.com).

### Outils

| Outil | Description | Lien |
|-------|-------------|------|
| Stats Club | Analyse des performances d'un club : classements, taux de victoire, pilotes actifs | [sqorz-club](https://ludsoc.github.io/sqorz-club/) |
| Head to Head | Comparaison face à face entre deux pilotes | [sqorz-head2head](https://ludsoc.github.io/sqorz-head2head/) |
| Stats Catégorie | Classements et statistiques par catégorie d'âge | [sqorz-category](https://ludsoc.github.io/sqorz-category/) |
| Stats Pilote | Historique individuel d'un pilote : résultats, progression, comparaisons | [sqorz-stats](https://ludsoc.github.io/sqorz-stats/) |

### Accès

**[ludsoc.github.io/sqorz-hub](https://ludsoc.github.io/sqorz-hub/)**

### Technique

HTML/CSS/JS en fichier unique — pas de framework, pas d'étape de build. Hébergé sur GitHub Pages. Chaque outil est un repo séparé détecté automatiquement par le hub.

`hub-search.json` (copie versionnée pour la recherche universelle : top 1500 pilotes + clubs) est généré dans sqorz-stats (`node tools/build-hub-search.cjs`) puis copié ici après chaque rebuild hebdo de l'index.

> Projet communautaire non officiel, non affilié à Sqorz.
