// Table's Figma spec. Mirrors src/components/Table/Table.module.css (tree format: see
// button.mjs). A browser sizes table columns from their content; the column widths here are
// the code's at 880px (the States matrix), so edit them with the content. Every cell carries
// its own lines (under it; the first also left, the last also right), as the CSS does.

const WIDTH = 880
const COLUMNS = [['Space', 203.53], ['Size', 132.05], ['Rental Rate', 167.75], ['Space Use', 134.12], ['Available', 123.18], ['Details', 119.37]]
const ROWS = [
  ['Floor 2, Suite 200', '18,000 SF', '$11.25 /SF/YR', 'Industrial', 'Now'],
  ['Floor 3, Suite 250', '29,500 SF', '$12.25 /SF/YR', 'Industrial', '30 days'],
  ['Floor 4, Suite 300', '41,000 SF', '$11.25 /SF/YR', 'Industrial', '60 days'],
]
const STATES = ['Default', 'Hover']
const type = { fontSize: 'table/font-size', lineHeight: 'table/line-height', fontWeight: 'table/font-weight', fill: 'table/text' }
const last = COLUMNS.length - 1
const border = 'table/row/border-width'

const headerRow = {
  k: 'frame', name: 'Header', dir: 'H', align: 'start', cross: 'start',
  children: COLUMNS.map(([label, w], i) => ({
    k: 'frame', name: `Column ${label}`, dir: 'H', align: 'start', width: w, fillHeight: true, padX: 'table/padding-inline', padY: 'table/padding-block',
    fill: 'table/header/background',
    radii: i === 0 ? ['table/header/radius', 0, 0, 'table/header/radius'] : i === last ? [0, 'table/header/radius', 'table/header/radius', 0] : undefined,
    // The Details heading is for screen readers only (hidden from sight in the code).
    children: i === last ? [] : [{ k: 'text', name: `Heading ${label}`, chars: label, ...type }],
  })),
}
const bodyRow = (cells, r, hovered) => ({
  k: 'frame', name: `Row ${r + 1}`, dir: 'H', align: 'start', cross: 'start',
  fill: hovered ? 'table/row/background/hover' : 'table/row/background/default',
  children: COLUMNS.map(([label, w], i) => ({
    k: 'frame', name: `Cell ${label}`, dir: 'H', align: 'start', width: w, fillHeight: true, padX: 'table/padding-inline',
    padY: i === last ? 'table/padding-block-action' : 'table/padding-block',
    stroke: 'table/row/border', strokeWidth: border,
    strokeSides: { bottom: border, left: i === 0 ? border : 0, right: i === last ? border : 0 },
    children: i === last
      ? [{ k: 'instance', name: 'Details', set: 'Button', props: { Variant: 'tertiary', Size: 'sm', State: 'Default' }, text: { Label: 'Details' } }]
      : [{ k: 'text', name: `Value ${label}`, chars: cells[i], ...type }],
  })),
})

export const table = {
  id: 'table',
  name: 'Table',
  page: 'Table',
  storybook: 'Components / Table',
  code: 'src/components/Table/Table.tsx',
  guidance: 'src/components/Table/Table.guidance.md',
  tokens: 'tokens/components/table.json',
  tokenPrefix: 'table.',
  status: 'Ready (decision 47)',
  uses: ['Button'],
  axes: { State: STATES },
  grid: { columns: 'State', rowGroups: null, rows: null },
  gridNote: `Shown ${WIDTH}px wide with three spaces. Hover: the first row as the pointer rests on it (rows open the space's details). The column widths follow the content, as a browser's do: change them with the text. Not for phones: there each space is a Card with a Fact list.`,
  properties: [],
  variants: STATES.map((State) => ({
    props: { State },
    tree: {
      k: 'frame', dir: 'V', align: 'start', cross: 'start', width: WIDTH,
      children: [headerRow, ...ROWS.map((cells, r) => bodyRow(cells, r, State === 'Hover' && r === 0))],
    },
  })),
  anatomy: [
    { part: 'Header bar', tokens: 'table/header/background (#ededed), table/header/radius (4px) at the ends, table/padding-block, table/padding-inline', layer: 'Header', at: 'left' },
    { part: 'Row header', tokens: 'the Space column names each row for screen readers', layer: 'Value Space', at: 'top' },
    { part: 'Cell', tokens: 'table/font-size, line-height, text (ink); 1px table/row/border under each cell and at the row\'s ends', layer: 'Cell Size', at: 'bottom' },
    { part: 'Details', tokens: 'a Button (tertiary, sm) opening the space in a Dialog; its cell has table/padding-block-action so the row stays 44px', layer: 'Details', at: 'top' },
  ],
  anatomyVariant: { State: 'Default' },
  parity: {
    story: 'components-table--states-matrix',
    // The matrix's own cell (the Table inside has table cells too).
    cells: '#storybook-root table:not([role=grid]) > tbody > tr > td',
    order: [{ State: 'Default' }],
    parts: [
      { name: 'Table', css: '[role=grid]', layer: null, fields: ['w'] },
      { name: 'First column', css: 'thead th:first-child', layer: 'Column Space', fields: ['bg', 'radius', 'padT', 'padL', 'w', 'h'] },
      { name: 'Third column', css: 'thead th:nth-child(3)', layer: 'Column Rental Rate', fields: ['bg', 'startInset', 'w'] },
      { name: 'Column heading', css: 'thead th:nth-child(3)', layer: 'Heading Rental Rate', fields: ['font', 'color'] },
      { name: 'Row', css: '[role=grid] > tbody > tr:first-child', layer: 'Row 1', fields: ['bg', 'h'] },
      { name: 'Cell', css: '[role=grid] > tbody > tr:first-child td:nth-child(2)', layer: 'Cell Size', fields: ['borderBottom', 'padT', 'padL', 'startInset', 'w'] },
      { name: 'First cell', css: '[role=grid] > tbody > tr:first-child > :first-child', layer: 'Cell Space', fields: ['borderLeft', 'borderBottom'] },
      { name: 'Value', css: '[role=grid] > tbody > tr:first-child td:nth-child(2)', layer: 'Value Size', fields: ['font', 'color'] },
      { name: 'Details cell', css: '[role=grid] > tbody > tr:first-child > :last-child', layer: 'Cell Details', fields: ['padT', 'startInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['table/font-size', 'table/line-height', 'table/padding-block', 'table/padding-block-action', 'table/padding-inline', 'table/header/radius', 'table/row/border-width'],
}
