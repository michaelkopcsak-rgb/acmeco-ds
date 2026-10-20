// Button's Figma spec: its variants as small layer trees bound to Component
// variables. Mirrors src/components/Button/Button.module.css rule for rule; when the
// CSS changes, this changes with it (the parity check in phase 5 compares them).
//
// The tree format every spec uses (scripts/figma/figma-component.js draws it):
//   frame   { name, dir: 'H'|'V', align, cross ('start'|'center'|'end'|'between'), width,
//             height, size (both), minHeight, padX, padLeft, padRight, padY, gap, radius,
//             fill, stroke ('transparent' keeps a CSS transparent border's space),
//             strokeWidth, insetBorder { color, total } (a CSS inset-shadow border),
//             focus { ring, width, offset } or a list of rings, stretch, children }
//   text    { name, chars, fontSize, lineHeight, fontWeight, fill, underline { thickness,
//             offset }, transparent, stretch }
//   icon    { name, icon, size, color, iconFill, strokeWeight (in the 24px drawing's
//             units; default 2), boolProp, transparent }
//   spinner { size, color, stroke }   (centred on top of the content)
// transparent: kept in place but invisible, as the CSS does while loading (opacity 0).
// stretch: fill the parent's width. A value is a variable name ("button/md/height"; the
// Component collection unless prefixed Semantic/ or Primitives/), a number the CSS also
// hard-codes, or { sub: [a, b] } for a CSS calc(a - b).

const VARIANTS = ['primary', 'secondary', 'tertiary']
const SIZES = ['sm', 'md', 'lg']
const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Loading']

// Colours per variant and state, as Button.module.css sets them. null = no fill / no outline.
function colours(variant, state) {
  const s = state === 'Hover' ? 'hover' : state === 'Pressed' ? 'pressed' : 'default'
  if (state === 'Disabled') {
    return variant === 'tertiary'
      ? { fill: null, stroke: null, text: 'button/disabled/text' } // .tertiary[data-disabled]
      : { fill: 'button/disabled/background', stroke: 'button/disabled/border', text: 'button/disabled/text' }
  }
  if (variant === 'primary') return { fill: `button/primary/background/${s}`, stroke: null, text: 'button/primary/text/default' }
  if (variant === 'secondary') return { fill: `button/secondary/background/${s}`, stroke: `button/secondary/border/${s}`, text: `button/secondary/text/${s}` }
  return { fill: s === 'default' ? null : `button/tertiary/background/${s}`, stroke: null, text: 'button/tertiary/text/default' }
}

export const button = {
  id: 'button',
  name: 'Button',
  page: 'Button',
  storybook: 'Components / Button',
  code: 'src/components/Button/Button.tsx',
  guidance: 'src/components/Button/Button.guidance.md',
  tokens: 'tokens/components/button.json',
  tokenPrefix: 'button.',
  status: 'Ready',
  axes: { Variant: VARIANTS, Size: SIZES, State: STATES },
  // Grid: columns = sizes; rows grouped by variant, one row per state (the agreed template).
  grid: { columns: 'Size', rowGroups: 'Variant', rows: 'State' },
  properties: [
    { name: 'Label', type: 'TEXT', default: 'Contact broker', layer: 'Label' },
    { name: 'Show icon', type: 'BOOLEAN', default: false, layer: 'Icon' },
    { name: 'Icon', type: 'INSTANCE_SWAP', default: 'phone', layer: 'Icon' },
  ],
  variants: VARIANTS.flatMap((Variant) => SIZES.flatMap((Size) => STATES.map((State) => {
    const c = colours(Variant, State)
    const loading = State === 'Loading'
    return {
      props: { Variant, Size, State },
      tree: {
        k: 'frame', dir: 'H',
        height: `button/${Size}/height`, padX: `button/${Size}/padding-x`, gap: 'button/gap',
        radius: 'button/radius', fill: c.fill,
        // Every button has a 1px outline (transparent unless the variant draws one), so sizes match.
        stroke: c.stroke ?? 'transparent', strokeWidth: 'button/border-width',
        focus: State === 'Focus' ? { ring: 'button/focus-ring/color', width: 'button/focus-ring/width', offset: 'button/focus-ring/offset' } : null,
        children: [
          { k: 'icon', name: 'Icon', icon: 'phone', size: `button/${Size}/icon-size`, color: c.text, boolProp: 'Show icon', swapProp: 'Icon', transparent: loading },
          { k: 'text', name: 'Label', chars: 'Contact broker', textProp: 'Label', fontSize: `button/${Size}/font-size`, lineHeight: `button/${Size}/line-height`, fontWeight: 'button/font-weight', fill: c.text, transparent: loading },
          ...(loading ? [{ k: 'spinner', name: 'Spinner', size: `button/${Size}/icon-size`, color: c.text, stroke: 'button/spinner-width' }] : []),
        ],
      },
    }
  }))),
  // Anatomy callouts: the part, its tokens, the layer it points at (none = the container) and where.
  anatomy: [
    { part: 'Container', tokens: 'button/radius, button/{size}/height, button/{size}/padding-x; fill and outline by variant and state', at: 'left' },
    { part: 'Icon (optional)', tokens: 'button/{size}/icon-size; a registry icon, swapped with the Icon property', layer: 'Icon', at: 'top' },
    { part: 'Label', tokens: 'button/{size}/font-size, button/{size}/line-height, button/font-weight', layer: 'Label', at: 'top' },
    { part: 'Focus ring', tokens: 'button/focus-ring/color, 2px, 2px away from the button (button/focus-ring/offset)', at: 'right' },
  ],
  // Parity with the code: the States matrix (rows = variant × state, columns = sizes).
  parity: {
    story: 'components-button--states-matrix',
    order: VARIANTS.flatMap((Variant) => STATES.flatMap((State) => SIZES.map((Size) => ({ Variant, Size, State })))),
    parts: [
      { name: 'Container', css: 'button', layer: null, fields: ['bg', 'border', 'radius', 'w', 'h', 'padL', 'padR', 'gap', 'ring'] },
      { name: 'Icon', css: "[class*='_icon_']", layer: 'Icon', fields: [] },
      { name: 'Label', css: "[class*='_label_']", layer: 'Label', fields: ['font', 'color', 'opacity', 'startInset'] },
      { name: 'Spinner', css: "[class*='_spinner_']", layer: 'Spinner', fields: ['w', 'h'] },
    ],
  },
  specsBy: 'Size',
  specs: (size) => [`button/${size}/height`, `button/${size}/padding-x`, `button/${size}/font-size`, `button/${size}/line-height`, `button/${size}/icon-size`],
}
