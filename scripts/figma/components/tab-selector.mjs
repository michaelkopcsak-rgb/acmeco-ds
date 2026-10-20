// TabSelector's Figma spec: one tab, in every state. Mirrors
// src/components/TabSelector/TabSelector.module.css rule for rule (tree format: see
// button.mjs). Tabs sit in a row on the panel's top line; the selected one opens into it.

const SELECTED = ['No', 'Yes']
const STATES = ['Default', 'Hover', 'Focus', 'Disabled']

function look(selected, state) {
  const disabled = state === 'Disabled'
  // Later rules win, as in the CSS: hover, then selected, then disabled (a selected
  // disabled tab keeps its white background).
  let fill = state === 'Hover' ? 'tab-selector/tab/background-hover' : 'tab-selector/tab/background'
  if (selected) fill = 'tab-selector/selected/background'
  else if (disabled) fill = 'tab-selector/disabled/background'
  const stroke = disabled ? 'tab-selector/disabled/border' : selected ? 'tab-selector/selected/border' : 'tab-selector/tab/border'
  return { fill, stroke, text: disabled ? 'tab-selector/disabled/text' : 'tab-selector/tab/text', weight: selected ? 'tab-selector/selected/font-weight' : 'tab-selector/font-weight' }
}

export const tabSelector = {
  id: 'tab-selector',
  name: 'Tab selector',
  page: 'Tab selector',
  storybook: 'Components / TabSelector',
  code: 'src/components/TabSelector/TabSelector.tsx',
  guidance: 'src/components/TabSelector/TabSelector.guidance.md',
  tokens: 'tokens/components/tab-selector.json',
  tokenPrefix: 'tab-selector.',
  status: 'Ready',
  axes: { Selected: SELECTED, State: STATES },
  grid: { columns: 'Selected', rowGroups: null, rows: 'State' },
  gridNote: 'One tab per option: place two to four in a row on the panel\'s top line (tab-selector/line, 1px). The selected tab is white and reaches 1px over the line, so it opens into the panel below.',
  properties: [{ name: 'Label', type: 'TEXT', default: 'For Lease', layer: 'Label' }],
  variants: SELECTED.flatMap((Selected) => STATES.map((State) => {
    const selected = Selected === 'Yes'
    const l = look(selected, State)
    return {
      props: { Selected, State },
      tree: {
        k: 'frame', dir: 'H', height: 'tab-selector/height', padX: 'tab-selector/padding-x',
        // The selected tab's 1px of bottom padding is the 1px it reaches over the line.
        padBottom: selected ? 'tab-selector/border-width' : undefined,
        radii: ['tab-selector/radius', 'tab-selector/radius', 0, 0], fill: l.fill,
        stroke: l.stroke, strokeWidth: 'tab-selector/border-width',
        // Top and sides only: the bottom edge is the panel's line.
        strokeSides: { top: 'tab-selector/border-width', right: 'tab-selector/border-width', bottom: 0, left: 'tab-selector/border-width' },
        focus: State === 'Focus' ? { ring: 'tab-selector/focus-ring/color', width: 'tab-selector/focus-ring/width', offset: 'tab-selector/focus-ring/offset' } : null,
        children: [
          { k: 'text', name: 'Label', chars: 'For Lease', fontSize: 'tab-selector/font-size', lineHeight: 'tab-selector/line-height', fontWeight: l.weight, fill: l.text },
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Tab', tokens: 'tab-selector/height, tab-selector/padding-x, tab-selector/radius (top corners), 1px outline on top and sides; grey, white when selected', at: 'left' },
    { part: 'Label', tokens: 'tab-selector/font-size, tab-selector/line-height; semibold when selected (tab-selector/selected/font-weight)', layer: 'Label', at: 'top' },
    { part: 'Focus ring', tokens: 'tab-selector/focus-ring/color, 2px, 2px away', at: 'right' },
  ],
  anatomyVariant: { Selected: 'No', State: 'Focus' },
  // Parity with the code: each row of the States matrix is a whole selector (For Sale
  // selected, For Lease in the row's state, Auctions at rest).
  parity: {
    story: 'components-tabselector--states-matrix',
    cells: "#storybook-root [class*='_row_'] > label",
    order: STATES.flatMap((State) => {
      const rest = State === 'Disabled' ? 'Disabled' : 'Default'
      return [{ Selected: 'Yes', State: rest }, { Selected: 'No', State }, { Selected: 'No', State: rest }]
    }),
    parts: [
      { name: 'Tab', css: ':scope', layer: null, fields: ['bg', 'borderTop', 'borderBottom', 'radius', 'h', 'padL', 'padR', 'padB', 'ring'] },
      { name: 'Label', css: ':scope', layer: 'Label', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['tab-selector/height', 'tab-selector/padding-x', 'tab-selector/gap', 'tab-selector/radius', 'tab-selector/border-width', 'tab-selector/font-size', 'tab-selector/line-height'],
}
