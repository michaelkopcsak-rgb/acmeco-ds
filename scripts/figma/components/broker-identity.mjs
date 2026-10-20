// BrokerIdentity's Figma spec. Mirrors the broker rules in
// src/components/Property/Property.module.css (tree format: see button.mjs). The listing
// company's logo (a neutral placeholder mark with its name) and up to three brokers
// (initials instead of photos): no real companies or people.

const BROKERS = [['Jordan Ellis', 'JE'], ['Priya Natarajan', 'PN'], ['Marcus Webb', 'MW']]
const COMPANY = 'Summit Ridge Realty'
// Row: 0 (logo only, tier 3) to 3 brokers. Row narrow: the same row on a narrow card, where
// the CSS wraps it (logo above, brokers wrapping at full width). Stacked (tier 2, names
// hidden): 2 or 3. Sidebar (the contact box): 1 to 3.
const COMBOS = [['Row', 0], ['Row', 1], ['Row', 2], ['Row', 3], ['Row narrow', 1], ['Row narrow', 2], ['Row narrow', 3], ['Stacked', 2], ['Stacked', 3], ['Sidebar', 1], ['Sidebar', 2], ['Sidebar', 3]]

const logo = {
  k: 'frame', name: 'Logo', dir: 'H', height: 'property/broker/logo-height', padX: 'property/media/inset',
  radius: 'property/media/radius', stroke: 'property/broker/logo-border', strokeWidth: 'property/border-width',
  children: [{ k: 'text', name: 'Company', chars: COMPANY, fontSize: 'property/broker/name-font-size', lineHeight: 'property/broker/name-line-height', fontWeight: 'property/header/font-weight', fill: 'property/broker/name-color' }],
}
function broker(i, layout) {
  const lg = layout === 'Sidebar'
  const [name, initials] = BROKERS[i]
  return {
    k: 'frame', name: `Broker ${i + 1}`, dir: 'H', gap: 'property/media/inset',
    children: [
      {
        k: 'frame', name: `Avatar ${i + 1}`, dir: 'H', size: lg ? 'property/broker/avatar-size-lg' : 'property/broker/avatar-size',
        radius: 'property/broker/avatar-radius', fill: 'property/broker/avatar-background',
        children: [{ k: 'text', name: `Initials ${i + 1}`, chars: initials, fontSize: lg ? 'property/broker/name-font-size-lg' : 'property/broker/name-font-size', lineHeight: lg ? 'property/broker/name-line-height-lg' : 'property/broker/name-line-height', fontWeight: 'property/header/font-weight', fill: 'property/broker/avatar-text' }],
      },
      // Stacked hides the names (screen readers still hear them).
      ...(layout === 'Stacked' ? [] : [{ k: 'text', name: `Name ${i + 1}`, chars: name, fontSize: lg ? 'property/broker/name-font-size-lg' : 'property/broker/name-font-size', lineHeight: lg ? 'property/broker/name-line-height-lg' : 'property/broker/name-line-height', fill: 'property/broker/name-color' }]),
    ],
  }
}

export const brokerIdentity = {
  id: 'broker-identity',
  name: 'Broker identity',
  page: 'Broker identity',
  storybook: 'AcmeCo / Property parts (Broker identity)',
  code: 'src/components/Property/BrokerIdentity.tsx',
  guidance: 'src/components/Property/PropertyParts.guidance.md',
  tokens: 'tokens/components/property.json',
  tokenPrefix: 'property.broker',
  status: 'Ready',
  axes: { Layout: ['Row', 'Row narrow', 'Stacked', 'Sidebar'], Brokers: ['0', '1', '2', '3'] },
  grid: { columns: 'Brokers', rowGroups: null, rows: 'Layout' },
  gridNote: 'Row: tier 1 (and tier 3\'s logo only). Row narrow: tier 1 on a narrow card (309px shown): the logo on its own line, brokers wrapping below. Stacked: tier 2\'s narrow column, photos only (names are still read by screen readers). Sidebar: the contact box, 80px photos. Placeholder logo and initials: no real companies or people.',
  properties: [
    { name: 'Company', type: 'TEXT', default: COMPANY, layer: 'Company' },
    ...BROKERS.flatMap(([name, initials], i) => [
      { name: `Broker ${i + 1}`, type: 'TEXT', default: name, layer: `Name ${i + 1}` },
      { name: `Initials ${i + 1}`, type: 'TEXT', default: initials, layer: `Initials ${i + 1}` },
    ]),
  ],
  variants: COMBOS.map(([Layout, count]) => {
    const list = { k: 'frame', name: 'Brokers', dir: Layout === 'Sidebar' ? 'V' : 'H', align: 'start', cross: Layout === 'Sidebar' ? 'start' : 'center', gap: 'property/broker/gap', children: Array.from({ length: count }, (_, i) => broker(i, Layout)) }
    return {
      props: { Layout, Brokers: String(count) },
      tree: Layout === 'Row'
        // The row wraps on a narrow card, as the CSS's flex-wrap does.
        ? { k: 'frame', dir: 'H', align: 'start', cross: 'center', gap: 'property/broker/gap', wrap: true, children: [logo, ...(count ? [{ ...list, wrap: true }] : [])] }
        : Layout === 'Row narrow'
          ? { k: 'frame', dir: 'V', width: 309, align: 'start', cross: 'start', gap: 'property/broker/gap', children: [logo, { ...list, stretch: true, wrap: true }] }
        : Layout === 'Stacked'
          ? { k: 'frame', dir: 'V', align: 'start', cross: 'start', gap: 'property/broker/gap', children: [logo, list] }
          // Sidebar: brokers first, then the logo centred under them.
          : { k: 'frame', dir: 'V', width: 280, align: 'start', cross: 'start', gap: 'property/broker/gap', children: [{ ...list, stretch: true }, { k: 'frame', name: 'Logo row', dir: 'H', stretch: true, children: [logo] }] },
    }
  }),
  anatomy: [
    { part: 'Logo', tokens: 'property/broker/logo-height (40px), property/media/inset padding, 1px property/broker/logo-border, property/media/radius; the company name', layer: 'Logo', at: 'left' },
    { part: 'Broker photo', tokens: 'property/broker/avatar-size (48px; sidebar 80px), property/broker/avatar-radius; initials stand in for photos', layer: 'Avatar 1', at: 'top' },
    { part: 'Name', tokens: 'property/broker/name-font-size, line-height, color; hidden in the stacked layout', layer: 'Name 1', at: 'top' },
  ],
  anatomyVariant: { Layout: 'Row', Brokers: '2' },
  parity: {
    story: ['acmeco-property-parts--brokers', 'acmeco-property-parts--brokers-compact'],
    cells: "#storybook-root [class*='_broker_']",
    order: [['Row', 3], ['Row', 2], ['Row', 1], ['Row', 0], ['Stacked', 3]].map(([Layout, n]) => ({ Layout, Brokers: String(n) })),
    parts: [
      { name: 'Identity', css: ':scope', layer: null, fields: ['gap'] },
      { name: 'Logo', css: "[class*='_logo_']", layer: 'Logo', fields: ['border', 'radius', 'h', 'padL', 'padR'] },
      { name: 'Company', css: "[class*='_logo_']", layer: 'Company', fields: ['font', 'color'] },
      { name: 'Avatar', css: "li:first-child [class*='_avatar_']", layer: 'Avatar 1', fields: ['bg', 'w', 'h', 'radius'] },
      { name: 'Initials', css: "li:first-child [class*='_avatar_']", layer: 'Initials 1', fields: ['color'] },
      { name: 'Name', css: "li:first-child [class*='_brokerName_']", layer: 'Name 1', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['property/broker/gap', 'property/broker/logo-height', 'property/broker/avatar-size', 'property/broker/avatar-size-lg', 'property/broker/avatar-radius', 'property/broker/name-font-size', 'property/broker/name-line-height', 'property/broker/name-font-size-lg'],
}
