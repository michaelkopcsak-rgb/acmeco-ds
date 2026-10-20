// PropertyHeader's Figma spec. Mirrors the header rules in
// src/components/Property/Property.module.css (tree format: see button.mjs). AcmeCo's
// header row: title and street address on the left, size and city on the right. In code
// it stacks by container query when the card is narrow; here that's the Stacked layout.

const LAYOUTS = ['Row', 'Stacked', 'Compact']
const L = { title: 'Larkspur Commons', address: '1840 Larkspur Ave', size: '12,400 SF Available', city: 'Denver, CO 80202' }
const wraps = { stretch: true }
const line = (name, chars, extra = {}) => ({ k: 'text', name, chars, fontSize: 'property/header/font-size', lineHeight: 'property/header/line-height', fontWeight: 'property/header/font-weight', fill: 'property/header/color', ...extra })

export const propertyHeader = {
  id: 'property-header',
  name: 'Property header',
  page: 'Property header',
  storybook: 'AcmeCo / Property parts (Header)',
  code: 'src/components/Property/PropertyHeader.tsx',
  guidance: 'src/components/Property/PropertyParts.guidance.md',
  tokens: 'tokens/components/property.json',
  tokenPrefix: 'property.header',
  status: 'Ready',
  axes: { Layout: LAYOUTS },
  grid: { columns: 'Layout', rowGroups: null, rows: null },
  gridNote: 'Row: tiers 1 and 2 (640px shown). Stacked: the same header on a card 400px or narrower (the code\'s container query). Compact: tier 3, where size is one of the facts. The title is the card\'s one link (a subtle Link, stretched over the card).',
  properties: [
    { name: 'Title', type: 'TEXT', default: L.title, layer: 'Title' },
    { name: 'Address', type: 'TEXT', default: L.address, layer: 'Address' },
    { name: 'Size', type: 'TEXT', default: L.size, layer: 'Size' },
    { name: 'Location', type: 'TEXT', default: L.city, layer: 'Location' },
  ],
  variants: LAYOUTS.map((Layout) => ({
    props: { Layout },
    tree: Layout === 'Row'
      ? {
          k: 'frame', dir: 'H', width: 640, align: 'between', cross: 'start', gap: 'property/header/gap',
          children: [
            { k: 'frame', name: 'Start', dir: 'V', align: 'start', cross: 'start', children: [line('Title', L.title), line('Address', L.address)] },
            { k: 'frame', name: 'End', dir: 'V', align: 'start', cross: 'end', children: [line('Size', L.size, { textAlign: 'right' }), line('Location', L.city, { textAlign: 'right' })] },
          ],
        }
      : Layout === 'Stacked'
        ? {
            // Narrow: each line wraps within the card's width.
            k: 'frame', dir: 'V', width: 280, align: 'start', cross: 'start',
            children: [
              { k: 'frame', name: 'Start', dir: 'V', align: 'start', cross: 'start', stretch: true, children: [line('Title', L.title, wraps), line('Address', L.address, wraps)] },
              { k: 'frame', name: 'End', dir: 'V', align: 'start', cross: 'start', stretch: true, children: [line('Size', L.size, wraps), line('Location', L.city, wraps)] },
            ],
          }
        : {
            k: 'frame', dir: 'V', width: 280, align: 'start', cross: 'start',
            children: [{ k: 'frame', name: 'Start', dir: 'V', align: 'start', cross: 'start', stretch: true, children: [line('Title', L.title, wraps), line('Address', L.address, wraps), line('Location', L.city, wraps)] }],
          },
  })),
  anatomy: [
    { part: 'Title', tokens: 'property/header/font-size, line-height, font-weight (semibold), color; the card\'s one link, a heading (h3 in results)', layer: 'Title', at: 'left' },
    { part: 'Address', tokens: 'the same style; street address under the title', layer: 'Address', at: 'left' },
    { part: 'Size and city', tokens: 'the same style, right-aligned; property/header/gap from the left column; under it when narrow', layer: 'End', at: 'right' },
  ],
  anatomyVariant: { Layout: 'Row' },
  parity: {
    story: ['acmeco-property-parts--header', 'acmeco-property-parts--header-narrow', 'acmeco-property-parts--header-compact'],
    cells: "#storybook-root [class*='_header_']",
    order: LAYOUTS.map((Layout) => ({ Layout })),
    parts: [
      { name: 'Title', css: 'h3', layer: 'Title', fields: ['font', 'color', 'startInset'] },
      { name: 'Address', css: "[class*='_headerStart_'] p", layer: 'Address', fields: ['font', 'color', 'startInset'] },
      { name: 'Size', css: "[class*='_headerEnd_'] p", layer: 'Size', fields: ['font', 'color', 'align'] },
      { name: 'Location (row)', css: "[class*='_headerEnd_'] p:last-child", layer: 'Location', fields: ['align', 'endInset'], only: { Layout: 'Row' } },
      { name: 'Location (stacked)', css: "[class*='_headerEnd_'] p:last-child", layer: 'Location', fields: ['align', 'startInset'], only: { Layout: 'Stacked' } },
    ],
  },
  specsBy: null,
  specs: () => ['property/header/font-size', 'property/header/line-height', 'property/header/font-weight', 'property/header/gap'],
}
