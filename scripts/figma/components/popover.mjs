// Popover's Figma spec: the panel that opens from a button. Mirrors
// src/components/Popover/Popover.module.css (tree format: see button.mjs). It sits
// popover/offset (4px) from its button; the content is the screen's.

export const popover = {
  id: 'popover',
  name: 'Popover',
  page: 'Popover',
  storybook: 'Components / Popover',
  code: 'src/components/Popover/Popover.tsx',
  guidance: 'src/components/Popover/Popover.guidance.md',
  tokens: 'tokens/components/popover.json',
  tokenPrefix: 'popover.',
  status: 'Ready',
  axes: { Variant: ['Default'] },
  grid: { columns: 'Variant', rowGroups: null, rows: null },
  gridNote: 'The panel, popover/offset (4px) from the button that opens it (under it, right edges aligned by default). Put the content in the Content frame; the panel hugs it. Same look as the Select list.',
  properties: [],
  variants: [{
    props: { Variant: 'Default' },
    tree: {
      k: 'frame', dir: 'V', align: 'start', cross: 'start', padX: 'popover/padding', padY: 'popover/padding',
      radius: 'popover/radius', fill: 'popover/background', stroke: 'popover/border', strokeWidth: 'popover/border-width', effect: 'shadow/raised',
      children: [{
        k: 'frame', name: 'Content', dir: 'V', width: 200, align: 'start', cross: 'start', gap: 'Primitives/space/2',
        children: [
          { k: 'text', name: 'Item 1', chars: 'Preferences', fontSize: 'Semantic/typography/body/font-size', lineHeight: 'Semantic/typography/body/line-height', fill: 'Semantic/color/text/default' },
          { k: 'text', name: 'Item 2', chars: 'Help Center', fontSize: 'Semantic/typography/body/font-size', lineHeight: 'Semantic/typography/body/line-height', fill: 'Semantic/color/text/default' },
        ],
      }],
    },
  }],
  anatomy: [
    { part: 'Panel', tokens: 'popover/radius (8px), background, 1px popover/border, shadow/raised', at: 'right' },
    { part: 'Content', tokens: 'popover/padding (8px) all round; the screen\'s content', layer: 'Content', at: 'left' },
  ],
  anatomyVariant: { Variant: 'Default' },
  parity: {
    story: ['components-popover--open'],
    cells: "[class*='_popover_']",
    order: [{ Variant: 'Default' }],
    parts: [
      { name: 'Panel', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'padT', 'padL'] },
    ],
  },
  specsBy: null,
  specs: () => ['popover/radius', 'popover/padding', 'popover/offset', 'popover/border-width'],
}
