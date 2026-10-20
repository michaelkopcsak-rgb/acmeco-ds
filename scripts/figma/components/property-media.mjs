// PropertyMedia's Figma spec. Mirrors the media rules in
// src/components/Property/Property.module.css (tree format: see button.mjs). A listing's
// photo (a placeholder illustration, swappable as the layer's image fill) with AcmeCo's
// controls on top: badges, the save toggle and previous / next, all Badge and Icon button
// instances, at property/media/inset from the edges.

const inset = 'property/media/inset'
const overlays = (saved) => [
  { k: 'instance', name: 'Labels', set: 'Badge', props: { Tone: 'neutral' }, abs: { left: inset, top: inset } },
  { k: 'instance', name: 'Feature', set: 'Badge', props: { Tone: 'feature' }, abs: { left: 0, bottom: 0 } },
  // Ask AcmeCo (a proposal, decision 45): beside Save, off by default ("Show ask").
  { k: 'instance', name: 'Ask', set: 'Icon button', props: { Variant: 'overlay', Size: 'sm', State: 'Default' }, icons: { Icon: 'sparkles' }, abs: { right: { add: [inset, { add: ['icon-button/sm/size', 'property/media/action-gap'] }] }, top: inset }, hidden: true },
  { k: 'instance', name: 'Save', set: 'Icon button', props: { Variant: 'overlay', Size: 'sm', State: saved ? 'Selected' : 'Default' }, abs: { right: inset, top: inset } },
  { k: 'instance', name: 'Previous', set: 'Icon button', props: { Variant: 'overlay', Size: 'sm', State: 'Default' }, icons: { Icon: 'chevron-left' }, abs: { left: inset, centerY: true } },
  { k: 'instance', name: 'Next', set: 'Icon button', props: { Variant: 'overlay', Size: 'sm', State: 'Default' }, icons: { Icon: 'chevron-right' }, abs: { right: inset, centerY: true } },
]
const COMBOS = [['Photo', 'No'], ['Photo', 'Yes'], ['Thumb', 'No']]

export const propertyMedia = {
  id: 'property-media',
  name: 'Property media',
  page: 'Property media',
  storybook: 'AcmeCo / Property parts (Media)',
  code: 'src/components/Property/PropertyMedia.tsx',
  guidance: 'src/components/Property/PropertyParts.guidance.md',
  tokens: 'tokens/components/property.json',
  tokenPrefix: 'property.media',
  status: 'Ready',
  uses: ['Badge', 'Icon button'],
  axes: { Variant: ['Photo', 'Thumb'], Saved: ['No', 'Yes'] },
  grid: { columns: 'Saved', rowGroups: null, rows: 'Variant' },
  gridNote: 'The photo fills its container (the card sets the size; 640 × 320 shown). Replace the image fill to show a listing\'s photo; the placeholders are illustrations, not photography. Badges, save, Ask AcmeCo (a proposal, off by default) and arrows are instances; turn each on or off with its property.',
  properties: [
    { name: 'Show labels', type: 'BOOLEAN', default: true, layer: 'Labels' },
    { name: 'Show feature', type: 'BOOLEAN', default: true, layer: 'Feature' },
    { name: 'Show save', type: 'BOOLEAN', default: true, layer: 'Save' },
    { name: 'Show ask', type: 'BOOLEAN', default: false, layer: 'Ask' },
    { name: 'Show arrows', type: 'BOOLEAN', default: true, layer: ['Previous', 'Next'] },
  ],
  variants: COMBOS.map(([Variant, Saved]) => ({
    props: { Variant, Saved },
    tree: Variant === 'Photo'
      ? { k: 'frame', dir: 'H', width: 640, height: 320, fill: 'property/media/background', image: 'l01', clip: true, children: overlays(Saved === 'Yes') }
      : { k: 'frame', dir: 'H', width: 160, height: 110, radius: 'property/media/radius', fill: 'property/media/background', image: 'l01', clip: true, children: [] },
  })),
  anatomy: [
    { part: 'Photo', tokens: 'fills its container; property/media/background behind the image; thumb: property/media/radius corners', at: 'left' },
    { part: 'Labels', tokens: 'a neutral Badge, property/media/inset from the top-left corner', layer: 'Labels', at: 'top' },
    { part: 'Save', tokens: 'an overlay Icon button (sm), a toggle named "Save {listing}"; property/media/inset from the top-right', layer: 'Save', at: 'top' },
    { part: 'Ask AcmeCo (proposal)', tokens: 'an overlay Icon button (sm) with the sparkles icon, property/media/action-gap left of Save; named "Ask AcmeCo about {listing}"; off by default (Show ask)', layer: 'Ask', at: 'top' },
    { part: 'Previous / next', tokens: 'overlay Icon buttons (sm), centred vertically, property/media/inset from the sides; named "Previous photo" / "Next photo"', layer: 'Next', at: 'end' },
    { part: 'Feature label', tokens: 'a feature Badge flush in the bottom-left corner', layer: 'Feature', at: 'bottom' },
  ],
  anatomyVariant: { Variant: 'Photo', Saved: 'No' },
  parity: {
    story: ['acmeco-property-parts--media-story', 'acmeco-property-parts--thumbnail'],
    cells: '#storybook-root [role=group]',
    order: [{ Variant: 'Photo', Saved: 'No' }, { Variant: 'Thumb', Saved: 'No' }],
    parts: [
      { name: 'Media', css: ':scope', layer: null, fields: ['bg', 'radius', 'w', 'h'] },
      { name: 'Labels', css: "[class*='_mediaLabels_']", layer: 'Labels', fields: ['startInset', 'topInset'] },
      { name: 'Feature', css: "[class*='_mediaFeature_']", layer: 'Feature', fields: ['startInset', 'bottomInset'] },
      { name: 'Save', css: "button[aria-label^='Save']", layer: 'Save', fields: ['w', 'h', 'topInset', 'endInset'] },
      { name: 'Previous', css: "button[aria-label='Previous photo']", layer: 'Previous', fields: ['startInset'] },
      { name: 'Next', css: "button[aria-label='Next photo']", layer: 'Next', fields: ['endInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['property/media/inset', 'property/media/radius'],
}
