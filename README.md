# BMX-Race Hub

**[🇬🇧 English](#english) · [🇫🇷 Français](#français)**

---

## English

Central hub for BMX Race statistics tools, built on public [Sqorz](https://our.sqorz.com) data.

### Tools

| Tool | Description | Link |
|------|-------------|------|
| Stats Club | Club performance analysis: rankings, win rates, active pilots | [bmx-race-club](https://ludsoc.github.io/bmx-race-club/) |
| Head to Head | Face-to-face comparison between two pilots | [bmx-race-head2head](https://ludsoc.github.io/bmx-race-head2head/) |
| Stats Catégorie | Rankings and stats by age category | [bmx-race-category](https://ludsoc.github.io/bmx-race-category/) |
| Stats Pilote | Individual pilot history: results, progression, comparisons | [bmx-race-stats](https://ludsoc.github.io/bmx-race-stats/) |
| Indice de performance | National pilots ranking by performance index | [bmx-race-rankings](https://ludsoc.github.io/bmx-race-rankings/) |

### Live

**[ludsoc.github.io/bmx-race-hub](https://ludsoc.github.io/bmx-race-hub/)**

### Tech

Single-file HTML/CSS/JS — no framework, no build step. Hosted on GitHub Pages. Each tool is a separate repository auto-detected by the hub.

`hub-search.json` (copy vendored for offline-proof universal search: all 17k pilots + clubs, ~730 Ko, lazy-loaded) is generated in bmx-race-stats (`node tools/build-hub-search.cjs`) and copied here after each weekly index rebuild.

A side "Données" panel shows data freshness (generation date of each source, read from bmx-race-stats `*.meta.json`) and 2 KPIs (total pilots, clubs) derived from `hub-search.json`. It collapses on mobile (<520 px) to save vertical space.

> Community project, not affiliated with Sqorz.

---

## Français

Hub centralisé pour les outils de statistiques BMX Race, alimentés par les données publiques [Sqorz](https://our.sqorz.com).

### Outils

| Outil | Description | Lien |
|-------|-------------|------|
| Stats Club | Analyse des performances d'un club : classements, taux de victoire, pilotes actifs | [bmx-race-club](https://ludsoc.github.io/bmx-race-club/) |
| Head to Head | Comparaison face à face entre deux pilotes | [bmx-race-head2head](https://ludsoc.github.io/bmx-race-head2head/) |
| Stats Catégorie | Classements et statistiques par catégorie d'âge | [bmx-race-category](https://ludsoc.github.io/bmx-race-category/) |
| Stats Pilote | Historique individuel d'un pilote : résultats, progression, comparaisons | [bmx-race-stats](https://ludsoc.github.io/bmx-race-stats/) |
| Indice de performance | Classement national des pilotes par indice de performance | [bmx-race-rankings](https://ludsoc.github.io/bmx-race-rankings/) |

### Accès

**[ludsoc.github.io/bmx-race-hub](https://ludsoc.github.io/bmx-race-hub/)**

### Technique

HTML/CSS/JS en fichier unique — pas de framework, pas d'étape de build. Hébergé sur GitHub Pages. Chaque outil est un repo séparé détecté automatiquement par le hub.

`hub-search.json` (copie versionnée pour la recherche universelle : les 17k pilotes + clubs, ~730 Ko, chargé en différé) est généré dans bmx-race-stats (`node tools/build-hub-search.cjs`) puis copié ici après chaque rebuild hebdo de l'index.

Un panneau latéral « Données » affiche la fraîcheur des données (date de génération de chaque source, lue dans les `*.meta.json` de bmx-race-stats) et 2 KPI (pilotes total, clubs) issus de `hub-search.json`. Il se replie sur mobile (<520 px) pour libérer la hauteur.

> Projet communautaire non officiel, non affilié à Sqorz.

## Licence

Ce projet est sous licence **GNU Affero General Public License v3 (AGPLv3)** — voir `LICENSE`.

Concrètement : vous pouvez utiliser, modifier et repartager ce code (y compris hébergé
sur le web), **à condition de repartager vos modifications sous la même licence**.
© 2026 ludovic.socie — versions antérieures au 14/09/2026 diffusées sous licence MIT.
