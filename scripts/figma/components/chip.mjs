// Chip's Figma spec. Mirrors src/components/Chip/Chip.module.css rule for rule (tree
// format: see button.mjs). AcmeCo's light-blue chip; the remove button is a full 24px
// target that reaches over the chip's top, bottom and end borders.

const STATES = ['Default', 'Focus', 'Remove hover']

export const chip = {
  id: 'chip',
  name: 'Chip',
  page: 'Chip',
  storybook: 'Components / Chip',
  code: 'src/components/Chip/Chip.tsx',
  guidance: 'src/components/Chip/Chip.guidance.md',
  tokens: 'tokens/components/chip.json',
  tokenPrefix: 'chip.',
  status: 'Ready',
  axes: { Removable: ['Yes', 'No'], State: STATES },
  grid: { columns: 'Removable', rowGroups: null, rows: 'State' },
  gridNote: 'Chips sit in a wrapping row, chip/group-gap apart. Remove hover = the pointer over the remove button.',
  properties: [{ name: 'Label', type: 'TEXT', default: 'Colorado', layer: 'Label' }],
  variants: ['Yes', 'No'].flatMap((Removable) => STATES.filter((State) => State !== 'Remove hover' || Removable === 'Yes').map((State) => {
    const removable = Removable === 'Yes'
    return {
      props: { Removable, State },
      tree: {
        k: 'frame', dir: 'H', height: 'chip/height', gap: 'chip/gap',
        // A removable chip's button runs to its edge, over the border: its outline takes no
        // layout space (so the start padding adds the border back, as the CSS's border-box).
        strokesInLayout: removable ? false : undefined,
        padLeft: removable ? { add: ['chip/padding-x', 'chip/border-width'] } : 'chip/padding-x',
        padRight: removable ? 0 : 'chip/padding-x',
        radius: 'chip/radius', fill: 'chip/background', stroke: 'chip/border', strokeWidth: 'chip/border-width',
        focus: State === 'Focus' ? { ring: 'chip/focus-ring/color', width: 'chip/focus-ring/width', offset: 'chip/focus-ring/offset' } : null,
        children: [
          { k: 'text', name: 'Label', chars: 'Colorado', fontSize: 'chip/font-size', lineHeight: 'chip/line-height', fontWeight: 'chip/font-weight', fill: 'chip/text' },
          ...(removable ? [{
            k: 'frame', name: 'Remove', dir: 'H', size: 'chip/remove/size', radii: [0, 'chip/radius', 'chip/radius', 0],
            fill: State === 'Remove hover' ? 'chip/remove/background-hover' : null,
            children: [{ k: 'icon', name: 'Remove icon', icon: 'close', size: 'chip/remove/icon-size', color: 'chip/remove/icon' }],
          }] : []),
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Chip', tokens: 'chip/height, chip/padding-x, chip/radius, chip/background, 1px chip/border', at: 'left' },
    { part: 'Label', tokens: 'chip/font-size, chip/line-height, chip/text', layer: 'Label', at: 'top' },
    { part: 'Remove button', tokens: 'chip/remove/size (24px target, over the border), chip/remove/icon-size, chip/remove/icon; chip/remove/background-hover on hover. Named "Remove {chip}"', layer: 'Remove', at: 'top' },
    { part: 'Focus ring', tokens: 'chip/focus-ring/color, 2px, 2px away', at: 'right' },
  ],
  anatomyVariant: { Removable: 'Yes', State: 'Focus' },
  // Parity with the code: the States matrix (one chip per state, all removable).
  parity: {
    story: 'components-chip--states-matrix',
    cells: '#storybook-root [role=row]',
    order: STATES.map((State) => ({ Removable: 'Yes', State })),
    parts: [
      { name: 'Chip', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'h', 'gap', 'ring'] },
      { name: 'Label', css: 'span', layer: 'Label', fields: ['font', 'color', 'startInset'] },
      { name: 'Remove', css: 'button', layer: 'Remove', fields: ['bg', 'w', 'h', 'endInset'] },
      { name: 'Remove icon', css: 'button svg', layer: 'Remove icon', fields: ['icon'] },
    ],
  },
  specsBy: null,
  specs: () => ['chip/height', 'chip/padding-x', 'chip/gap', 'chip/group-gap', 'chip/radius', 'chip/border-width', 'chip/font-size', 'chip/line-height', 'chip/remove/size', 'chip/remove/icon-size'],
}
