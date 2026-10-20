// PropertyFacts's Figma spec. Mirrors the facts rules in
// src/components/Property/Property.module.css (tree format: see button.mjs). The price
// comes first, as a Property price instance, then AcmeCo's short facts, then an optional
// description beside them (tier 1) or below them (tier 2's narrow column).

const PLACEMENTS = ['Beside', 'Below', 'None']
const L = {
  fact1: 'Built in 2008', fact2: '1,850 - 12,400 SF', fact3: '2 Spaces Available',
  description: 'Larkspur Commons offers 1,850–12,400 SF of office space in central Denver. Built in 2008, the property has been well maintained and positions occupiers close to transit, dining and major arterials. This description is synthetic placeholder copy.',
}
const fact = (name, chars, extra = {}) => ({ k: 'text', name, chars, fontSize: 'property/facts/font-size', lineHeight: 'property/facts/line-height', fontWeight: 'property/facts/font-weight', fill: 'property/facts/color', ...extra })
const list = {
  k: 'frame', name: 'Facts list', dir: 'V', align: 'start', cross: 'start',
  children: [
    { k: 'instance', name: 'Price', set: 'Property price', props: { Kind: 'Rate', Size: 'compact' } },
    fact('Fact 1', L.fact1), fact('Fact 2', L.fact2),
    // A third fact for tier 3, which has no description ("4 Spaces Available"); off by default.
    fact('Fact 3', L.fact3, { hidden: true }),
  ],
}
const description = (beside) => ({
  k: 'frame', name: 'Description', dir: 'V', align: 'start', cross: 'start', stretch: true,
  // Beside the facts it has a 1px divider on its left and property/header/gap of padding.
  ...(beside ? { padLeft: 'property/header/gap', stroke: 'property/facts/divider', strokeWidth: 'property/border-width', strokeSides: { left: 'property/border-width' } } : {}),
  children: [fact('Description text', L.description, { fill: 'property/facts/description-color', stretch: true })],
})

export const propertyFacts = {
  id: 'property-facts',
  name: 'Property facts',
  page: 'Property facts',
  storybook: 'AcmeCo / Property parts (Facts)',
  code: 'src/components/Property/PropertyFacts.tsx',
  guidance: 'src/components/Property/PropertyParts.guidance.md',
  tokens: 'tokens/components/property.json',
  tokenPrefix: 'property.facts',
  status: 'Ready',
  uses: ['Property price'],
  axes: { Description: PLACEMENTS },
  grid: { columns: 'Description', rowGroups: null, rows: null },
  gridNote: 'Beside: tier 1 (640px shown); the description moves below on a container 400px or narrower. Below: tier 2\'s narrow column (308px). None: tier 3, which can show a third fact (Show fact 3). The price is a Property price instance; change it in the instance.',
  properties: [
    { name: 'Fact 1', type: 'TEXT', default: L.fact1, layer: 'Fact 1' },
    { name: 'Fact 2', type: 'TEXT', default: L.fact2, layer: 'Fact 2' },
    { name: 'Fact 3', type: 'TEXT', default: L.fact3, layer: 'Fact 3' },
    { name: 'Show fact 3', type: 'BOOLEAN', default: false, layer: 'Fact 3' },
    { name: 'Description', type: 'TEXT', default: L.description, layer: 'Description text' },
  ],
  variants: PLACEMENTS.map((Description) => ({
    props: { Description },
    tree: Description === 'Beside'
      ? { k: 'frame', dir: 'H', width: 640, align: 'start', cross: 'start', gap: 'property/header/gap', children: [list, description(true)] }
      : Description === 'Below'
        ? { k: 'frame', dir: 'V', width: 308, align: 'start', cross: 'start', gap: 'property/header/gap', children: [list, description(false)] }
        : { k: 'frame', dir: 'V', width: 280, align: 'start', cross: 'start', children: [list] },
  })),
  anatomy: [
    { part: 'Price', tokens: 'a Property price instance (compact), first in the list', layer: 'Price', at: 'left' },
    { part: 'Facts', tokens: 'property/facts/font-size, line-height, color; AcmeCo\'s wording', layer: 'Fact 1', at: 'left' },
    { part: 'Description', tokens: 'property/facts/description-color; beside: a 1px property/facts/divider on its left, property/header/gap away; cut to 3 lines on a card', layer: 'Description', at: 'top' },
  ],
  anatomyVariant: { Description: 'Beside' },
  parity: {
    story: ['acmeco-property-parts--facts', 'acmeco-property-parts--facts-below'],
    cells: "#storybook-root [class*='_factsContainer_']",
    order: [{ Description: 'Beside' }, { Description: 'Below' }],
    parts: [
      { name: 'Price', css: "[class*='_price_']", layer: 'Amount', fields: ['font', 'color'] },
      { name: 'Fact', css: 'li:nth-child(2)', layer: 'Fact 1', fields: ['font', 'color'] },
      { name: 'Description', css: 'p', layer: 'Description', fields: ['borderLeft', 'padL'] },
      { name: 'Description text', css: 'p', layer: 'Description text', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['property/facts/font-size', 'property/facts/line-height', 'property/facts/font-weight', 'property/header/gap', 'property/border-width'],
}
