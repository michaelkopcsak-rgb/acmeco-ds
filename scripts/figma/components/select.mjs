// Select's Figma spec: the trigger in every state. Mirrors
// src/components/Select/Select.module.css rule for rule (tree format: see button.mjs).
// The field trigger is TextField's box; the compact trigger is a 32px pill for sort and
// filters, with one size. The open list (popover and options) is its own set: select-list.mjs.

const STATES = ['Placeholder', 'Hover', 'Focus', 'Filled', 'Invalid', 'Disabled']
const COMBOS = [['Field', 'md'], ['Field', 'lg'], ['Compact', 'md']]

function trigger(state) {
  const stroke = { Hover: 'field/control/border/hover', Invalid: 'field/control/border/invalid', Disabled: 'field/control/border/disabled' }[state] ?? 'field/control/border/default'
  return {
    stroke, strokeWidth: 'field/control/border-width',
    // Invalid: a second pixel of red inside the border (the CSS inset shadow), so nothing moves.
    insetBorder: state === 'Invalid' ? { color: 'field/control/border/invalid', total: 'field/control/border-width-invalid' } : null,
    fill: state === 'Disabled' ? 'field/control/background/disabled' : 'field/control/background/default',
    text: state === 'Disabled' ? 'field/control/text/disabled' : 'field/control/text/default',
  }
}
// The error message below: as wide as the field, or as wide as its words under a compact trigger.
const error = (compact) => ({
  k: 'frame', name: 'Error', dir: 'H', align: 'start', cross: 'start', gap: 'field/gap', stretch: !compact,
  children: [
    { k: 'icon', name: 'Error icon', icon: 'circle-alert', size: 'field/error/icon-size', color: 'field/error/color' },
    { k: 'text', name: 'Error message', chars: 'Choose a property type', fontSize: 'field/hint/font-size', lineHeight: 'field/hint/line-height', fill: 'field/error/color' },
  ],
})

export const select = {
  id: 'select',
  name: 'Select',
  page: 'Select',
  storybook: 'Components / Select',
  code: 'src/components/Select/Select.tsx',
  guidance: 'src/components/Select/Select.guidance.md',
  tokens: 'tokens/components/select.json',
  tokenPrefix: 'select.',
  status: 'Ready',
  axes: { Appearance: ['Field', 'Compact'], Size: ['md', 'lg'], State: STATES },
  grid: { columns: 'Size', rowGroups: 'Appearance', rows: 'State' },
  gridNote: 'Compact has one size (32px) and shows its label until a choice is made; it sits under md. Field is shown at a representative 240px; in use it fills its container. The list that opens is on the Select list page.',
  properties: [
    { name: 'Label', type: 'TEXT', default: 'Property type', layer: 'Label' },
    { name: 'Show label', type: 'BOOLEAN', default: true, layer: 'Label' },
  ],
  variants: COMBOS.flatMap(([Appearance, Size]) => STATES.map((State) => {
    const t = trigger(State)
    const compact = Appearance === 'Compact'
    const filled = State === 'Filled'
    const focus = State === 'Focus' ? { ring: 'field/control/focus-ring/color', width: 'field/control/focus-ring/width', offset: 'field/control/focus-ring/offset' } : null
    const box = compact
      ? {
          k: 'frame', name: 'Trigger', dir: 'H', align: 'between', height: 'select/compact/height', padX: 'select/compact/padding-x', gap: 'field/control/gap',
          radius: 'select/compact/radius', fill: t.fill, stroke: t.stroke, strokeWidth: t.strokeWidth, insetBorder: t.insetBorder, focus,
          children: [
            // Before a choice, the compact trigger shows its label (ink, it's the name, not a hint).
            { k: 'text', name: 'Value', chars: filled ? 'Office' : 'Property type', fontSize: 'select/compact/font-size', lineHeight: 'select/compact/line-height', fill: t.text },
            { k: 'icon', name: 'Chevron', icon: 'chevron-down', size: 'select/compact/chevron-size', color: t.text },
          ],
        }
      : {
          k: 'frame', name: 'Trigger', dir: 'H', align: 'between', stretch: true, height: `field/control/${Size}/height`, padX: `field/control/${Size}/padding-x`, gap: 'field/control/gap',
          radius: 'field/control/radius', fill: t.fill, stroke: t.stroke, strokeWidth: t.strokeWidth, insetBorder: t.insetBorder, focus,
          children: [
            { k: 'text', name: 'Value', chars: filled ? 'Office' : 'Select a property type', fontSize: `field/control/${Size}/font-size`, lineHeight: `field/control/${Size}/line-height`, fill: filled || State === 'Disabled' ? t.text : 'field/control/text/placeholder', stretch: true },
            { k: 'icon', name: 'Chevron', icon: 'chevron-down', size: 'select/chevron-size', color: t.text },
          ],
        }
    return {
      props: { Appearance, Size, State },
      tree: {
        k: 'frame', dir: 'V', width: compact ? undefined : 240, align: 'start', cross: 'start', gap: 'field/gap',
        children: [
          ...(compact ? [] : [{ k: 'text', name: 'Label', chars: 'Property type', fontSize: 'field/label/font-size', lineHeight: 'field/label/line-height', fontWeight: 'field/label/font-weight', fill: 'field/label/color', stretch: true }]),
          box,
          ...(State === 'Invalid' ? [error(compact)] : []),
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Label', tokens: 'the field label (see Text field); a compact trigger is named by its label instead', layer: 'Label', at: 'left' },
    { part: 'Trigger', tokens: 'field: the shared field control (field/control/*); compact: select/compact/height, padding-x, radius (pill), font-size', layer: 'Trigger', at: 'left' },
    { part: 'Value', tokens: 'the choice, or the placeholder in field/control/text/placeholder', layer: 'Value', at: 'top' },
    { part: 'Chevron', tokens: 'select/chevron-size (compact: select/compact/chevron-size); turns over while open', layer: 'Chevron', at: 'top' },
    { part: 'Focus ring', tokens: 'field/control/focus-ring/*, 2px, 2px away', at: 'right' },
  ],
  anatomyVariant: { Appearance: 'Field', Size: 'lg', State: 'Focus' },
  // Parity with the code: the States matrix (rows = states, columns = field md, field lg,
  // compact). Its field labels are hidden there, so the label isn't compared.
  parity: {
    story: 'components-select--states-matrix',
    order: STATES.flatMap((State) => COMBOS.map(([Appearance, Size]) => ({ Appearance, Size, State }))),
    parts: [
      { name: 'Trigger', css: 'button', layer: 'Trigger', fields: ['bg', 'border', 'radius', 'h', 'padL', 'padR', 'gap', 'ring'] },
      { name: 'Value', css: "[class*='_value_']", layer: 'Value', fields: ['font', 'color', 'startInset'] },
      { name: 'Chevron', css: 'button svg', layer: 'Chevron', fields: ['icon'] },
      { name: 'Error icon', css: "[class*='_error_'] svg", layer: 'Error icon', fields: ['icon'] },
      { name: 'Error message', css: "[class*='_error_'] span", layer: 'Error message', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['field/control/md/height', 'field/control/lg/height', 'select/chevron-size', 'select/compact/height', 'select/compact/padding-x', 'select/compact/radius', 'select/compact/font-size', 'select/compact/line-height', 'select/compact/chevron-size'],
}
