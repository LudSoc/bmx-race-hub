// Tests du hub : la liste des projets s'affiche TOUJOURS (API → cache → statique).
// Le script est EXÉCUTÉ (pas recopié) avec document/localStorage/fetch stubés.
// Usage : node --test tests/hub-projects.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => m[1]).filter(s => s.includes('loadProjects')).join('\n');

function makeEnv(fetchImpl) {
  const store = {};
  const els = {};
  const el = () => ({
    innerHTML: '', textContent: '',
    setAttribute() {}, addEventListener() {},
    classList: { toggle() {} },
  });
  const sandbox = {
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; },
    },
    document: {
      getElementById: id => (els[id] || (els[id] = el())),
      documentElement: { classList: { toggle() {} }, dataset: {} },
      addEventListener() {},
    },
    location: { hostname: 'test.invalid', search: '', href: '' },
    fetch: fetchImpl,
    window: { matchMedia: () => ({ matches: false }) },
  };
  sandbox.window.window = sandbox.window;
  const run = new Function(...Object.keys(sandbox), '__els', script + '\nreturn { __main: () => __els.main.innerHTML + (__els.projects ? __els.projects.innerHTML : ""), __suivis: () => __els.suivis.innerHTML, routeSearch, hubNorm, parseDuelQuery, pilotUrl, clubUrl, clubSearchUrl, duelUrl, pagesBase, searchHubIndex, lev2 };');
  return { run: () => run(...Object.values(sandbox), els), store };
}
const tick = (ms = 50) => new Promise(r => setTimeout(r, ms));
const api403 = async url => {
  if (String(url).includes('api.github.com')) return { ok: false, status: 403 };
  return { ok: false, status: 404 }; // icônes : repli initiales
};

test('API 403 + cache vide → liste statique (5 cartes, jamais de blocage)', async () => {
  const { run } = makeEnv(api403);
  const api = run();
  await tick();
  const html = api.__main();
  for (const repo of ['sqorz-stats', 'sqorz-club', 'sqorz-head2head', 'sqorz-category', 'sqorz-rankings']) {
    assert.ok(html.includes(`https://ludsoc.github.io/${repo}/`), `carte ${repo}`);
  }
  assert.ok(html.includes('liste locale'), 'source annoncée');
  assert.ok(html.includes('Réessayer'), 'bouton réessai');
  assert.ok(!html.includes('Impossible de récupérer'), 'plus de page d’erreur bloquante');
  assert.ok(!html.includes('Mis à jour le'), 'pas de dates sans API');
});

test('API 403 + cache chaud → cache local avec dates', async () => {
  const { run, store } = makeEnv(api403);
  store.sqorzHubRepos = JSON.stringify({ at: Date.now(), repos: [
    { name: 'sqorz-stats', description: 'Stats pilote', updated_at: '2026-09-09T10:00:00Z', default_branch: 'main', has_pages: true },
  ]});
  const api = run();
  await tick();
  const html = api.__main();
  assert.ok(html.includes('via cache local'), 'source annoncée');
  assert.ok(html.includes('Mis à jour le'), 'dates du cache affichées');
});

test('API OK → frais + mise en cache', async () => {
  const repos = [{ name: 'sqorz-club', description: 'd', updated_at: '2026-09-09T10:00:00Z', default_branch: 'main', has_pages: true }];
  const { run, store } = makeEnv(async url =>
    String(url).includes('api.github.com') ? { ok: true, json: async () => repos } : { ok: false, status: 404 });
  const api = run();
  await tick();
  const html = api.__main();
  assert.ok(html.includes('via GitHub API'), 'source annoncée');
  assert.ok(html.includes('sqorz-club'), 'carte affichée');
  assert.ok(store.sqorzHubRepos && JSON.parse(store.sqorzHubRepos).repos.length === 1, 'cache écrit');
});

test('hubNorm : parité avec SqorzCommon.norm (clés h2h ?a=&b=)', () => {
  const commonSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'sqorz_stats', 'common.js'), 'utf8');
  const SC = new Function('window', commonSrc + '\nreturn window.SqorzCommon;')({});
  const { run } = makeEnv(api403);
  const api = run();
  for (const name of ['Jean Dupont', 'Léa MARTIN', 'Jean-Pierre O’Brien', '  Max   VERSTAPPEN  ']) {
    assert.equal(api.hubNorm(name), SC.norm(name), `parité pour « ${name} »`);
  }
});

test('parseDuelQuery : « X vs Y » et « X contre Y »', () => {
  const { run } = makeEnv(api403);
  const api = run();
  assert.deepEqual(api.parseDuelQuery('Dupont vs Martin'), { a: 'Dupont', b: 'Martin' });
  assert.deepEqual(api.parseDuelQuery('dupont VS martin'), { a: 'dupont', b: 'martin' });
  assert.deepEqual(api.parseDuelQuery('Léa contre Max'), { a: 'Léa', b: 'Max' });
  assert.equal(api.parseDuelQuery('Dupont'), null);
  assert.equal(api.parseDuelQuery('Dupont vs '), null);
  assert.equal(api.parseDuelQuery(''), null);
});

test('routeSearch : duel direct, favoris d’abord, replis pilote/club', () => {
  const { run, store } = makeEnv(api403);
  store['sqorz.favs.pilots'] = JSON.stringify([{ key: 'lea martin', name: 'Léa Martin' }]);
  store['sqorz.favs.clubs'] = JSON.stringify([{ key: 'besanc', name: 'BMX BESANCON (BESANC)' }]);
  const api = run();
  const duel = api.routeSearch('Léa vs Max');
  assert.equal(duel.length, 1);
  assert.ok(duel[0].url.includes('sqorz-head2head') && duel[0].url.includes('a=lea&b=max'), `url duel: ${duel[0].url}`);
  const fav = api.routeSearch('martin');
  assert.equal(fav[0].kind, 'pilot');
  assert.ok(fav[0].url.includes('sqorz-stats') && fav[0].url.includes('name=L%C3%A9a%20Martin'), `url pilote: ${fav[0].url}`);
  const club = api.routeSearch('besanc');
  assert.equal(club[0].kind, 'club');
  assert.ok(club[0].url.includes('sqorz-club') && club[0].url.includes('club=besanc'), `url club: ${club[0].url}`);
  const plain = api.routeSearch('inconnu xyz');
  assert.deepEqual(plain.map(r => r.kind), ['pilot-search', 'club-search']);
  assert.deepEqual(api.routeSearch('  '), []);
});

test('pagesBase : local en dev, prod sinon', () => {
  const { run } = makeEnv(api403);
  const api = run();
  assert.ok(api.pilotUrl('X').startsWith('https://ludsoc.github.io/sqorz-stats/'), 'prod par défaut');
});

test('suivis : favoris + récents rendus avec liens profonds, vide → rien', async () => {
  const { run, store } = makeEnv(api403);
  store['sqorz.favs.pilots'] = JSON.stringify([{ key: 'lea martin', name: 'Léa Martin' }]);
  store['sqorz.favs.clubs'] = JSON.stringify([{ key: 'besanc', name: 'BMX BESANCON (BESANC)' }]);
  store['sqorz.recent'] = JSON.stringify([{ t: 'clubs', k: 'courno', n: 'BMX COURNON (COURNO)', at: 1 }]);
  const api = run();
  await tick();
  const html = api.__suivis();
  assert.ok(html.includes('Mes suivis'), 'section présente');
  assert.ok(html.includes('sqorz-stats/?name=L%C3%A9a%20Martin'), 'lien pilote');
  assert.ok(html.includes('sqorz-club/?club=besanc'), 'lien club');
  assert.ok(html.includes('sqorz-club/?club=courno'), 'lien récent');
  assert.ok(html.includes('data-unfav-type="pilots"'), 'bouton retirer');
});

test('suivis : rien en localStorage → section absente', async () => {
  const { run } = makeEnv(api403);
  const api = run();
  await tick();
  assert.equal(api.__suivis(), '', 'pas de section vide');
});

const FIXTURE = {
  pilots: [
    { n: 'Léa Martin', c: 'BESANC', e: 90 },
    { n: 'Léo Martinot', c: 'COURNO', e: 40 },
    { n: 'Max Dupont', c: 'BEYNOS', e: 60 },
    { n: 'Anna Dupond', c: 'BEYNOS', e: 5 },
  ],
  clubs: {
    BESANC: { name: 'BMX BESANCON', city: 'BESANCON' },
    BEYNOS: { name: "AIN'PULSION COTIERE BMX", city: 'BEYNOST' },
  },
};

test('searchHubIndex : exact > mot > préfixe > substring, égalité → engagements', () => {
  const { run } = makeEnv(api403);
  const api = run();
  const res = api.searchHubIndex('martin', FIXTURE);
  assert.equal(res[0].key, 'Léa Martin', 'mot exact + 90 eng. devant');
  assert.equal(res[0].kind, 'pilot');
  const dup = api.searchHubIndex('dupont', FIXTURE);
  assert.equal(dup[0].key, 'Max Dupont', 'exact devant substring/fuzzy');
  assert.ok(dup.some(r => r.key === 'Anna Dupond'), 'faute de frappe tolérée (dupond→dupont)');
});

test('searchHubIndex : accents, casse, code club et nom de club', () => {
  const { run } = makeEnv(api403);
  const api = run();
  assert.equal(api.searchHubIndex('lea', FIXTURE)[0].key, 'Léa Martin');
  assert.equal(api.searchHubIndex('LEA MARTIN', FIXTURE)[0].key, 'Léa Martin');
  const byCode = api.searchHubIndex('beynos', FIXTURE);
  assert.equal(byCode[0].kind, 'club');
  assert.equal(byCode[0].key, 'BEYNOS');
  const byName = api.searchHubIndex('besançon', FIXTURE);
  assert.equal(byName[0].key, 'BESANC');
});

test('searchHubIndex : vide/sans index → [], plafond 8', () => {
  const { run } = makeEnv(api403);
  const api = run();
  assert.deepEqual(api.searchHubIndex('', FIXTURE), []);
  assert.deepEqual(api.searchHubIndex('martin', null), []);
  const big = { pilots: Array.from({ length: 30 }, (_, i) => ({ n: 'Test Pilot' + i, c: '', e: 1 })), clubs: {} };
  assert.ok(api.searchHubIndex('test', big).length <= 8);
});

test('hub-search.json vendu : structure + requêtes réelles', () => {
  const j = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'hub-search.json'), 'utf8'));
  assert.ok(j._meta && Array.isArray(j.pilots) && j.pilots.length >= 1000, 'top pilotes');
  assert.ok(j.clubs && j.clubs.BESANC && j.clubs.BESANC.name === 'BMX BESANCON', 'clubs canoniques');
  const { run } = makeEnv(api403);
  const api = run();
  const res = api.searchHubIndex('topenot', j);
  assert.ok(res.length > 0 && res[0].key.toLowerCase().includes('topenot'), 'Enzo Topenot trouvé');
  const club = api.searchHubIndex('cagnes', j);
  assert.ok(club.some(r => r.kind === 'club' && r.key === 'USCBMX'), 'US Cagnes trouvée');
});

test('deux passes : fuzzy ignoré si ≥5 matchs forts, sinon appliqué', () => {
  const { run } = makeEnv(api403);
  const api = run();
  const many = {
    pilots: Array.from({ length: 6 }, (_, i) => ({ n: 'Testeur Pilot' + i, c: '', e: 1 }))
      .concat([{ n: 'Zzz Quux', c: '', e: 1 }]),
    clubs: {},
  };
  const crowded = api.searchHubIndex('testeur', many);
  assert.ok(crowded.length > 0 && crowded.every(r => r.key.startsWith('Testeur')), 'pas de fuzzy quand 6 forts');
  const few = { pilots: [{ n: 'Max Dupont', c: '', e: 1 }], clubs: {} };
  assert.ok(api.searchHubIndex('dupond', few).some(r => r.key === 'Max Dupont'), 'fuzzy quand <5 forts');
});

test('full index : 17k noms, un one-timer trouvable, recherche <2s', () => {
  const j = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'hub-search.json'), 'utf8'));
  assert.ok(j.pilots.length >= 17000 && j._meta.coverage === 100, `${j.pilots.length} pilotes, 100%`);
  const { run } = makeEnv(api403);
  const api = run();
  const oneTimer = j.pilots.find(p => p.e === 1);
  assert.ok(oneTimer, 'il existe des one-timers');
  const t0 = Date.now();
  const res = api.searchHubIndex(oneTimer.n, j);
  const dt = Date.now() - t0;
  assert.ok(res.some(r => r.key === oneTimer.n), 'one-timer trouvable par nom exact');
  assert.ok(dt < 2000, `recherche full en ${dt}ms`);
});

test('clubUrl : clé normalisée minuscule (clés club_stats)', () => {
  const { run } = makeEnv(api403);
  const api = run();
  assert.ok(api.clubUrl('BESANC').includes('?club=besanc'), 'code brut -> minuscule');
  assert.ok(api.clubUrl('JOUE-T').includes('?club=joue-t'), 'tiret conservé');
});

test('suivis : récents limités à 3 entrées', async () => {
  const { run, store } = makeEnv(api403);
  store['sqorz.recent'] = JSON.stringify([0, 1, 2, 3, 4].map(i => ({ t: 'pilots', k: 'p' + i, n: 'Pilot ' + i, at: i })));
  const api = run();
  await tick();
  const rows = (api.__suivis().match(/class="suivi-row"/g) || []).length;
  assert.equal(rows, 3, `${rows} lignes récents`);
});
