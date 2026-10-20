// PropertyCard's Figma spec: AcmeCo's card, composed from the part sets as the code
// composes it (src/components/PropertyCard/PropertyCard.tsx and .module.css). The tier
// (1, 2, 3) sets the layout; the code adapts to the card's own width by container query,
// shown here as Wide (670px, the results list) and Narrow (343px, a phone).

const WIDTHS = { Wide: 670, Narrow: 343 }
const LISTINGS = {
  1: { image: 'l01', title: 'Larkspur Commons', address: '1840 Larkspur Ave', size: '12,400 SF Available', city: 'Denver, CO 80202', price: '$28.50 /SF/YR', facts: ['Built in 2008', '1,850 - 12,400 SF'], type: 'Office', company: 'Summit Ridge Realty', brokers: [['Jordan Ellis', 'JE'], ['Priya Natarajan', 'PN'], ['Marcus Webb', 'MW']], description: 'Larkspur Commons offers 1,850–12,400 SF of office space in central Denver. Built in 2008, the property has been well maintained and positions occupiers close to transit, dining and major arterials. This description is synthetic placeholder copy.' },
  2: { image: 'l03', title: 'Cherry Creek Plaza', address: '410 Aspen Row', size: '3,400 SF Available', city: 'Denver, CO 80206', price: '$38 /SF/YR', facts: ['Built in 1996', '1,100 - 3,400 SF'], type: 'Retail', company: 'Cedar & Pine Commercial', brokers: [['Priya Natarajan', 'PN'], ['Marcus Webb', 'MW'], ['Elena Ruiz', 'ER']], description: 'Cherry Creek Plaza offers 1,100–3,400 SF of retail space in central Denver. Built in 1996, the property has been well maintained and positions occupiers close to transit, dining and major arterials. This description is synthetic placeholder copy.' },
  3: { image: 'l15', title: 'Capitol Hill Studio Offices', address: '980 Logan Row', city: 'Denver, CO 80203', price: '$24.50 /SF/YR', facts: ['Built in 1956', '650 - 3,100 SF', '4 Spaces Available'], company: 'Cedar & Pine Commercial' },
}
const pad = { padY: 'property-card/padding-block', padX: 'property-card/padding-inline' }
const narrow400 = (w) => w - 2 - 32 <= 400 // the header and facts stack at a container of 400px or less

function header(l, layout) {
  return {
    k: 'frame', name: 'Header area', dir: 'V', align: 'start', cross: 'start', stretch: true, ...pad,
    children: [{ k: 'instance', name: 'Header', set: 'Property header', props: { Layout: layout }, stretch: true, text: { Title: l.title, Address: l.address, Location: l.city, ...(l.size ? { Size: l.size } : {}) } }],
  }
}
function media(l, tier, extra = {}) {
  return {
    k: 'instance', name: 'Media', set: 'Property media', props: { Variant: 'Photo', Saved: 'No' }, image: l.image, stretch: true, fillHeight: true,
    // Tier 3 shows the photo alone (with the save toggle); tiers 1 and 2 add arrows and badges.
    ...(tier === 3 ? { bools: { 'Show labels': false, 'Show feature': false, 'Show arrows': false } } : { overrides: [{ layer: 'Label', chars: l.type }] }),
    ...extra,
  }
}
function facts(l, placement) {
  const third = l.facts.length > 2
  return {
    k: 'instance', name: 'Facts', set: 'Property facts', props: { Description: placement }, stretch: true,
    text: { 'Fact 1': l.facts[0], 'Fact 2': l.facts[1], ...(third ? { 'Fact 3': l.facts[2] } : {}), ...(l.description ? { Description: l.description } : {}) },
    bools: { 'Show fact 3': third },
    // The card cuts the description to property-card/description-max-lines (3).
    overrides: [{ layer: 'Amount', chars: l.price }, ...(l.description ? [{ layer: 'Description text', maxLines: 3 }] : [])],
  }
}
function brokers(l, layout, count) {
  const text = { Company: l.company }
  ;(l.brokers ?? []).forEach(([name, initials], i) => { text[`Broker ${i + 1}`] = name; text[`Initials ${i + 1}`] = initials })
  return { k: 'instance', name: 'Brokers', set: 'Broker identity', props: { Layout: layout, Brokers: String(count) }, text, ...(layout.startsWith('Row') && count ? { stretch: true } : {}) }
}
const body = (children, extra = {}) => ({ k: 'frame', name: 'Body', dir: 'V', align: 'start', cross: 'start', gap: 'property-card/gap', stretch: true, ...pad, ...extra, children })
const card = (w, dir, children, extra = {}) => ({
  k: 'frame', dir, width: w, align: 'start', cross: 'start', radius: 'property-card/radius',
  fill: 'property-card/background', stroke: 'property-card/border-color', strokeWidth: 'property-card/border-width',
  effect: 'shadow/card', clip: true, ...extra, children,
})
// Tiers 1 and 2 (stacked): the photo at property-card/media-aspect-ratio (1.8) of the card's inner width.
// aspect: the photo keeps the CSS's 1.8 : 1 when an instance is set to another width (a 638px results column).
const mediaArea = (l, tier, w) => ({ k: 'frame', name: 'Media area', dir: 'V', stretch: true, aspect: true, height: Math.round(((w - 2) / 1.8) * 100) / 100, children: [media(l, tier)] })

function tree(tier, widthName) {
  const w = WIDTHS[widthName], l = LISTINGS[tier], narrow = narrow400(w)
  if (tier === 1) {
    return card(w, 'V', [header(l, narrow ? 'Stacked' : 'Row'), mediaArea(l, 1, w), body([facts(l, narrow ? 'Below' : 'Beside'), brokers(l, narrow ? 'Row narrow' : 'Row', 3)])])
  }
  if (tier === 2) {
    const details = [facts(l, 'Below'), brokers(l, 'Stacked', 3)]
    // Wide: photo | details, side by side under the header (two equal columns). Narrow (480px or less): stacked like tier 1.
    if (widthName === 'Narrow') return card(w, 'V', [header(l, 'Stacked'), mediaArea(l, 2, w), body(details)])
    return card(w, 'V', [
      header(l, 'Row'),
      // Two equal columns that follow the card's width, as the CSS's 1fr 1fr (a Figma grid), so a narrower card still fits.
      { k: 'frame', name: 'Row', dir: 'H', align: 'start', cross: 'start', stretch: true, gridColumns: [1, 1], children: [
        { k: 'frame', name: 'Media area', dir: 'V', fillHeight: true, children: [media(l, 2)] },
        body(details, { stretch: false }),
      ] },
    ])
  }
  // Tier 3: photo (2 parts) | title, address, facts (3 parts) | company logo; narrow: the logo moves under the facts.
  const logo = (extra = {}) => ({ k: 'frame', name: 'Logo area', dir: 'V', align: 'start', cross: 'start', ...pad, ...extra, children: [brokers(l, 'Row', 0)] })
  const middle = [header(l, 'Compact'), body([facts(l, 'None')], { padTop: 0 })]
  return card(w, 'H', [
    { k: 'frame', name: 'Media area', dir: 'V', fr: 2, fillHeight: true, children: [media(l, 3)] },
    { k: 'frame', name: 'Details', dir: 'V', align: 'start', cross: 'start', fr: 3, children: widthName === 'Narrow' ? [...middle, logo({ padTop: 0, stretch: true })] : middle },
    ...(widthName === 'Narrow' ? [] : [logo()]),
  ], { minHeight: 'property-card/compact-media-min-height', cross: 'start' })
}

const COMBOS = [1, 2, 3].flatMap((t) => ['Wide', 'Narrow'].map((w) => [String(t), w]))

export const propertyCard = {
  id: 'property-card',
  name: 'Property card',
  page: 'Property card',
  storybook: 'AcmeCo / PropertyCard',
  code: 'src/components/PropertyCard/PropertyCard.tsx',
  guidance: 'src/components/PropertyCard/PropertyCard.guidance.md',
  tokens: 'tokens/components/property-card.json',
  tokenPrefix: 'property-card.',
  status: 'Ready',
  uses: ['Property header', 'Property media', 'Property facts', 'Broker identity'],
  axes: { Tier: ['1', '2', '3'], Width: ['Wide', 'Narrow'] },
  grid: { columns: 'Width', rowGroups: null, rows: 'Tier' },
  gridNote: 'AcmeCo\'s listing tier sets the layout. Wide = 670px (results list), Narrow = 343px (phone): in code the card follows its own width (container queries at 480 and 400px). Every part is an instance of its own set; the title is the card\'s one link, and focusing it rings the whole card.',
  properties: [],
  variants: COMBOS.map(([Tier, Width]) => ({ props: { Tier, Width }, tree: tree(Number(Tier), Width) })),
  anatomy: [
    { part: 'Card', tokens: 'property-card/radius (8px), background, 1px border-color, shadow/card; clips the photo to its corners', at: 'right' },
    { part: 'Header', tokens: 'a Property header instance; property-card/padding-block and padding-inline around it', layer: 'Header area', at: 'left' },
    { part: 'Photo', tokens: 'a Property media instance at the card\'s width ÷ property-card/media-aspect-ratio (1.8)', layer: 'Media area', at: 'left' },
    { part: 'Body', tokens: 'Property facts (description cut to 3 lines) and Broker identity instances, property-card/gap apart', layer: 'Body', at: 'left' },
  ],
  anatomyVariant: { Tier: '1', Width: 'Narrow' },
  parity: {
    story: ['acmeco-propertycard--tier-1', 'acmeco-propertycard--tier-2', 'acmeco-propertycard--tier-3', 'acmeco-propertycard--narrow'],
    cells: '#storybook-root article',
    order: [['1', 'Wide'], ['2', 'Wide'], ['3', 'Wide'], ['1', 'Narrow'], ['2', 'Narrow'], ['3', 'Narrow']].map(([Tier, Width]) => ({ Tier, Width })),
    parts: [
      { name: 'Card', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'w', 'h'] },
      { name: 'Header area', css: "[class*='_header_']", layer: 'Header area', fields: ['padT', 'padL', 'startInset'] },
      { name: 'Media area', css: "[class*='_media_']", layer: 'Media area', fields: ['w', 'h'] },
      { name: 'Body', css: "[class*='_body_']", layer: 'Body', fields: ['padT', 'padL', 'gap'] },
      { name: 'Title', css: 'h3', layer: 'Title', fields: ['font', 'color', 'startInset'] },
      { name: 'Price', css: "[class*='_price_']", layer: 'Amount', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['property-card/radius', 'property-card/border-width', 'property-card/padding-block', 'property-card/padding-inline', 'property-card/gap', 'property-card/media-aspect-ratio', 'property-card/compact-media-min-height', 'property-card/description-max-lines'],
}
