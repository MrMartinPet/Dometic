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
  { id: 'trends', name: 'Trends', icon: 'activity' },
  { id: 'china', name: 'China market', icon: 'globe' },
  { id: 'industry', name: 'Industry news', icon: 'globe' },
  { id: 'launch', name: 'Product news', icon: 'box' },
  { id: 'benchmark', name: 'Product benchmarks', icon: 'bars' },
  { id: 'feedback', name: 'Dometic feedback', icon: 'message' },
  { id: 'other-feedback', name: 'Feedback on other brands', icon: 'message' },
  { id: 'directory', name: 'RV manufacturer directory', icon: 'layers' },
  { id: 'saved', name: 'Saved updates', icon: 'bookmark' }
];

const families = [
  'Vehicle market', 'Windows, doors & blinds', 'Climate & ventilation', 'Refrigeration',
  'Cooking & kitchen', 'Sanitation & water', 'Power & electronics', 'Awnings & outdoor',
  'Access & vehicle hardware', 'Other RV equipment'
];

const overviewTrends = ['europe-rv', 'germany-rv', 'germany-production', 'trigano', 'china-rv'];
const trendById = new Map(trendGroups.flatMap(({ entries }) => entries.map((trend) => [trend.id, trend])));
const overviewMeasures = {
  'europe-rv': { label: 'Europe · RV registrations' },
  'germany-rv': { label: 'Germany · RV registrations' },
  'germany-production': { label: 'Germany · RV production', period: '2025 full year' },
  trigano: { label: 'Trigano · Group sales', value: '€3.80bn', period: 'FY2026' },
  'china-rv': { label: 'China · Motorhomes', value: '12,153', period: 'H1 2026', change: '+32.6%' }
};
// Positions share the viewBox of the locally hosted Natural Earth map.
const mapMarkets = [
  ['uk-motorhomes', 'UK', 134, 111],
  ['france-motorhomes', 'France', 165, 184],
  ['germany-motorhomes', 'Germany', 236, 136],
  ['italy-motorhomes', 'Italy', 249, 216],
  ['spain-motorhomes', 'Spain', 119, 244],
  ['sweden-motorhomes', 'Sweden', 272, 44],
  ['netherlands-motorhomes', 'Netherlands', 191, 123],
  ['china-rv', 'China', 435, 226]
];

const chinaMarketSource = 'https://www.jfdaily.com/staticsg/res/html/web/newsDetail.html?id=1193371';
const chinaCards = [
  ['China · RV registrations', '+32.6%', 'Self-propelled RVs · H1 2026 YoY', chinaMarketSource],
  ['China · Camping vehicles', '5,315', 'New registrations · H1 2026', chinaMarketSource],
  ['China · RV product filings', '18', 'MIIT notice batch 413 · Nov 2026', 'https://www.21rv.com/c/dbop4t6m168s738g1ssg'],
];

const $ = (id) => document.getElementById(id);
const escape = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const icon = (name) => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + icons[name] + '</svg>';
const categoryFor = (id) => categories.find((item) => item.id === id);
const formatDate = (date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Europe/Stockholm' }).format(new Date(date));
const formatScan = (date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Stockholm' }).format(new Date(date));
const href = (value) => {
  try { const url = new URL(value); return url.protocol === 'https:' ? escape(url.href) : ''; } catch { return ''; }
};
const sourceLink = (source) =>
  '<a class="source-link" href="' + href(source.url) + '" aria-label="Open source: ' + escape(source.name) + '" target="_blank" rel="noopener noreferrer">' +
  escape(source.name) + ' ' + icon('external') + '</a>';

const state = { category: 'all', market: '', family: '', query: '', sentiment: '', brief: null };
const savedKey = 'dometic-nicole-saved-v1';
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(savedKey) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored);
} catch {}
const dialog = $('detail');
let dialogTrigger;
let activeTrend;
let renderedChinaKpis;

document.querySelectorAll('[data-icon]').forEach((element) => { element.innerHTML = icon(element.dataset.icon); });
const nav = categories.map(({ id, name, icon: shape }) =>
  '<button class="nav-button" type="button" data-go="' + id + '" aria-pressed="false">' + icon(shape) + '<span>' + name + '</span></button>').join('');
$('side-nav').innerHTML = nav;
$('mobile-nav').innerHTML = nav;
const number = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat('en-GB', { style: 'percent', signDisplay: 'exceptZero', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const changeBetween = (current, previous) => percent.format(current / previous - 1).replace('-', '−');

function latestChange(points) {
  return changeBetween(points.at(-1)[1], points.at(-2)[1]);
}

function trendHeadline(trend, useSnapshot) {
  if (useSnapshot && trend.snapshot) return trend.snapshot;
  const pane = trend.panes[0];
  const [year, value] = pane.points.at(-1);
  return trend.unit === 'vehicles'
    ? { value: number.format(value), period: 'Vehicles · ' + year }
    : { value: number.format(value), period: pane.label + ' · ' + trend.unit + ' · FY' + year };
}

function kpiTrend(id) {
  const trend = trendById.get(id);
  if (state.category !== 'china' && state.market !== 'China') {
    const { label, value, period, change } = overviewMeasures[id];
    const comparison = trend.panes[trend.comparisonPane];
    const points = (comparison || trend.panes[0]).points;
    const [year, latest] = points.at(-1);
    const snapshot = trend.comparisonPane === undefined ? undefined : trend.snapshot;
    const delta = snapshot?.change || change || latestChange(points);
    const date = snapshot?.period || period || comparison.label.split(' · ')[0] + ' ' + year;
    return '<button class="kpi kpi-trend" type="button" data-trend="' + id + '" data-comparison aria-haspopup="dialog"><span>' +
      escape(label) + icon('activity') + '</span><strong>' + escape(snapshot?.value || value || number.format(latest)) +
      '</strong><small class="kpi-period"><span>' + escape(date) + '</span><span class="kpi-change" aria-label="' +
      escape(delta + ' year over year') + '">' + escape(delta) + ' <span>YoY</span></span></small></button>';
  }
  const { value, period } = trendHeadline(trend, true);
  return '<button class="kpi kpi-trend" type="button" data-trend="' + id + '" aria-haspopup="dialog"><span>' +
    escape(trend.title) + icon('activity') + '</span><strong>' + escape(value) + '</strong><small>' + escape(period) + '</small></button>';
}

function renderKpis() {
  const china = state.category === 'china' || state.market === 'China';
  if (renderedChinaKpis === china) return;
  renderedChinaKpis = china;
  const links = china ? chinaCards.map(([label, value, period, url]) =>
    '<a class="kpi" href="' + href(url) + '" target="_blank" rel="noopener noreferrer"><span>' + escape(label) + icon('external') + '</span><strong>' + escape(value) + '</strong><small>' + escape(period) + '</small></a>').join('') : '';
  $('kpis').innerHTML = (china ? ['china-rv'] : overviewTrends).map(kpiTrend).join('') + links;
  $('kpis').classList.toggle('china-kpis', china);
}

function renderMarketMap() {
  const map = $('market-map');
  map.insertAdjacentHTML('beforeend', mapMarkets.map(([id, name, x, y]) => {
      const points = trendById.get(id).panes[0].points;
      const [year, value] = points.at(-1);
      const china = id === 'china-rv';
      const metric = china ? 'leisure vehicles' : 'motorhomes';
      const change = latestChange(points);
      const label = name + ', ' + number.format(value) + ' new ' + metric + ' in ' + year + ', ' + change + ' year over year';
      const size = china ? 23 : Math.round(14 + Math.sqrt(value / 75368) * 21);
      return '<button class="map-marker' + (china ? ' china-marker' : '') + '" type="button" data-trend="' + id +
        '" aria-haspopup="dialog" aria-label="' + escape(label) + '" style="--map-x:' + (x / 5.2) + '%;--map-y:' +
        (y / 2.98) + '%;--dot-size:' + size + 'px"><span class="map-dot" aria-hidden="true"></span><span class="map-name" aria-hidden="true">' +
        escape(name) + '</span><span class="visual-tooltip" aria-hidden="true"><b>' + escape(name) + '</b><span>' +
        number.format(value) + ' ' + metric + ' · ' + year + '</span><small>' + escape(change) + ' vs ' +
        points.at(-2)[0] + '</small></span></button>';
    }).join(''));
}

function renderOverviewChart(id, label, unit, color, scaleStep) {
  const trend = trendById.get(id);
  const points = trend.panes[0].points;
  const ceiling = Math.ceil(Math.max(...points.map(([, value]) => value)) / scaleStep) * scaleStep;
  const positions = points.map(([year, value], index) => ({
    year, value, x: 14 + 292 * index / (points.length - 1), y: 48 - value / ceiling * 39
  }));
  const line = positions.map(({ x, y }) => x + ',' + y).join(' ');
  const markers = positions.map(({ year, value, x, y }, index) => {
    const prior = points[index - 1];
    const delta = prior ? '<small>' + escape(changeBetween(value, prior[1])) + ' vs ' + prior[0] + '</small>' : '';
    return '<button type="button" class="chart-point' + (index === positions.length - 1 ? ' last-point' : '') +
      '" style="--chart-x:' + (x / 3.2) + '%;--chart-y:' + (y / .54) + '%" data-trend="' + id +
      '" aria-haspopup="dialog" aria-label="' + escape(label + ', ' + year + ', ' + number.format(value) + ' ' + unit) +
      '"><span class="visual-tooltip" aria-hidden="true"><b>' + year + ' · ' + number.format(value) + '</b><span>' +
      escape(unit) + '</span>' + delta + '</span></button>';
  }).join('');
  return '<article class="overview-chart ' + color + '"><div class="overview-chart-head"><button class="story-title" type="button" data-trend="' +
    id + '" aria-haspopup="dialog">' + escape(label) + ' ' + icon('arrow') + '</button><span>' +
    number.format(points.at(-1)[1]) + ' ' + escape(unit) +
    '</span></div><div class="chart-plot"><svg viewBox="0 0 320 54" preserveAspectRatio="none" aria-hidden="true">' +
    '<path class="chart-grid" d="M0 9H320 M0 29H320 M0 48H320"/><polygon points="14,48 ' + line + ' 306,48"/>' +
    '<polyline points="' + line + '"/></svg>' + markers + '</div><div class="chart-years" aria-hidden="true">' +
    positions.map(({ year, x }) => '<span style="left:' + (x / 3.2) + '%">' + year + '</span>').join('') + '</div></article>';
}

function renderRegistrationComparison(id, label, color) {
  const trend = trendById.get(id);
  const pane = trend.panes[trend.comparisonPane];
  const maximum = Math.max(...pane.points.map(([, value]) => value));
  const bars = pane.points.map(([year, value]) =>
    '<span class="registration-row"><span>' + year + '</span><span class="registration-track" aria-hidden="true">' +
    '<span style="width:' + (value / maximum * 100).toFixed(1) + '%"></span></span><strong>' + number.format(value) + '</strong></span>'
  ).join('');
  return '<button class="registration-comparison ' + color + '" type="button" data-trend="' + id +
    '" data-comparison aria-haspopup="dialog"><span class="registration-heading"><strong>' + escape(label) +
    ' ' + icon('arrow') + '</strong><span>' + escape(pane.label.split(' · ')[0]) + ' · ' +
    escape(latestChange(pane.points)) + '</span></span>' + bars + '</button>';
}

renderMarketMap();
$('overview-charts').innerHTML =
  renderRegistrationComparison('europe-rv', 'Europe · New registrations', 'chart-teal') +
  renderRegistrationComparison('germany-rv', 'Germany · New registrations', 'chart-blue') +
  renderOverviewChart('germany-production', 'German RV production', 'vehicles', 'chart-blue', 50000);

function trendCard(trend) {
  const latest = trend.activity
    ? { value: 'Product activity', period: trend.activity[0].period }
    : trendHeadline(trend, false);
  return '<button class="trend-card" type="button" data-trend="' + trend.id + '" aria-haspopup="dialog">' +
    '<span class="trend-card-title">' + escape(trend.title) + icon(trend.activity ? 'box' : 'activity') + '</span>' +
    '<strong>' + escape(latest.value) + '</strong><small>' + escape(latest.period) + '</small></button>';
}

$('trend-groups').innerHTML = trendGroups.map(({ title, description, entries }) =>
  '<section class="trend-group"><h3>' + escape(title) + '</h3><p>' + escape(description) + '</p><div class="trend-grid">' +
  entries.map(trendCard).join('') + '</div></section>').join('') +
  '<p class="trend-method">Sources are linked in each chart. Financial years, currencies and business scopes vary by company. Historical figures are updated when new source figures are reviewed.</p>';
for (const family of families) $('family').add(new Option(family, family));

function meta(story) {
  const parts = [story.brand, story.family, story.market, story.date ? formatDate(story.date) : ''].filter(Boolean).map((part) => '<span>' + escape(part) + '</span>');
  const tag = story.sentiment ? '<span class="tag' + (story.sentiment === 'Issue reported' ? ' negative' : story.sentiment === 'Mixed' ? ' mixed' : '') + '">' + escape(story.sentiment) + '</span>' : '';
  return '<div class="story-meta">' + parts.join('<span class="dot"></span>') + tag + '</div>';
}

function renderStory(story, compact = false) {
  const category = categoryFor(story.category);
  const isSaved = saved.has(story.id);
  const label = isSaved ? 'Remove saved update' : 'Save update';
  const comparison = story.comparison ? '<button class="story-title source-link" type="button" data-detail="' + escape(story.id) + '">View comparison</button>' : '';
  return '<article class="story ' + category.id + '"><div class="story-icon">' + icon(category.icon) + '</div>' +
    '<div>' + meta(story) + '<h3><button class="story-title" type="button" data-detail="' + escape(story.id) + '">' + escape(story.title) + '</button></h3>' +
    (!compact && story.summary ? '<p>' + escape(story.summary) + '</p>' : '') + '<div class="story-links">' + storySources(story) + comparison + '</div></div>' +
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
  if (category !== 'feedback' && category !== 'other-feedback') return items.slice(0, limit);
  const highlights = ['Positive', 'Issue reported'].map((sentiment) => items.find((story) => story.sentiment === sentiment)).filter(Boolean);
  return [...highlights, ...items.filter((story) => !highlights.includes(story))].slice(0, limit);
}

function directoryCard(entry) {
  return '<article class="directory-card"><div><h3>' + escape(entry.name) + '</h3><p>' +
    [entry.affiliation, entry.type, entry.launch].filter(Boolean).map(escape).join(' · ') +
    '</p></div>' + sourceLink(entry.source) + '</article>';
}

function renderDirectory() {
  const search = $('directory-search').value.trim().toLowerCase();
  const region = $('directory-region').value;
  const recent = $('directory-scope').value === 'recent';
  const matches = rvDirectory.filter((entry) =>
    (!region || entry.region === region) && (!recent || entry.launch) &&
    [entry.name, entry.affiliation, entry.type].join(' ').toLowerCase().includes(search)
  );
  $('directory-count').textContent = matches.length + ' of ' + rvDirectory.length + ' listed entries';
  $('directory-list').innerHTML = matches.map(directoryCard).join('') || '<p class="empty">No matching manufacturers.</p>';
}

$('new-brand-feed').innerHTML = newBrands.map(directoryCard).join('');
$('directory-sources').innerHTML = Object.values(directorySources).map(sourceLink).join('');
for (const id of ['directory-search', 'directory-region', 'directory-scope']) {
  $(id).addEventListener(id === 'directory-search' ? 'input' : 'change', renderDirectory);
}

function render() {
  renderKpis();
  document.querySelectorAll('nav [data-go]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.go === state.category));
  });
  const trends = state.category === 'trends';
  const directory = state.category === 'directory';
  const feedback = ['feedback', 'other-feedback'].includes(state.category);
  const overview = state.category === 'all' && !state.query && !state.market && !state.family;
  $('market-visuals').hidden = !overview;
  $('kpis').hidden = $('update-filters').hidden = trends || directory;
  $('directory').hidden = !directory;
  $('sentiment-filter').hidden = $('feedback-context').hidden = !feedback;
  $('trends').hidden = !trends;
  if (trends || directory) {
    $('overview').hidden = $('filtered').hidden = true;
    if (directory) renderDirectory();
    return;
  }
  if (!state.brief) {
    $('overview').hidden = state.category !== 'all';
    $('filtered').hidden = true;
    return;
  }
  const stories = state.brief.stories;
  $('overview').hidden = !overview;
  $('filtered').hidden = overview;
  if (overview) {
    const news = stories.filter((story) => story.category === 'industry');
    $('news-feed').innerHTML = news.length ? news.slice(0, 5).map((story) => renderStory(story, true)).join('') : '<p class="empty">No market updates.</p>';
    for (const [section, id, limit] of [['launch', 'product-feed', 3], ['benchmark', 'benchmark-feed', 2], ['feedback', 'feedback-feed', 2], ['other-feedback', 'other-feedback-feed', 2]]) {
      $(id).innerHTML = overviewStories(stories, section, limit).map(renderMini).join('') || '<p class="panel-empty">No updates in this section.</p>';
    }
    return;
  }
  const matches = stories.filter((story) => {
    const category = state.category === 'all' || state.category === 'china' ||
      (state.category === 'saved' ? saved.has(story.id) : matchesCategory(story, state.category));
    const market = !state.market || story.market === state.market;
    const family = !state.family || story.family === state.family;
    const text = [story.title, story.summary, story.family, story.market, story.brand, ...story.links.map((link) => link.name)].join(' ').toLowerCase();
    return category && market && family && (!state.sentiment || story.sentiment === state.sentiment) && text.includes(state.query);
  });
  $('feed-title').textContent = state.category === 'all' ? 'Search results' : categoryFor(state.category).name;
  $('result-count').textContent = matches.length + (matches.length === 1 ? ' update' : ' updates');
  $('feed-list').innerHTML = matches.length ? matches.map((story) => renderStory(story)).join('') : '<div class="empty"><strong>No matching updates</strong><button class="secondary" type="button" data-go="all">Reset filters</button></div>';
}

function selectCategory(category) {
  state.category = category;
  state.query = state.family = state.sentiment = '';
  state.market = category === 'china' ? 'China' : '';
  $('search').value = $('family').value = $('sentiment').value = '';
  $('region').value = state.market;
  render();
}

function openDialog(label, content, trigger) {
  dialogTrigger = trigger;
  $('dialog-type').textContent = label;
  $('dialog-content').innerHTML = content;
  dialog.showModal();
}

function trendChart(trend, pane) {
  const left = 65;
  const right = 400;
  const top = 15;
  const bottom = 148;
  const wantedStep = Math.max(...pane.points.map(([, value]) => value)) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(wantedStep));
  const step = [1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= wantedStep) * magnitude;
  const ticks = Math.ceil(wantedStep * 4 / step);
  const ceiling = ticks * step;
  const height = bottom - top;
  const positions = pane.points.map(([year, value], index) => ({
    year, value,
    x: left + 15 + (right - left - 30) * index / (pane.points.length - 1),
    y: bottom - height * value / ceiling
  }));
  const grid = Array.from({ length: ticks + 1 }, (_, index) => {
    const y = bottom - height * index / ticks;
    return '<line class="trend-gridline" x1="' + left + '" x2="' + right + '" y1="' + y + '" y2="' + y + '"/>' +
      '<text x="' + (left - 8) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' +
      escape(compact.format(index * step)) + '</text>';
  }).join('');
  const line = positions.map(({ x, y }) => x + ',' + y).join(' ');
  const dots = positions.map(({ x, y, year, value }) =>
    '<circle cx="' + x + '" cy="' + y + '" r="4.4"><title>' + year + ' · ' + escape(number.format(value) + ' ' + trend.unit) + '</title></circle>' +
    '<text x="' + x + '" y="174" text-anchor="middle">' + year + '</text>').join('');
  return '<svg class="trend-chart" viewBox="0 0 415 183" role="img" aria-label="' +
    escape(pane.label + ' trend in ' + trend.unit + '. Exact values are listed below.') + '">' + grid +
    '<polyline points="' + line + '"/>' + dots + '</svg>';
}

function renderTrendPane(trend, index) {
  const pane = trend.panes[index];
  $('trend-pane').innerHTML = '<p class="trend-scope">' + escape(pane.scope) + '</p>' + trendChart(trend, pane) +
    '<table class="compare trend-table"><thead><tr><th scope="col">Year</th><th scope="col">' + escape(trend.unit === 'vehicles' ? 'Vehicles' : trend.unit) +
    '</th><th scope="col">Source</th></tr></thead><tbody>' + pane.points.map(([year, value, source]) =>
      '<tr><th scope="row">' + (trend.unit === 'vehicles' ? '' : 'FY') + year + '</th><td>' + escape(number.format(value)) +
      '</td><td>' + sourceLink(trendSources[source]) + '</td></tr>').join('') + '</tbody></table>';
}

function showTrend(trend, trigger) {
  activeTrend = trend;
  const heading = '<h2 id="dialog-title">' + escape(trend.title) + '</h2>';
  if (trend.activity) {
    const items = trend.activity.map(({ period, title, detail, source }) =>
      '<li><small>' + escape(period) + '</small><strong>' + escape(title) + '</strong><p>' + escape(detail) + '</p>' +
      sourceLink(source) + '</li>').join('');
    openDialog('PRODUCT ACTIVITY', heading + '<ul class="trend-timeline">' + items + '</ul>', trigger);
    return;
  }
  const snapshot = trend.snapshot ? '<div class="trend-snapshot"><p>' + escape(trend.snapshot.detail) + '</p>' +
    sourceLink(trendSources[trend.snapshot.source]) + '</div>' : '';
  const initialPane = trigger.hasAttribute('data-comparison') ? (trend.comparisonPane ?? 0) : 0;
  const controls = trend.panes.length > 1 ? '<div class="trend-options" role="group" aria-label="Chart view">' +
    trend.panes.map(({ label }, index) => '<button type="button" class="secondary" data-trend-pane="' + index +
      '" aria-controls="trend-pane" aria-pressed="' + (index === initialPane) + '">' + escape(label) + '</button>').join('') + '</div>' : '';
  openDialog('HISTORICAL TREND', heading + snapshot + controls + '<div id="trend-pane" aria-live="polite"></div>', trigger);
  renderTrendPane(trend, initialPane);
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
  const trend = event.target.closest('[data-trend]');
  const pane = event.target.closest('[data-trend-pane]');
  if (go) {
    selectCategory(go.dataset.go);
    if (!go.closest('nav')) $('main').scrollIntoView({ block: 'start' });
  } else if (trend) {
    showTrend(trendById.get(trend.dataset.trend), trend);
  } else if (pane) {
    for (const button of pane.parentElement.children) button.setAttribute('aria-pressed', String(button === pane));
    renderTrendPane(activeTrend, Number(pane.dataset.trendPane));
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
$('sentiment').addEventListener('change', (event) => { state.sentiment = event.target.value; render(); });
$('about').addEventListener('click', (event) => {
  const brief = state.brief;
  const date = brief?.lastScan ? 'Last successful scan: ' + formatScan(brief.lastScan) + ' (Stockholm).' : 'Latest editorial brief: ' + (brief ? formatDate(brief.revision) + '.' : 'unavailable.');
  const checks = Object.entries(brief?.marketChecks || {}).map(([market, stamp]) => escape(market + ' · ' + formatScan(stamp))).join('<br>');
  openDialog('MARKET BRIEF', '<h2 id="dialog-title">Brief status</h2><p>' + escape(date) +
    '</p><p>Scheduled daily at 07:00 Stockholm time.</p>' + (checks ? '<p>' + checks + '</p>' : '') +
    '<p>Coverage includes specialist press, trade associations and public owner forums.</p>', event.currentTarget);
});
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  activeTrend = undefined;
  dialogTrigger?.focus();
});

async function loadBrief() {
  const paths = location.hostname === 'mrmartinpet.github.io' ?
    ['https://raw.githubusercontent.com/MrMartinPet/Dometic/main/market-intelligence/brief.json', './brief.json'] : ['./brief.json'];
  for (const path of paths) {
    try {
      const response = await fetch(path, { cache: 'no-cache', signal: AbortSignal.timeout(7000) });
      if (!response.ok) continue;
      const brief = await response.json();
      if (!Array.isArray(brief.stories)) continue;
      const originalUrls = new Set(brief.stories.flatMap((story) => story.links.map(({ url }) => url.replace(/\/$/, ''))));
      brief.stories.push(...otherBrandFeedback.filter((story) => !originalUrls.has(story.links[0].url.replace(/\/$/, ''))));
      brief.stories.sort((left, right) => (right.date || '').localeCompare(left.date || ''));
      state.brief = brief;
      const markets = [...new Set(brief.stories.map((story) => story.market))].sort();
      for (const market of markets) $('region').add(new Option(market, market));
      $('region').value = state.market;
      $('brief-status').textContent = brief.lastScan ? 'Last scan ' + formatScan(brief.lastScan) : 'Brief · ' + formatDate(brief.revision);
      render();
      return;
    } catch {}
  }
  $('brief-status').textContent = 'Brief temporarily unavailable';
}

render();
loadBrief();
