const trendSources = {
  civd2025: { name: 'CIVD yearbook 2025', url: 'https://www.civd.de/wp-content/uploads/2025/04/2025-CIVD-Jahresband-KURZ-klein.pdf' },
  civd2026: { name: 'CIVD yearbook 2026', url: 'https://www.civd.de/wp-content/uploads/2019/05/2026-CIVD-Jahresband-KURZ-zum-Versand.pdf' },
  civdMonthly: { name: 'CIVD monthly figures', url: 'https://www.civd.de/en/artikel/monthly-registrations/' },
  civdEuropeYtd: { name: 'CIVD · Caravan Salon 2026', url: 'https://www.civd.de/news/caravan-salon-2026/' },
  civdOct: { name: 'CIVD · November 2026 release', url: 'https://www.presseportal.de/pm/50926/6389204' },
  production22: { name: 'CIVD · German production 2022', url: 'https://www.civd.de/en/news/german-leisure-vehicles-are-in-strong-demand-throughout-europe/' },
  production23: { name: 'CIVD · German production 2023', url: 'https://www.civd.de/news/deutschland-groesster-caravaning-markt-europas-01-2024/' },
  chinaH1: { name: 'People’s Daily · Chinese', url: 'https://sh.people.com.cn/n2/2026/0831/c134768-41682751.html' },
  thor25: { name: 'THOR FY2025 filing', url: 'https://www.sec.gov/Archives/edgar/data/730263/000073026325000019/R33.htm' },
  thor26: { name: 'THOR FY2026 filing', url: 'https://www.sec.gov/Archives/edgar/data/730263/000073026326000027/R35.htm' },
  trigano25: { name: 'Trigano FY2025 results', url: 'https://trigano-finance.com/download/15520/9132c9cd45c6f52e205dc0b79847e5dd/' },
  trigano26: { name: 'Trigano FY2026 sales release', url: 'https://trigano-finance.com/download/26929/ecb5328e852ed25ab364b5b5a3988760/' },
  knaus24: { name: 'Knaus Tabbert FY2024 report', url: 'https://www.knaustabbert.de/fileadmin/media/investor-relations/geschaeftsbericht/2024/Geschaeftsbericht-2024-EN.pdf' },
  knaus25: { name: 'Knaus Tabbert FY2025 results', url: 'https://www.knaustabbert.de/en/press/press-releases/annual-report-2025/' },
  lippert: { name: 'LCI Industries FY2025 filing', url: 'https://www.sec.gov/Archives/edgar/data/763744/000076374426000011/lcii-20251231.htm' },
  indel24: { name: 'Indel B FY2024 report', url: 'https://www.indelbgroup.com/downloads/5730/5726/Financial_Report_2024.pdf' },
  indel25: { name: 'Indel B FY2025 results presentation', url: 'https://www.marketscreener.com/news/indel-b-s-p-a-fy-2025-consolidated-financial-results-presentation-ce7e50d8d08bf422' },
  dometic: { name: 'Dometic FY2025 report', url: 'https://www.dometicgroup.com/media/tjwj0nbj/dometic_asr_2025_eng_linked_250319.pdf' }
};

const trendPoints = (firstYear, values, source) => values.map((value, index) => [firstYear + index, value, source]);

const motorhomeTrend = (id, country, values) => ({
  id: id + '-motorhomes',
  title: country + ' · Motorhomes',
  unit: 'vehicles',
  panes: [{
    label: 'Full years',
    scope: 'New motorhome registrations in ' + country + ', January to December.',
    points: trendPoints(2021, values, 'civd2026')
  }]
});

const trendGroups = [
  {
    title: 'Registrations & production',
    description: 'Calendar-year figures for selected RV markets.',
    entries: [
      {
        id: 'europe-rv', title: 'European RV market', unit: 'vehicles',
        snapshot: { value: '−0.1%', period: 'New registrations · Jan–Jul 2026 YoY', detail: 'CIVD reported more than 149,000 European leisure vehicle registrations in Jan–Jul 2026, down 0.1% from the same period in 2025.', source: 'civdEuropeYtd' },
        panes: [
          { label: 'All leisure vehicles', scope: 'The sum of the new motorhome and caravan registrations in CIVD’s European tables.', points: trendPoints(2021, [260987, 219349, 210343, 221207, 215611], 'civd2026') },
          { label: 'Motorhomes', scope: 'New motorhome registrations in the European markets covered by CIVD.', points: trendPoints(2021, [181516, 147804, 146490, 160342, 161369], 'civd2026') },
          { label: 'Caravans', scope: 'New caravan registrations in the European markets covered by CIVD.', points: trendPoints(2021, [79471, 71545, 63853, 60865, 54242], 'civd2026') }
        ]
      },
      {
        id: 'germany-motorhomes', title: 'Germany · Motorhomes', unit: 'vehicles',
        snapshot: { value: '−8.1%', period: 'Jan–Oct 2026 vs Jan–Oct 2025', detail: '61,447 new motorhomes registered in Jan–Oct 2026, down 8.1% from the same months in 2025.', source: 'civdOct' },
        panes: [
          { label: 'Full years', scope: 'New motorhome registrations in Germany, January to December.', points: trendPoints(2021, [81420, 66507, 68469, 74718, 75368], 'civd2026') },
          { label: 'Jan–Sep', scope: 'New motorhome registrations from January to September in each year.', points: trendPoints(2023, [57376, 63046, 62374, 57890], 'civdMonthly') }
        ]
      },
      {
        id: 'germany-caravans', title: 'Germany · Caravans', unit: 'vehicles',
        snapshot: { value: '−5.4%', period: 'Jan–Oct 2026 vs Jan–Oct 2025', detail: '16,392 new caravans registered in Jan–Oct 2026, down 5.4% from the same months in 2025.', source: 'civdOct' },
        panes: [
          { label: 'Full years', scope: 'New caravan registrations in Germany, January to December.', points: trendPoints(2021, [24718, 24478, 21896, 21674, 18766], 'civd2026') },
          { label: 'Jan–Sep', scope: 'New caravan registrations from January to September in each year.', points: trendPoints(2023, [18752, 18339, 16180, 15396], 'civdMonthly') }
        ]
      },
      {
        id: 'germany-production', title: 'German RV production', unit: 'vehicles',
        panes: [
          { label: 'Full years', scope: 'Motorhomes and caravans built by German manufacturers. The 2024 and 2025 totals add the two vehicle categories in the cited CIVD yearbooks.', points: [[2022, 129287, 'production22'], [2023, 133568, 'production23'], [2024, 118820, 'civd2025'], [2025, 99358, 'civd2026']] }
        ]
      },
      {
        id: 'france-motorhomes', title: 'France · Motorhomes', unit: 'vehicles',
        panes: [
          { label: 'Full years', scope: 'New motorhome registrations in France, January to December.', points: trendPoints(2021, [30822, 24611, 23936, 26396, 26335], 'civd2026') }
        ]
      },
      {
        id: 'uk-motorhomes', title: 'UK · Motorhomes', unit: 'vehicles',
        panes: [
          { label: 'Full years', scope: 'New motorhome registrations in the United Kingdom, January to December.', points: trendPoints(2021, [14074, 11823, 12179, 16447, 16668], 'civd2026') }
        ]
      },
      motorhomeTrend('italy', 'Italy', [7113, 5828, 5833, 6967, 7709]),
      motorhomeTrend('spain', 'Spain', [6175, 5323, 5270, 6461, 6126]),
      motorhomeTrend('sweden', 'Sweden', [5066, 3498, 2676, 2865, 4201]),
      motorhomeTrend('netherlands', 'Netherlands', [3164, 2260, 2230, 2465, 2937]),
      {
        id: 'china-rv', title: 'China · RV registrations', unit: 'vehicles',
        snapshot: { value: '12,153', period: 'Self-propelled RVs · H1 2026', detail: 'People’s Daily reported 12,153 self-propelled RV registrations in H1 2026. This narrower vehicle category and shorter period have their own reporting basis.', source: 'chinaH1' },
        panes: [
          { label: 'Full years', scope: 'New leisure vehicle registrations as published in CIVD’s worldwide market overview.', points: trendPoints(2021, [15714, 14135, 16565, 13726, 15045], 'civd2026') }
        ]
      }
    ]
  },
  {
    title: 'Selected RV manufacturers',
    description: 'Company-reported group or segment sales in the original currency.',
    entries: [
      {
        id: 'thor', title: 'THOR Industries · Erwin Hymer Group', unit: 'USD million',
        panes: [
          { label: 'European RV segment', scope: 'Net sales of THOR’s European Recreational Vehicles segment, which includes Erwin Hymer Group. Fiscal year ends in July.', points: [[2023, 3037.1, 'thor25'], ...trendPoints(2024, [3365.0, 3024.0, 3296.7], 'thor26')] },
          { label: 'THOR group', scope: 'Consolidated THOR Industries net sales across all segments. Fiscal year ends in July.', points: [[2023, 11121.6, 'thor25'], ...trendPoints(2024, [10043.4, 9579.5, 9608.1], 'thor26')] }
        ]
      },
      {
        id: 'trigano', title: 'Trigano', unit: 'EUR million',
        panes: [
          { label: 'Group sales', scope: 'Consolidated Trigano sales. Fiscal year ends in August. FY2026 is from the company’s unaudited sales release.', points: [...trendPoints(2023, [3480.2, 3926.3, 3660.2], 'trigano25'), [2026, 3800.0, 'trigano26']] },
          { label: 'Motorhome sales', scope: 'Revenue from motorhomes only. Fiscal year ends in August. FY2026 is from the company’s unaudited sales release.', points: [...trendPoints(2023, [2572.1, 3131.1, 2760.6], 'trigano25'), [2026, 2877.2, 'trigano26']] }
        ]
      },
      {
        id: 'knaus', title: 'Knaus Tabbert', unit: 'EUR million',
        panes: [
          { label: 'Group revenue', scope: 'Consolidated Knaus Tabbert revenue. Fiscal year ends in December.', points: [...trendPoints(2022, [1049.5, 1441.0, 1082.1], 'knaus24'), [2025, 1002.1, 'knaus25']] }
        ]
      }
    ]
  },
  {
    title: 'Equipment suppliers',
    description: 'Public sales trends and product announcements. Figures cover the business scope shown on each chart.',
    entries: [
      {
        id: 'lippert', title: 'Lippert · LCI Industries', unit: 'USD million',
        panes: [
          { label: 'Group sales', scope: 'Worldwide consolidated net sales across RV and other end markets. Fiscal year ends in December.', points: trendPoints(2023, [3784.8, 3741.2, 4122.0], 'lippert') }
        ]
      },
      {
        id: 'indel', title: 'Indel B', unit: 'EUR million',
        panes: [
          { label: 'Group revenue', scope: 'Consolidated total revenue across all business lines, including mobile cooling. Fiscal year ends in December.', points: [[2023, 226.5, 'indel24'], [2024, 203.5, 'indel24'], [2025, 207.4, 'indel25']] }
        ]
      },
      {
        id: 'dometic', title: 'Dometic · Land Vehicles', unit: 'SEK million',
        panes: [
          { label: 'EMEA', scope: 'Reported net sales for EMEA within Dometic’s Land Vehicles segment. Fiscal year ends in December.', points: trendPoints(2023, [6739, 6084, 5250], 'dometic') },
          { label: 'Global', scope: 'Worldwide net sales for Dometic’s Land Vehicles segment. Fiscal year ends in December.', points: trendPoints(2023, [12424, 10858, 9169], 'dometic') }
        ]
      },
      {
        id: 'thetford', title: 'Thetford',
        activity: [
          { period: '2027 season', title: 'Kitchen, refrigeration and sanitation updates', detail: 'Thetford previewed its 2027-season products in these categories at Caravan Salon Düsseldorf.', source: { name: 'Thetford · 2027 product preview', url: 'https://www.thetford.com/en/inspiration/new-products-2027-2/' } },
          { period: '2026 season', title: 'Refrigeration product updates', detail: 'Thetford announced the TR1050 and TR1065 refrigerator range and a compact version of the T2152.', source: { name: 'Thetford · 2026 product announcement', url: 'https://www.thetford.com/int/new-products-2026/' } }
        ]
      },
      {
        id: 'truma', title: 'Truma',
        activity: [
          { period: '2026', title: 'Combi heating accessory', detail: 'Truma announced a condensate spout for selected Combi heating systems.', source: { name: 'Truma · Combi accessory announcement', url: 'https://www.truma.com/press-releases/truma-expands-its-range-of-combi-accessories-condensate-spout-effectively-drains-condensate/' } },
          { period: '2025', title: 'CombiNeo heating system', detail: 'Truma presented CombiNeo at the Caravan, Camping & Motorhome Show in Birmingham.', source: { name: 'Truma · CombiNeo', url: 'https://camp.truma.com/en/combineo/' } },
          { period: '2025', title: 'Second-generation Aventa', detail: 'Truma announced specialist retail availability for its updated roof air conditioner range from spring 2025.', source: { name: 'Truma · Aventa announcement', url: 'https://www.truma.com/press-releases/aventa-2nd-generation-a-masterpiece-of-coolness/' } }
        ]
      }
    ]
  }
];
