// FactList's Figma spec. Mirrors src/components/FactList/FactList.module.css (tree format:
// see button.mjs). Each fact is a label taking 9/20 of its pair (AcmeCo's 45%) and a value.
// Two columns: two pairs a row, as the code shows from 560px; narrower, use One column.

const COLUMNS = ['One', 'Two']
const WIDTH = 640
const FACTS = {
  One: [['Size', '1,850 SF'], ['Rental Rate', '$28.50 /SF/YR'], ['Space Use', 'Office'], ['Availability', 'Now']],
  Two: [['Total Space', '1,850 - 12,400 SF'], ['Property Type', 'Office'], ['Year Built', '2008'], ['Floors', '4'], ['Date on Market', '9/24/2026']],
}
const type = { fontSize: 'fact-list/font-size', lineHeight: 'fact-list/line-height', fontWeight: 'fact-list/font-weight' }
const pair = ([label, value], i, width) => ({
  k: 'frame', name: `Fact ${i + 1}`, dir: 'H', align: 'start', cross: 'start', width, gap: 'fact-list/column-gap',
  children: [
    { k: 'text', name: i === 0 ? 'Label' : `Label ${i + 1}`, chars: label, ...type, fill: 'fact-list/label', fr: 9 },
    { k: 'text', name: i === 0 ? 'Value' : `Value ${i + 1}`, chars: value, ...type, fill: 'fact-list/value', fr: 11 },
  ],
})

export const factList = {
  id: 'fact-list',
  name: 'Fact list',
  page: 'Fact list',
  storybook: 'Components / FactList',
  code: 'src/components/FactList/FactList.tsx',
  guidance: 'src/components/FactList/FactList.guidance.md',
  tokens: 'tokens/components/fact-list.json',
  tokenPrefix: 'fact-list.',
  status: 'Ready (decision 47)',
  axes: { Columns: COLUMNS },
  grid: { columns: 'Columns', rowGroups: null, rows: null },
  gridNote: `Shown ${WIDTH}px wide. Two columns: two facts a row where the list is 560px or wider; below that the code shows one a row, so use One column. Edit the Label and Value layers; hide rows you don't need.`,
  properties: [],
  variants: COLUMNS.map((Columns) => {
    const facts = FACTS[Columns]
    const half = (WIDTH - 24) / 2 // fact-list/pair-gap between the two pairs
    const rows = Columns === 'One'
      ? facts.map((f, i) => pair(f, i, WIDTH))
      : Array.from({ length: Math.ceil(facts.length / 2) }, (_, r) => ({
        k: 'frame', name: `Row ${r + 1}`, dir: 'H', align: 'start', cross: 'start', gap: 'fact-list/pair-gap',
        children: facts.slice(r * 2, r * 2 + 2).map((f, j) => pair(f, r * 2 + j, half)),
      }))
    return {
      props: { Columns },
      tree: { k: 'frame', dir: 'V', align: 'start', cross: 'start', width: WIDTH, gap: 'fact-list/row-gap', children: rows },
    }
  }),
  anatomy: [
    { part: 'Label', tokens: 'fact-list/label (the secondary grey), 9/20 of its pair (AcmeCo\'s 45%), fact-list/font-size, line-height, font-weight', layer: 'Label', at: 'top' },
    { part: 'Value', tokens: 'fact-list/value (ink), fact-list/column-gap after the label', layer: 'Value', at: 'top' },
    { part: 'Rows', tokens: 'fact-list/row-gap between rows; fact-list/pair-gap between two pairs on a row', layer: 'Fact 3', at: 'left' },
  ],
  anatomyVariant: { Columns: 'Two' },
  parity: {
    story: 'components-factlist--states-matrix',
    order: COLUMNS.map((Columns) => ({ Columns })),
    parts: [
      { name: 'List', css: 'dl', layer: null, fields: ['w'] },
      { name: 'First label', css: 'div:first-child > dt', layer: 'Label', fields: ['font', 'color', 'startInset', 'w'] },
      { name: 'First value', css: 'div:first-child > dd', layer: 'Value', fields: ['font', 'color', 'startInset'] },
      { name: 'Second label', css: 'div:nth-child(2) > dt', layer: 'Label 2', fields: ['startInset', 'topInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['fact-list/font-size', 'fact-list/line-height', 'fact-list/column-gap', 'fact-list/row-gap', 'fact-list/pair-gap'],
}
