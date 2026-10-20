// List's Figma spec. Mirrors src/components/List/List.module.css (tree format: see
// button.mjs). Each point is a dark blue dot centred on the first line, then the text; the code's
// CSS columns become column frames here (items run down the first column, then the next).

const COLUMNS = ['One', 'Two']
const WIDTH = 640
const POINTS = ['Floor-to-ceiling windows with mountain views', 'On-site fitness center and bike storage', 'Walkable to light rail and restaurants', 'Flexible floor plates from 1,200 SF']
const type = { fontSize: 'list/font-size', lineHeight: 'list/line-height', fontWeight: 'list/font-weight', fill: 'list/text' }
const item = (text, i, width) => ({
  k: 'frame', name: i === 0 ? 'Item' : `Item ${i + 1}`, dir: 'H', align: 'start', cross: 'start', width, gap: 'list/bullet/gap', padBottom: 'list/item-gap',
  children: [
    // The dot sits in a box one line tall, so it's centred on the first line.
    { k: 'frame', name: 'Bullet box', dir: 'H', align: 'center', cross: 'center', width: 'list/bullet/size', height: 'list/line-height', children: [
      { k: 'frame', name: 'Bullet', dir: 'H', size: 'list/bullet/size', radius: 999, fill: 'list/bullet/color', children: [] },
    ] },
    { k: 'text', name: i === 0 ? 'Point' : `Point ${i + 1}`, chars: text, ...type, stretch: true },
  ],
})

export const list = {
  id: 'list',
  name: 'List',
  page: 'List',
  storybook: 'Components / List',
  code: 'src/components/List/List.tsx',
  guidance: 'src/components/List/List.guidance.md',
  tokens: 'tokens/components/list.json',
  tokenPrefix: 'list.',
  status: 'Ready (decision 50)',
  axes: { Columns: COLUMNS },
  grid: { columns: 'Columns', rowGroups: null, rows: null },
  gridNote: `Shown ${WIDTH}px wide. Two columns from 768px for Highlights, one on phones; more columns for single words (amenities). Edit the Point layers; hide items you don't need.`,
  properties: [],
  variants: COLUMNS.map((Columns) => {
    const half = (WIDTH - 32) / 2 // list/column-gap between the columns
    const tree = Columns === 'One'
      ? { k: 'frame', dir: 'V', align: 'start', cross: 'start', width: WIDTH, children: POINTS.slice(0, 2).map((p, i) => item(p, i, WIDTH)) }
      : { k: 'frame', dir: 'H', align: 'start', cross: 'start', width: WIDTH, gap: 'list/column-gap', children: [0, 1].map((c) => ({
        k: 'frame', name: `Column ${c + 1}`, dir: 'V', align: 'start', cross: 'start', width: half,
        children: POINTS.slice(c * 2, c * 2 + 2).map((p, j) => item(p, c * 2 + j, half)),
      })) }
    return { props: { Columns }, tree }
  }),
  anatomy: [
    { part: 'Bullet', tokens: 'list/bullet/color (AcmeCo dark blue), list/bullet/size (8px), centred on the first line', layer: 'Bullet', at: 'left' },
    { part: 'Point', tokens: 'list/font-size, line-height, text (ink); list/bullet/gap after the dot', layer: 'Point', at: 'top' },
    { part: 'Spacing', tokens: 'list/item-gap under each point; list/column-gap between columns', layer: 'Item 2', at: 'bottom' },
  ],
  anatomyVariant: { Columns: 'Two' },
  parity: {
    story: 'components-list--states-matrix',
    order: COLUMNS.map((Columns) => ({ Columns })),
    parts: [
      { name: 'List', css: 'ul', layer: null, fields: ['w'] },
      { name: 'First item', css: 'li:first-child', layer: 'Item', fields: ['font', 'color', 'w', 'h', 'padB'] },
      { name: 'Third item', css: 'li:nth-child(3)', layer: 'Item 3', fields: ['startInset', 'topInset'], only: { Columns: 'Two' } },
    ],
  },
  specsBy: null,
  specs: () => ['list/font-size', 'list/line-height', 'list/bullet/size', 'list/bullet/gap', 'list/item-gap', 'list/column-gap'],
}
