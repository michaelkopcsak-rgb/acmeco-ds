// IconButton's Figma spec. Mirrors src/components/IconButton/IconButton.module.css rule
// for rule (tree format: see button.mjs). Every value is a Component variable name.

const VARIANTS = ['plain', 'overlay', 'primary']
const SIZES = ['sm', 'md', 'lg']
const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Selected']

// Fill and icon colour per variant and state. null = no container.
function colours(variant, state) {
  const s = state === 'Hover' ? 'hover' : state === 'Pressed' ? 'pressed' : 'default'
  if (state === 'Disabled') return { fill: variant === 'plain' ? null : 'icon-button/disabled/background', icon: 'icon-button/disabled/icon' }
  const fill = variant === 'plain' ? (s === 'default' ? null : `icon-button/plain/background/${s}`) : `icon-button/${variant}/background/${s}`
  // Selected: dark blue, and the icon fills, so it isn't colour alone.
  return { fill, icon: state === 'Selected' ? 'icon-button/selected/icon' : `icon-button/${variant}/icon` }
}

// The system ring, or over photos AcmeCo's double ring: white inside, ink outside (decision 19).
const focus = (variant) => variant === 'overlay'
  ? [
      { ring: 'icon-button/overlay-focus-ring/inner', width: 'icon-button/focus-ring/width', offset: 0 },
      { ring: 'icon-button/overlay-focus-ring/outer', width: 'icon-button/focus-ring/width', offset: 'icon-button/focus-ring/width' },
    ]
  : { ring: 'icon-button/focus-ring/color', width: 'icon-button/focus-ring/width', offset: 'icon-button/focus-ring/offset' }

export const iconButton = {
  id: 'icon-button',
  name: 'Icon button',
  page: 'Icon button',
  storybook: 'Components / IconButton',
  code: 'src/components/IconButton/IconButton.tsx',
  guidance: 'src/components/IconButton/IconButton.guidance.md',
  tokens: 'tokens/components/icon-button.json',
  tokenPrefix: 'icon-button.',
  status: 'Ready',
  axes: { Variant: VARIANTS, Size: SIZES, State: STATES },
  grid: { columns: 'Size', rowGroups: 'Variant', rows: 'State', backdrops: [{ when: { Variant: 'overlay' }, fill: 'Semantic/color/surface/brand-dark', label: 'photo stand-in' }] },
  gridNote: 'Selected is a toggle that is on (plain and overlay only). Overlay variants sit on a dark stand-in for a photo, as in their story.',
  properties: [{ name: 'Icon', type: 'INSTANCE_SWAP', default: 'heart', layer: 'Icon' }],
  variants: VARIANTS.flatMap((Variant) => SIZES.flatMap((Size) => STATES.filter((State) => State !== 'Selected' || Variant !== 'primary').map((State) => {
    const c = colours(Variant, State)
    return {
      props: { Variant, Size, State },
      tree: {
        k: 'frame', dir: 'H', size: `icon-button/${Size}/size`,
        radius: Variant === 'primary' ? 'icon-button/primary-radius' : 'icon-button/radius', fill: c.fill,
        focus: State === 'Focus' ? focus(Variant) : null,
        children: [
          { k: 'icon', name: 'Icon', icon: 'heart', size: `icon-button/${Size}/icon-size`, color: c.icon, iconFill: State === 'Selected' ? c.icon : null },
        ],
      },
    }
  }))),
  anatomy: [
    { part: 'Container', tokens: 'icon-button/{size}/size (square), icon-button/radius (pill; primary: icon-button/primary-radius); fill by variant and state, none for plain at rest', at: 'left' },
    { part: 'Icon', tokens: 'icon-button/{size}/icon-size; a registry icon, swapped with the Icon property; filled when selected', layer: 'Icon', at: 'top' },
    { part: 'Focus ring', tokens: 'icon-button/focus-ring/color, 2px, 2px away; overlay: white 2px inside an ink 2px ring', at: 'right' },
  ],
  specsBy: 'Size',
  // Parity with the code: the States matrix (rows = variant × state, columns = sizes).
  parity: {
    story: 'components-iconbutton--states-matrix',
    order: VARIANTS.flatMap((Variant) => STATES.filter((State) => State !== 'Selected' || Variant !== 'primary').flatMap((State) => SIZES.map((Size) => ({ Variant, Size, State })))),
    parts: [
      { name: 'Container', css: 'button', layer: null, fields: ['bg', 'radius', 'w', 'h', 'ring'] },
      { name: 'Icon', css: 'button svg', layer: 'Icon', fields: ['icon'] },
    ],
  },
  specs: (size) => [`icon-button/${size}/size`, `icon-button/${size}/icon-size`, 'icon-button/radius', 'icon-button/primary-radius'],
}
