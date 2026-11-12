const icons = {
  install: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  box: '<path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z"/><path d="m3 8 9 5 9-5m-9 5v8m-5-11 9-5"/>',
  bars: '<path d="M3 20h18M6 17v-4m6 4V7m6 10V4"/>',
  message: '<path d="M20 11a7 7 0 0 1-7 7H7l-4 3 1.4-6A7 7 0 0 1 11 4h2a7 7 0 0 1 7 7Z"/><path d="M8 10h8m-8 4h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  bookmark: '<path d="M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4V5Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  external: '<path d="M13 4h7v7m0-7-9 9"/><path d="M10 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  activity: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 5V4H4v12h1"/>'
};


const categories = [
  { id: 'all', name: 'Overview', icon: 'grid' },
  { id: 'china', name: 'China market', icon: 'globe' },
  { id: 'industry', name: 'Industry news', icon: 'globe' },
  { id: 'launch', name: 'Competitor launches', icon: 'box' },
  { id: 'benchmark', name: 'Product benchmarks', icon: 'bars' },
  { id: 'feedback', name: 'Dometic feedback', icon: 'message' },
  { id: 'saved', name: 'Saved updates', icon: 'bookmark' }
];

const families = [
  'Vehicle market', 'Windows, doors & blinds', 'Climate & ventilation', 'Refrigeration',
  'Cooking & kitchen', 'Sanitation & water', 'Power & electronics', 'Awnings & outdoor',
  'Access & vehicle hardware', 'Other RV equipment'
];

const cards = [
  ['European RV market', '−0.1%', 'Leisure vehicle registrations · Jan–Jul 2026 YoY', 'https://www.civd.de/news/caravan-salon-2026/'],
  ['Germany · Motorhomes', '−7.2%', 'New registrations · Jan–Sep 2026 YoY', 'https://www.promobil.de/weitere-ratgeber/wohnmobil-flaute-im-sommer-neuzulassungen-brechen-um-fast-ein-drittel-ein/'],
  ['German RV production', '≈99k', 'Leisure vehicles built · 2025', 'https://www.civd.de/en/news/01-2026-caravanning-market/'],
  ['Trigano sales', '€3.8bn', 'Group sales · Fiscal year 2026', 'https://webdisclosure.com/press-release/trigano-epa-tri-20252026-sales-uqUY9lTTKsF']
];

const chinaMarketSource = 'https://www.jfdaily.com/staticsg/res/html/web/newsDetail.html?id=1193371';
const chinaCards = [
  ['China · RV registrations', '12,153', 'Self-propelled RVs · H1 2026', chinaMarketSource],
  ['China · RV registrations', '+32.6%', 'Self-propelled RVs · H1 2026 YoY', chinaMarketSource],
  ['China · Camping vehicles', '5,315', 'New registrations · H1 2026', chinaMarketSource],
  ['China · RV product filings', '18', 'MIIT notice batch 413 · Nov 2026', 'https://www.21rv.com/c/dbop4t6m168s738g1ssg'],
];

const $ = (id) => document.getElementById(id);
const escape = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const icon = (name) => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + icons[name] + '</svg>';
const categoryFor = (id) => categories.find((item) => item.id === id);
const formatDate = (date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Europe/Stockholm' }).format(new Date(date));
const href = (value) => {
  try { const url = new URL(value); return url.protocol === 'https:' ? escape(url.href) : ''; } catch { return ''; }
};
const sourceLink = (source) =>
  '<a class="source-link" href="' + href(source.url) + '" aria-label="Open source: ' + escape(source.name) + '" target="_blank" rel="noopener noreferrer">' +
  escape(source.name) + ' ' + icon('external') + '</a>';

const state = { category: 'all', market: '', family: '', query: '', brief: null };
const savedKey = 'dometic-nicole-saved-v1';
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(savedKey) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored);
} catch {}
const dialog = $('detail');
let dialogTrigger;

document.querySelectorAll('[data-icon]').forEach((element) => { element.innerHTML = icon(element.dataset.icon); });
const nav = categories.map(({ id, name, icon: shape }) =>
  '<button class="nav-button" type="button" data-go="' + id + '" aria-pressed="false">' + icon(shape) + '<span>' + name + '</span></button>').join('');
$('side-nav').innerHTML = nav;
$('mobile-nav').innerHTML = nav;
function renderKpis() {
  const selected = state.category === 'china' || state.market === 'China' ? chinaCards :
    state.market ? cards : [cards[0], cards[2], cards[3], chinaCards[0]];
  $('kpis').innerHTML = selected.map(([label, value, period, url]) =>
    '<a class="kpi" href="' + href(url) + '" target="_blank" rel="noopener noreferrer"><span>' + escape(label) + icon('external') + '</span><strong>' + escape(value) + '</strong><small>' + escape(period) + '</small></a>').join('');
}
for (const family of families) $('family').add(new Option(family, family));

function meta(story) {
  const parts = [story.family, story.market, story.date ? formatDate(story.date) : ''].filter(Boolean).map((part) => '<span>' + escape(part) + '</span>');
  const tag = story.sentiment ? '<span class="tag' + (story.sentiment === 'Positive' ? '' : ' negative') + '">' + escape(story.sentiment) + '</span>' : '';
  return '<div class="story-meta">' + parts.join('<span class="dot"></span>') + tag + '</div>';
}

function renderStory(story) {
  const category = categoryFor(story.category);
  const isSaved = saved.has(story.id);
  const label = isSaved ? 'Remove saved update' : 'Save update';
  const comparison = story.comparison ? '<button class="story-title source-link" type="button" data-detail="' + escape(story.id) + '">View comparison</button>' : '';
  return '<article class="story ' + category.id + '"><div class="story-icon">' + icon(category.icon) + '</div>' +
    '<div>' + meta(story) + '<h3><button class="story-title" type="button" data-detail="' + escape(story.id) + '">' + escape(story.title) + '</button></h3>' +
    (story.summary ? '<p>' + escape(story.summary) + '</p>' : '') + '<div class="story-links">' + storySources(story) + comparison + '</div></div>' +
    '<button class="icon-button" type="button" data-save="' + escape(story.id) + '" aria-label="' + label + '" title="' + label + '" aria-pressed="' + isSaved + '">' + icon('bookmark') + '</button></article>';
}

function storySources(story) {
  const links = story.links.map((source) => sourceLink(source));
  if (story.language && story.language !== 'en') {
    const url = new URL('https://translate.google.com/translate');
    url.search = new URLSearchParams({ sl: story.language, tl: 'en', u: story.links[0].url });
    links.push(sourceLink({ name: 'Read in English', url: url.href }));
  }
  return links.join('');
}

function renderMini(story) {
  return '<article class="mini-story">' + meta(story) + '<button class="story-title" type="button" data-detail="' + escape(story.id) + '">' + escape(story.title) + '</button>' + sourceLink(story.links[0]) + '</article>';
}

function matchesCategory(story, category) {
  if (story.category !== category) return false;
  if (category !== 'launch') return true;
  return !/^Dometic\b/i.test(story.title) && !story.links.some(({ url }) => /^https:\/\/(?:[^./]+\.)?(?:dometic|dometicgroup)\.com(?:\/|$)/i.test(url));
}

function overviewStories(stories, category, limit) {
  const items = stories.filter((story) => matchesCategory(story, category));
  if (category !== 'feedback') return items.slice(0, limit);
  const highlights = ['Positive', 'Issue reported'].map((sentiment) => items.find((story) => story.sentiment === sentiment)).filter(Boolean);
  return [...highlights, ...items.filter((story) => !highlights.includes(story))].slice(0, limit);
}

function renderLead(story) {
  return '<article class="hero"><div class="hero-photo" aria-hidden="true"></div><div class="hero-content"><div class="hero-tag">' +
    escape(story.market.toUpperCase()) + (story.date ? ' · ' + escape(formatDate(story.date)) : '') +
    '</div><h2>' + escape(story.title) + '</h2><p>' + escape(story.summary) +
    '</p><button class="text-button" type="button" data-detail="' + escape(story.id) + '">Read update ' + icon('arrow') + '</button></div></article>';
}

function render() {
  renderKpis();
  document.querySelectorAll('nav [data-go]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.go === state.category));
  });
  if (!state.brief) return;
  const stories = state.brief.stories;
  const overview = state.category === 'all' && !state.query && !state.market && !state.family;
  $('overview').hidden = !overview;
  $('filtered').hidden = overview;
  if (overview) {
    const news = stories.filter((story) => story.category === 'industry');
    $('lead').innerHTML = news.length ? renderLead(news[0]) : '';
    $('news-feed').innerHTML = news.length > 1 ? news.slice(1, 5).map(renderStory).join('') : '<p class="empty">No further market updates.</p>';
    for (const [section, id, limit] of [['launch', 'product-feed', 3], ['benchmark', 'benchmark-feed', 2], ['feedback', 'feedback-feed', 2]]) {
      $(id).innerHTML = overviewStories(stories, section, limit).map(renderMini).join('') || '<p class="panel-empty">No updates in this section.</p>';
    }
    return;
  }
  const matches = stories.filter((story) => {
    const category = state.category === 'all' || state.category === 'china' ||
      (state.category === 'saved' ? saved.has(story.id) : matchesCategory(story, state.category));
    const market = !state.market || story.market === state.market;
    const family = !state.family || story.family === state.family;
    const text = [story.title, story.summary, story.family, story.market, ...story.links.map((link) => link.name)].join(' ').toLowerCase();
    return category && market && family && text.includes(state.query);
  });
  $('feed-title').textContent = state.category === 'all' ? 'Search results' : categoryFor(state.category).name;
  $('result-count').textContent = matches.length + (matches.length === 1 ? ' update' : ' updates');
  $('feed-list').innerHTML = matches.length ? matches.map(renderStory).join('') : '<div class="empty"><strong>No matching updates</strong><button class="secondary" type="button" data-go="all">Reset filters</button></div>';
}

function selectCategory(category) {
  state.category = category;
  state.query = state.family = '';
  state.market = category === 'china' ? 'China' : '';
  $('search').value = $('family').value = '';
  $('region').value = state.market;
  render();
}

function openDialog(label, content, trigger) {
  dialogTrigger = trigger;
  $('dialog-type').textContent = label;
  $('dialog-content').innerHTML = content;
  dialog.showModal();
}

const installButton = $('install-app');
const appDisplay = matchMedia('(display-mode: standalone)');
let installPrompt;
let installed = false;

function updateInstallButton() {
  installButton.hidden = installed || appDisplay.matches || navigator.standalone === true;
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
});
window.addEventListener('appinstalled', () => {
  installed = true;
  installPrompt = undefined;
  updateInstallButton();
});
appDisplay.addEventListener('change', updateInstallButton);
updateInstallButton();

installButton.addEventListener('click', async () => {
  if (installPrompt) {
    const prompt = installPrompt;
    installPrompt = undefined;
    try {
      await prompt.prompt();
      return;
    } catch {}
  }

  openDialog('INSTALL APP', '<h2 id="dialog-title">Install Market Intelligence</h2>' +
    '<p><strong>Microsoft Edge</strong> · Open the browser menu and choose <strong>More tools → Apps → Install this site as an app</strong>. Select <strong>Create Desktop shortcut</strong> when offered.</p>' +
    '<p><strong>Google Chrome</strong> · Open the browser menu and choose <strong>Cast, save, and share → Install page as app</strong>.</p>' +
    '<p><strong>Safari</strong> · On Mac, choose <strong>File → Add to Dock</strong>. On iPhone or iPad, choose <strong>Share → Add to Home Screen</strong>.</p>', installButton);
});

function showStory(story, trigger) {
  const comparison = story.comparison ? '<div class="comparison-wrap"><table class="compare"><thead><tr>' +
    (story.comparisonHeaders || ['Specification', 'Dometic S4', 'Carbest RW Eco']).map((column) => '<th scope="col">' + escape(column) + '</th>').join('') +
    '</tr></thead><tbody>' + story.comparison.map(([field, ...values]) =>
      '<tr><th scope="row">' + escape(field) + '</th>' + values.map((value) => '<td>' + escape(value) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' : '';
  openDialog(categoryFor(story.category).name, '<h2 id="dialog-title">' + escape(story.title) + '</h2>' + meta(story) +
    '<p>' + escape(story.detail || story.summary) + '</p>' + comparison + '<div class="dialog-links">' + storySources(story) + '</div>', trigger);
}

document.addEventListener('click', (event) => {
  const go = event.target.closest('[data-go]');
  const article = event.target.closest('[data-detail]');
  const save = event.target.closest('[data-save]');
  if (go) {
    selectCategory(go.dataset.go);
    if (!go.closest('nav')) $('main').scrollIntoView({ block: 'start' });
  } else if (article) {
    const story = state.brief.stories.find(({ id }) => id === article.dataset.detail);
    if (story) showStory(story, article);
  } else if (save) {
    const id = save.dataset.save;
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    try { localStorage.setItem(savedKey, JSON.stringify([...saved])); } catch {}
    render();
    document.querySelector('[data-save="' + CSS.escape(id) + '"]')?.focus();
  }
});

$('search').addEventListener('input', (event) => { state.query = event.target.value.trim().toLowerCase(); render(); });
$('region').addEventListener('change', (event) => {
  state.market = event.target.value;
  if (state.category === 'china' && state.market !== 'China') state.category = 'all';
  render();
});
$('family').addEventListener('change', (event) => { state.family = event.target.value; render(); });
$('about').addEventListener('click', (event) => {
  const brief = state.brief;
  const date = brief?.lastScan ? 'Last successful scan: ' + formatDate(brief.lastScan) + '.' : 'Latest editorial brief: ' + (brief ? formatDate(brief.revision) + '.' : 'unavailable.');
  openDialog('MARKET BRIEF', '<h2 id="dialog-title">Brief status</h2><p>' + escape(date) + '</p><p>Coverage includes European and Chinese public OEM and supplier releases, trade associations, specialist press and owner forums. Dates and original sources are shown with updates. Forum posts represent individual experiences.</p>', event.currentTarget);
});
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => dialogTrigger?.focus());

async function loadBrief() {
  const paths = location.hostname === 'mrmartinpet.github.io' ?
    ['https://raw.githubusercontent.com/MrMartinPet/Dometic/main/market-intelligence/brief.json', './brief.json'] : ['./brief.json'];
  for (const path of paths) {
    try {
      const response = await fetch(path, { cache: 'no-cache', signal: AbortSignal.timeout(7000) });
      if (!response.ok) continue;
      const brief = await response.json();
      if (!Array.isArray(brief.stories)) continue;
      brief.stories.sort((left, right) => (right.date || '').localeCompare(left.date || ''));
      state.brief = brief;
      const markets = [...new Set(brief.stories.map((story) => story.market))].sort();
      for (const market of markets) $('region').add(new Option(market, market));
      $('region').value = state.market;
      $('brief-status').textContent = brief.lastScan ? 'Last scan ' + formatDate(brief.lastScan) : 'Brief · ' + formatDate(brief.revision);
      render();
      return;
    } catch {}
  }
  $('brief-status').textContent = 'Brief temporarily unavailable';
}

render();
loadBrief();
