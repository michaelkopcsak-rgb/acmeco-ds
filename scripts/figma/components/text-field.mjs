// TextField's Figma spec. Mirrors src/components/Field/Field.module.css (the shared
// field styles) rule for rule (tree format: see button.mjs). Shown at a representative
// 280px; in use a field fills its container (so width isn't part of the parity check).

const SIZES = ['md', 'lg']
const STATES = ['Default', 'Hover', 'Focus', 'Filled', 'Invalid', 'Disabled', 'Read-only']

function control(state) {
  const stroke = { Hover: 'field/control/border/hover', Invalid: 'field/control/border/invalid', Disabled: 'field/control/border/disabled' }[state] ?? 'field/control/border/default'
  const fill = { Disabled: 'field/control/background/disabled', 'Read-only': 'field/control/background/read-only' }[state] ?? 'field/control/background/default'
  // Invalid: red and 2px, the second pixel inside the first, so the text doesn't move (the CSS
  // adds an inset shadow to the 1px border).
  return { stroke, fill, insetBorder: state === 'Invalid' ? { color: 'field/control/border/invalid', total: 'field/control/border-width-invalid' } : null }
}
// The text in the box: a placeholder until there's a value (as in the States matrix).
function value(state) {
  if (state === 'Default' || state === 'Hover') return { chars: 'name@company.com', fill: 'field/control/text/placeholder' }
  return { chars: state === 'Invalid' ? 'pat@' : 'pat@example.com', fill: state === 'Disabled' ? 'field/control/text/disabled' : 'field/control/text/default' }
}

export const textField = {
  id: 'text-field',
  name: 'Text field',
  page: 'Text field',
  storybook: 'Components / TextField',
  code: 'src/components/TextField/TextField.tsx',
  guidance: 'src/components/TextField/TextField.guidance.md',
  tokens: 'tokens/components/field.json',
  tokenPrefix: 'field.',
  status: 'Ready',
  axes: { Size: SIZES, State: STATES },
  grid: { columns: 'Size', rowGroups: null, rows: 'State' },
  gridNote: 'Shown 280px wide; in use a field fills its container. Hint, counter, multiline and the pill hero shape are in Storybook.',
  properties: [
    { name: 'Label', type: 'TEXT', default: 'Email', layer: 'Label' },
    { name: 'Error message', type: 'TEXT', default: 'Enter an email address like name@company.com', layer: 'Error message' },
  ],
  variants: SIZES.flatMap((Size) => STATES.map((State) => {
    const c = control(State), v = value(State)
    return {
      props: { Size, State },
      tree: {
        k: 'frame', dir: 'V', width: 280, align: 'start', cross: 'start', gap: 'field/gap',
        children: [
          { k: 'text', name: 'Label', chars: 'Email', fontSize: 'field/label/font-size', lineHeight: 'field/label/line-height', fontWeight: 'field/label/font-weight', fill: 'field/label/color', stretch: true },
          {
            k: 'frame', name: 'Control', dir: 'H', align: 'start', stretch: true,
            height: `field/control/${Size}/height`, padX: `field/control/${Size}/padding-x`, gap: 'field/control/gap',
            radius: 'field/control/radius', fill: c.fill, stroke: c.stroke, strokeWidth: 'field/control/border-width', insetBorder: c.insetBorder,
            focus: State === 'Focus' ? { ring: 'field/control/focus-ring/color', width: 'field/control/focus-ring/width', offset: 'field/control/focus-ring/offset' } : null,
            children: [
              { k: 'text', name: 'Value', chars: v.chars, fontSize: `field/control/${Size}/font-size`, lineHeight: `field/control/${Size}/line-height`, fill: v.fill, stretch: true },
            ],
          },
          ...(State === 'Invalid' ? [{
            k: 'frame', name: 'Error', dir: 'H', align: 'start', cross: 'start', gap: 'field/gap', stretch: true,
            children: [
              { k: 'icon', name: 'Error icon', icon: 'circle-alert', size: 'field/error/icon-size', color: 'field/error/color' },
              { k: 'text', name: 'Error message', chars: 'Enter an email address like name@company.com', fontSize: 'field/hint/font-size', lineHeight: 'field/hint/line-height', fill: 'field/error/color', stretch: true },
            ],
          }] : []),
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Label', tokens: 'field/label/font-size, field/label/line-height, field/label/font-weight (600), field/label/color; field/gap above the control', layer: 'Label', at: 'left' },
    { part: 'Control', tokens: 'field/control/{size}/height, field/control/{size}/padding-x, field/control/radius, 1px field/control/border/* (2px and red when invalid); text field/control/{size}/font-size, placeholder field/control/text/placeholder; focus ring field/control/focus-ring/*', layer: 'Control', at: 'end' },
    { part: 'Error', tokens: 'field/error/icon-size, field/error/color, field/hint/font-size, field/hint/line-height: an icon and words, so it is not colour alone', layer: 'Error', at: 'left' },
  ],
  anatomyVariant: { Size: 'lg', State: 'Invalid' },
  // Parity with the code: the States matrix (rows = states, columns = sizes).
  parity: {
    story: 'components-textfield--states-matrix',
    order: STATES.flatMap((State) => SIZES.map((Size) => ({ Size, State }))),
    parts: [
      { name: 'Field', css: "[class*='_field_']", layer: null, fields: ['gap'] },
      { name: 'Label', css: 'label', layer: 'Label', fields: ['font', 'color'] },
      { name: 'Control', css: "[data-part='control']", layer: 'Control', fields: ['bg', 'border', 'radius', 'h', 'padL', 'padR', 'gap', 'ring'] },
      { name: 'Value', css: 'input', layer: 'Value', fields: ['font', 'color', 'startInset'] },
      { name: 'Error icon', css: "[class*='_error_'] svg", layer: 'Error icon', fields: ['icon'] },
      { name: 'Error message', css: "[class*='_error_'] span", layer: 'Error message', fields: ['font', 'color'] },
    ],
  },
  specsBy: 'Size',
  specs: (size) => [`field/control/${size}/height`, `field/control/${size}/padding-x`, `field/control/${size}/font-size`, `field/control/${size}/line-height`, 'field/control/radius', 'field/control/border-width', 'field/control/border-width-invalid', 'field/gap'],
}
