const directorySources = {
  germany: { name: 'CIVD · Germany', url: 'https://www.civd.de/en/artikel/german-manufacturers/' },
  europe: { name: 'CIVD · Europe', url: 'https://www.civd.de/en/artikel/european-manufacturers/' },
  ehg: { name: 'Erwin Hymer Group', url: 'https://www.erwinhymergroup.com/en/brands' },
  trigano: { name: 'Trigano · Brand portfolio', url: 'https://trigano-finance.com/download/15526/340b9f4a75b6bc49304c461785f28430/' },
  show: { name: 'Caravan Salon · Exhibitor index', url: 'https://www.caravan-salon.com/en/Visit/What_to_expect' }
};

const newBrands = [
  { name: 'Corigon', affiliation: 'Erwin Hymer Group', region: 'Europe', type: 'Motorhomes & campervans', launch: '2025', source: { name: 'Erwin Hymer Group · Launch', url: 'https://www.erwinhymergroup.com/en/press/~p~3542225' } },
  { name: 'Freedo', affiliation: 'Affinity RV', region: 'Europe', type: 'Campervans', launch: '2025', source: { name: 'Motor1 · CMT debut', url: 'https://uk.motor1.com/news/747764/freedo-rv-camper-vans-cmt-2025/' } },
  { name: 'NEXT', affiliation: 'Fendt-Caravan', region: 'Europe', type: 'Caravans', launch: '2025 · 2026 model season', source: { name: 'Fendt-Caravan · Model launch', url: 'https://presse.fendt-caravan.com/pressreleases/next-saison-2026-modell-380-3391379' } }
];

const directoryGroups = [
  { affiliation: 'Germany · CIVD members', source: 'germany', names: [
    'bimobil', 'Bürstner', 'CAPRON', 'Carthago', 'Concorde', 'CS-Reisemobile', 'Dethleffs', 'Eura Mobil',
    'Fendt-Caravan', 'FRANKIA', 'Hobby', 'Hymer', 'Knaus Tabbert', 'La Strada', 'LMC', 'Malibu', 'MORELO',
    'Niesmann+Bischoff', 'PhoeniX / Schell', 'Pössl Group', 'REIMO', 'Rhön Camp', 'Robel Mobil', 'Tischer',
    'VARIO mobil', 'Westfalia Mobil'
  ] },
  { affiliation: 'Europe · CIVD members', source: 'europe', names: [
    'Adria Mobil', 'Benimar', 'Groupe Pilote', 'KABE', 'Laika', 'Mediterraneo VDL', 'Mega Mobil', 'Rapido',
    'SEA', 'SoliferPolar', 'Trigano S.p.A.', 'Trigano VDL'
  ] },
  { affiliation: 'Erwin Hymer Group', source: 'ehg', names: ['Carado', 'Etrusco', 'Sunlight'] },
  { affiliation: 'Trigano', source: 'trigano', names: [
    'Arca', 'AS', 'Autostar', 'Auto-Trail', 'Caravelair', 'Challenger', 'Chausson', 'CI', 'Eden Camp', 'Elnagh',
    'Font Vendôme', 'Forster', 'Karmann Mobil', 'Kentucky Camp', 'McLouis', 'Miller', 'Mobilvetta', 'Notin',
    'Panama', 'Ranger', 'Rimor', 'Roller Team', 'Rubis', 'Silver', 'Mini Freestyle', 'Sterckeman', 'Sun Living',
    'Tribute by Auto-Trail', 'XGO'
  ] }
];

const rvDirectory = [
  ...newBrands,
  ...directoryGroups.flatMap(({ affiliation, source, names }) => names.map((name) => ({
    name, affiliation, region: 'Europe', source: directorySources[source]
  }))),
  { name: 'Affinity RV', affiliation: 'Poland', region: 'Europe', type: 'Campervans', source: { name: 'Affinity RV', url: 'https://www.affinity-rv.eu/' } },
  { name: 'New Gonow RV', affiliation: 'China', region: 'China', type: 'Motorhomes & caravans', source: { name: 'New Gonow RV', url: 'https://www.newgonowrv.hk/en/' } },
  { name: 'SAIC Maxus RV', affiliation: 'China', region: 'China', type: 'Motorhomes & chassis', source: { name: 'OpenVan · RV industry', url: 'https://openvan.camp/en/news/industry/saic-maxus-launches-rvspecific-chassis-xintu' } },
  { name: 'Feixiang RV', affiliation: 'China', region: 'China', type: 'Motorhomes', source: { name: '21RV', url: 'https://www.21rv.com/c/dbpsqj6m168s738g1us0' } },
  { name: 'Qixing RV', affiliation: 'China', region: 'China', type: 'Motorhomes', source: { name: '21RV', url: 'https://www.21rv.com/c/dblc9rrpovls738e3n60' } }
].sort((a, b) => a.name.localeCompare(b.name, 'en'));

const otherBrandFeedback = [
  {
    id: 'owner-thetford-quiet', brand: 'Thetford', family: 'Refrigeration', date: '2026-04-04', sentiment: 'Positive',
    title: 'Owner praises Thetford compressor fridge for quiet operation',
    summary: 'A forum participant described their compressor fridge as quiet enough to leave night mode off.',
    url: 'https://www.motorhomefun.co.uk/forum/threads/converted-domestic-12v-compression-fridge-or-pay-the-dometic-thetford-prices.335720/'
  },
  {
    id: 'owner-thetford-cooling', brand: 'Thetford', family: 'Refrigeration', date: '2026-06-22', sentiment: 'Issue reported',
    title: 'Owner discussion about Thetford fridge cooling',
    summary: 'Owners discussed individual cooling difficulties and shared troubleshooting experiences.',
    url: 'https://www.motorhomefun.co.uk/forum/threads/thetford-fridge-not-cooling.339220/'
  },
  {
    id: 'owner-truma-cooling', brand: 'Truma', family: 'Climate & ventilation', date: '2025-06-28', sentiment: 'Issue reported',
    title: 'Owner reports insufficient cooling from a Truma Aventa unit',
    summary: 'A forum participant reported that their unit switched on and asked for help because it was not cooling.',
    url: 'https://www.motorhomefun.co.uk/forum/threads/truma-air-con-not-cold.323823/'
  }
].map(({ url, ...story }) => ({
  ...story, category: 'other-feedback', market: 'UK', links: [{ name: 'MotorhomeFun', url }]
}));
