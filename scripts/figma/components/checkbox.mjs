// Checkbox's Figma spec. Mirrors src/components/Checkbox/Checkbox.module.css rule for
// rule (tree format: see button.mjs). The focus ring sits on the box, not the label.

const VALUES = ['Unchecked', 'Checked', 'Indeterminate']
const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Invalid', 'Disabled']

function box(value, state) {
  if (state === 'Disabled') return { fill: 'checkbox/disabled/background', stroke: 'checkbox/disabled/border', icon: value === 'Unchecked' ? null : 'checkbox/disabled/icon' }
  if (value === 'Unchecked') {
    // Hover darkens the border (pressing a box means hovering it too); invalid turns it red
    // (only while unchecked).
    const stroke = state === 'Hover' || state === 'Pressed' ? 'checkbox/unchecked/border/hover' : state === 'Invalid' ? 'checkbox/invalid/border' : 'checkbox/unchecked/border/default'
    return { fill: 'checkbox/unchecked/background', stroke, icon: null }
  }
  const s = state === 'Hover' ? 'hover' : state === 'Pressed' ? 'pressed' : 'default'
  return { fill: `checkbox/checked/background/${s}`, stroke: `checkbox/checked/background/${s}`, icon: 'checkbox/checked/icon' }
}

export const checkbox = {
  id: 'checkbox',
  name: 'Checkbox',
  page: 'Checkbox',
  storybook: 'Components / Checkbox',
  code: 'src/components/Checkbox/Checkbox.tsx',
  guidance: 'src/components/Checkbox/Checkbox.guidance.md',
  tokens: 'tokens/components/checkbox.json',
  tokenPrefix: 'checkbox.',
  status: 'Ready',
  axes: { Value: VALUES, State: STATES },
  grid: { columns: 'Value', rowGroups: null, rows: 'State' },
  properties: [{ name: 'Label', type: 'TEXT', default: 'Office', layer: 'Label' }],
  variants: VALUES.flatMap((Value) => STATES.map((State) => {
    const b = box(Value, State)
    return {
      props: { Value, State },
      tree: {
        k: 'frame', dir: 'H', align: 'start', cross: 'start', gap: 'checkbox/gap', minHeight: 'checkbox/target',
        children: [
          {
            k: 'frame', name: 'Box', dir: 'H', size: 'checkbox/box/size', radius: 'checkbox/box/radius',
            fill: b.fill, stroke: b.stroke, strokeWidth: 'checkbox/box/border-width',
            focus: State === 'Focus' ? { ring: 'checkbox/focus-ring/color', width: 'checkbox/focus-ring/width', offset: 'checkbox/focus-ring/offset' } : null,
            // The CSS draws the mark with stroke-width 3 (in the icon's 24px units).
            children: b.icon ? [{ k: 'icon', name: 'Icon', icon: Value === 'Indeterminate' ? 'minus' : 'check', size: 'checkbox/box/icon-size', color: b.icon, strokeWeight: 3 }] : [],
          },
          { k: 'text', name: 'Label', chars: 'Office', fontSize: 'checkbox/label/font-size', lineHeight: 'checkbox/label/line-height', fill: State === 'Disabled' ? 'checkbox/disabled/label' : 'checkbox/label/color' },
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Box', tokens: 'checkbox/box/size, checkbox/box/radius, checkbox/box/border-width; border and fill by value and state', layer: 'Box', at: 'left' },
    { part: 'Mark', tokens: 'checkbox/box/icon-size, checkbox/checked/icon; check when checked, minus when indeterminate', layer: 'Icon', at: 'top' },
    { part: 'Label', tokens: 'checkbox/label/font-size, checkbox/label/line-height, checkbox/label/color; checkbox/gap from the box; the whole row is the 24px target (checkbox/target)', layer: 'Label', at: 'top' },
    { part: 'Focus ring', tokens: 'checkbox/focus-ring/color, 2px, 2px away from the box', layer: 'Focus ring', at: 'bottom' },
  ],
  anatomyVariant: { Value: 'Checked', State: 'Focus' },
  // Parity with the code: the States matrix (rows = states, columns = values).
  parity: {
    story: 'components-checkbox--states-matrix',
    order: STATES.flatMap((State) => VALUES.map((Value) => ({ Value, State }))),
    parts: [
      { name: 'Row', css: 'label', layer: null, fields: ['gap', 'h'] },
      { name: 'Box', css: "[class*='_box_']", layer: 'Box', fields: ['bg', 'border', 'radius', 'w', 'h', 'ring'] },
      { name: 'Mark', css: "[class*='_box_'] svg", layer: 'Icon', fields: ['icon'] },
      { name: 'Label', css: "[class*='_label_']", layer: 'Label', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['checkbox/box/size', 'checkbox/box/radius', 'checkbox/box/border-width', 'checkbox/box/icon-size', 'checkbox/target', 'checkbox/gap', 'checkbox/group-gap', 'checkbox/label/font-size', 'checkbox/label/line-height'],
}
