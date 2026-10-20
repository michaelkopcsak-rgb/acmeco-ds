// PropertyPrice's Figma spec. Mirrors the price rules in
// src/components/Property/Property.module.css (tree format: see button.mjs). The text is
// what src/data/format.ts priceText() shows for each kind; screen readers hear the units
// spelled out ("per square foot per year"), which a design file can't show.

const KINDS = ['Rate', 'Total', 'Auction', 'On request']
const TEXT = { Rate: '$28.50 /SF/YR', Total: '$1,850,000', Auction: 'Starting bid $950,000', 'On request': 'Price Upon Request' }
const SIZES = ['compact', 'prominent']

export const propertyPrice = {
  id: 'property-price',
  name: 'Property price',
  page: 'Property price',
  storybook: 'AcmeCo / Property parts (Prices)',
  code: 'src/components/Property/PropertyPrice.tsx',
  guidance: 'src/components/Property/PropertyParts.guidance.md',
  tokens: 'tokens/components/property.json',
  tokenPrefix: 'property.price',
  status: 'Ready',
  axes: { Kind: KINDS, Size: SIZES },
  grid: { columns: 'Size', rowGroups: null, rows: 'Kind' },
  gridNote: 'compact: the first fact on a card; prominent: the property page. "Price Upon Request" is grey so real prices stand out. No text property: each kind has its own words; edit the amount in an instance.',
  properties: [],
  variants: KINDS.flatMap((Kind) => SIZES.map((Size) => ({
    props: { Kind, Size },
    tree: {
      k: 'frame', dir: 'H',
      children: [{
        k: 'text', name: 'Amount', chars: TEXT[Kind],
        fontSize: Size === 'prominent' ? 'property/price/prominent-font-size' : 'property/price/font-size',
        lineHeight: Size === 'prominent' ? 'property/price/prominent-line-height' : 'property/price/line-height',
        fontWeight: 'property/price/font-weight',
        fill: Kind === 'On request' ? 'property/price/muted-color' : 'property/price/color',
      }],
    },
  }))),
  anatomy: [
    { part: 'Amount', tokens: 'property/price/font-size, line-height, font-weight (the price style); prominent: property/price/prominent-*; muted for "on request"', layer: 'Amount', at: 'top' },
  ],
  anatomyVariant: { Kind: 'Rate', Size: 'prominent' },
  parity: {
    story: 'acmeco-property-parts--prices',
    order: KINDS.flatMap((Kind) => SIZES.map((Size) => ({ Kind, Size }))),
    parts: [{ name: 'Price', css: 'span', layer: 'Amount', fields: ['font', 'color'] }],
  },
  specsBy: 'Size',
  specs: (size) => size === 'prominent' ? ['property/price/prominent-font-size', 'property/price/prominent-line-height', 'property/price/font-weight'] : ['property/price/font-size', 'property/price/line-height', 'property/price/font-weight'],
}
