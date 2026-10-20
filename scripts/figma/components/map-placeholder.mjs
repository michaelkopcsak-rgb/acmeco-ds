// MapPlaceholder's Figma spec. Mirrors src/components/MapPlaceholder/MapPlaceholder.module.css
// (tree format: see button.mjs). The drawn map (decision 39) with its "Map placeholder"
// badge; the pins are Map pin instances placed over it where a screen needs them.

export const mapPlaceholder = {
  id: 'map-placeholder',
  name: 'Map placeholder',
  page: 'Map placeholder',
  storybook: 'AcmeCo / MapPlaceholder',
  code: 'src/components/MapPlaceholder/MapPlaceholder.tsx',
  guidance: 'src/components/MapPlaceholder/MapPlaceholder.guidance.md',
  tokens: 'tokens/components/map.json',
  tokenPrefix: 'map.',
  status: 'Ready (decision 39)',
  uses: ['Badge'],
  axes: { Drawing: ['Yes', 'No'] },
  grid: { columns: 'Drawing', rowGroups: null, rows: null },
  gridNote: 'It fills its container (640 × 360 shown; beside a list it fills the window\'s height). The drawing is an image fill, not map tiles (they\'re licensed artwork). Place Map pin instances over it for the listings.',
  properties: [],
  variants: ['Yes', 'No'].map((Drawing) => ({
    props: { Drawing },
    tree: {
      k: 'frame', dir: 'H', width: 640, height: 360, fill: 'map/background', image: Drawing === 'Yes' ? 'm03' : undefined, clip: true,
      stroke: 'map/border', strokeWidth: 'map/border-width',
      children: [{ k: 'instance', name: 'Label', set: 'Badge', props: { Tone: 'neutral' }, overrides: [{ layer: 'Label', chars: 'Map placeholder' }], abs: { left: { add: ['map/label-inset', 'map/border-width'] }, top: { add: ['map/label-inset', 'map/border-width'] } } }],
    },
  })),
  anatomy: [
    { part: 'Map', tokens: 'map/background behind the drawing (an image fill), 1px map/border; fills its container', at: 'left' },
    { part: 'Label', tokens: 'a neutral Badge, "Map placeholder", map/label-inset inside the border from the top-left corner', layer: 'Label', at: 'top' },
  ],
  anatomyVariant: { Drawing: 'Yes' },
  parity: {
    story: ['acmeco-mapplaceholder--default', 'acmeco-mapplaceholder--no-drawing'],
    cells: '#storybook-root [role=img]',
    order: [{ Drawing: 'Yes' }, { Drawing: 'No' }],
    parts: [
      { name: 'Map', css: ':scope', layer: null, fields: ['bg', 'border'] },
      { name: 'Label', css: "[class*='_label_']", layer: 'Label', fields: ['startInset', 'topInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['map/label-inset', 'map/border-width', 'map/height-compact'],
}
