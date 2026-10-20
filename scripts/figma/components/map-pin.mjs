// A MapPlaceholder pin's Figma spec (MapPlaceholder.module.css, .pin): a dark blue teardrop, a
// square with one sharp corner turned 45°, with a white edge. Screens place one per listing.

export const mapPin = {
  id: 'map-pin',
  name: 'Map pin',
  page: 'Map pin',
  storybook: 'AcmeCo / MapPlaceholder',
  code: 'src/components/MapPlaceholder/MapPlaceholder.tsx',
  guidance: 'src/components/MapPlaceholder/MapPlaceholder.guidance.md',
  tokens: 'tokens/components/map.json',
  tokenPrefix: 'map.pin',
  status: 'Ready (decision 39)',
  axes: { Variant: ['Default'] },
  grid: { columns: null, rowGroups: null, rows: null },
  gridNote: 'Its point marks the place: set it so the point sits on the listing\'s position.',
  properties: [],
  variants: [{
    props: { Variant: 'Default' },
    // radii: the CSS's 50% 50% 50% 0 on the 24px pin (12px), so three corners are round.
    tree: { k: 'frame', dir: 'H', size: 'map/pin/size', radii: [12, 12, 12, 0], fill: 'map/pin/color', stroke: 'map/pin/border', strokeWidth: 'map/pin/border-width', rotate: 45, children: [] },
  }],
  anatomy: [
    { part: 'Pin', tokens: 'map/pin/size, map/pin/color, a map/pin/border-width map/pin/border edge; three rounded corners, turned 45° so the sharp one points down', at: 'left' },
  ],
  anatomyVariant: { Variant: 'Default' },
  parity: {
    story: 'acmeco-mapplaceholder--default',
    cells: "#storybook-root [class*='_pin_']:first-child",
    order: [{ Variant: 'Default' }],
    parts: [{ name: 'Pin', css: ':scope', layer: 'Pin', fields: ['bg', 'border', 'w', 'h'] }],
  },
  specsBy: null,
  specs: () => ['map/pin/size', 'map/pin/border-width'],
}
