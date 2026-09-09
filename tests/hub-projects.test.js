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
    },
    fetch: fetchImpl,
    window: { matchMedia: () => ({ matches: false }) },
  };
  sandbox.window.window = sandbox.window;
  const run = new Function(...Object.keys(sandbox), '__els', script + '\nreturn { __main: () => __els.main.innerHTML };');
  return { run: () => run(...Object.values(sandbox), els), store };
}
const tick = (ms = 50) => new Promise(r => setTimeout(r, ms));
const api403 = async url => {
  if (String(url).includes('api.github.com')) return { ok: false, status: 403 };
  return { ok: false, status: 404 }; // icônes : repli initiales
};

test('API 403 + cache vide → liste statique (4 cartes, jamais de blocage)', async () => {
  const { run } = makeEnv(api403);
  const api = run();
  await tick();
  const html = api.__main();
  for (const repo of ['sqorz-stats', 'sqorz-club', 'sqorz-head2head', 'sqorz-category']) {
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
