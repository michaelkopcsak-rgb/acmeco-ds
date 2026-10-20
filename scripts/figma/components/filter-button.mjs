// FilterButton's Figma spec. Mirrors src/components/FilterButton/FilterButton.module.css
// rule for rule (tree format: see button.mjs). The search bar's pills: a filter that opens
// a panel (Menu), one that's set and clears in place (Set), All Filters with its count,
// and the phone's round filter button (Icon only). Desktop sizes; phones use the same
// 40px pills without chevrons.

const KINDS = ['Menu', 'Set', 'All filters', 'Icon only']
const STATES = ['Default', 'Hover', 'Focus']
const focus = { ring: 'filter/focus-ring/color', width: 'filter/focus-ring/width', offset: 'filter/focus-ring/offset' }
const label = (chars) => ({ k: 'text', name: 'Label', chars, fontSize: 'filter/font-size', lineHeight: 'filter/line-height', fontWeight: 'filter/font-weight', fill: 'filter/text' })
const count = (abs) => ({
  k: 'frame', name: 'Count', dir: 'H', size: 'filter/count/size', radius: 'filter/count/size', fill: 'filter/count/background', abs,
  children: [{ k: 'text', name: 'Count value', chars: '1', fontSize: 'filter/count/font-size', lineHeight: 'filter/line-height', fill: 'filter/count/text' }],
})
const sliders = { k: 'icon', name: 'Icon', icon: 'sliders-horizontal', size: 'filter/icon-size', color: 'filter/text' }

export const filterButton = {
  id: 'filter-button',
  name: 'Filter button',
  page: 'Filter button',
  storybook: 'Components / FilterButton',
  code: 'src/components/FilterButton/FilterButton.tsx',
  guidance: 'src/components/FilterButton/FilterButton.guidance.md',
  tokens: 'tokens/components/filter.json',
  tokenPrefix: 'filter.',
  status: 'Ready (decision 40; 40px since decision 45)',
  axes: { Kind: KINDS, State: STATES },
  grid: { columns: 'State', rowGroups: null, rows: 'Kind' },
  gridNote: 'Edit the Label (and Count value) layers in an instance. Menu: opens a panel of choices. Set: its value replaces the name ("Multiple" for two or more), grey with an ink edge, and a 24px Clear button inside its end (a set pill shows no hover change, as in the code). All filters: icon, name and count. Icon only: the phone\'s round filter button, the count over its edge.',
  properties: [],
  variants: KINDS.flatMap((Kind) => STATES.map((State) => {
    const set = Kind === 'Set', hover = State === 'Hover' && !set
    const base = {
      k: 'frame', dir: 'H', height: 'filter/height', gap: 'filter/gap', radius: 'filter/radius',
      fill: set ? 'filter/background-active' : hover ? 'filter/background-hover' : 'filter/background',
      stroke: set ? 'filter/border-active' : hover ? 'filter/border-hover' : 'filter/border', strokeWidth: 'filter/border-width',
      focus: State === 'Focus' ? focus : null,
    }
    const tree = {
      Menu: { ...base, padX: 'filter/padding-x', children: [label('Rent'), { k: 'icon', name: 'Chevron', icon: 'chevron-down', size: 'filter/icon-size', color: 'filter/text' }] },
      Set: { ...base, padLeft: 'filter/padding-x', padRight: { add: ['filter/padding-x', 'filter/clear/size'] }, children: [
        label('Multiple'),
        { k: 'frame', name: 'Clear', dir: 'H', size: 'filter/clear/size', radius: 'filter/clear/size', abs: { right: 'filter/gap', centerY: true },
          children: [{ k: 'icon', name: 'Clear icon', icon: 'close', size: 'filter/clear/icon-size', color: 'filter/text' }] },
      ] },
      'All filters': { ...base, padX: 'filter/padding-x', children: [sliders, label('All Filters'), count()] },
      'Icon only': { ...base, size: 'filter/height', padX: 0, clip: false, children: [sliders, count({ top: 'filter/count/inset', right: 'filter/count/inset' })] },
    }[Kind]
    return { props: { Kind, State }, tree }
  })),
  anatomy: [
    { part: 'Pill', tokens: 'filter/height (40px), filter/padding-x, filter/radius (pill), 1px filter/border on filter/background; hover filter/background-hover, filter/border-hover', at: 'left' },
    { part: 'Label', tokens: 'filter/font-size, filter/line-height, filter/text', layer: 'Label', at: 'top' },
    { part: 'Set', tokens: 'filter/background-active, filter/border-active; the Clear button (filter/clear/size, a 24px target) sits filter/gap inside the end (Kind: Set)', at: 'right' },
    { part: 'Count', tokens: 'filter/count/size, filter/count/background, filter/count/text, filter/count/font-size; on the round button it overlaps the edge by filter/count/inset', layer: 'Count', at: 'right' },
    { part: 'Focus ring', tokens: 'filter/focus-ring/color, 2px, 2px away', at: 'right' },
  ],
  anatomyVariant: { Kind: 'All filters', State: 'Default' },
  parity: {
    story: 'components-filterbutton--states-matrix',
    order: KINDS.flatMap((Kind) => STATES.map((State) => ({ Kind, State }))),
    parts: [
      { name: 'Pill', css: 'button', layer: null, fields: ['bg', 'border', 'radius', 'h', 'padL', 'gap', 'ring'] },
      { name: 'Label', css: 'button > span:not([aria-hidden])', layer: 'Label', fields: ['font', 'color'], only: { Kind: ['Menu', 'Set', 'All filters'] } },
      { name: 'Chevron', css: "button:not([aria-label^='Clear']) > svg", layer: 'Chevron', fields: ['icon'] },
      { name: 'Icon', css: 'button > span[aria-hidden] svg', layer: 'Icon', fields: ['icon'] },
      { name: 'Count', css: "[class*='_count_']", layer: 'Count', fields: ['bg', 'w', 'h', 'radius'] },
      { name: 'Clear', css: "button[aria-label^='Clear']", layer: 'Clear', fields: ['w', 'h', 'radius', 'endInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['filter/height', 'filter/padding-x', 'filter/gap', 'filter/radius', 'filter/font-size', 'filter/icon-size', 'filter/count/size', 'filter/clear/size'],
}
