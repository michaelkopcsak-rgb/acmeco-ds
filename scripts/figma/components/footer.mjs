// Footer's Figma spec. Mirrors src/components/Footer/Footer.module.css (tree format: see
// button.mjs). AcmeCo's footer, checked against the live site (2026-10-10): five columns
// of links on a light grey band with a 2px line on top, then the brand block (placeholder
// mark, "Connect with us", named social placeholders, copyright, app links). Desktop
// (1440px, the container's maximum) and phone (375px: AcmeCo's one list of links with lines
// edge to edge, then the brand block centred; decision 51, a phone recording).

const WIDTHS = { Desktop: 1440, Phone: 375 }
const COLUMNS = [
  ['Search', ['Properties For Sale', 'Properties For Lease', 'Businesses For Sale', 'Find a Broker']],
  ['Products & Services', ['Advertise With Us', 'Listing Tools', 'Help']],
  ['Marketplace', ['AcmeCo Homes', 'AcmeCo Land', 'AcmeCo Offices', 'AcmeCo Rentals', 'AcmeCo Business', 'AcmeCo Studio', 'AcmeCo Global'], true],
  ['Resources', ['Contact Us', 'Mobile', 'Site Map', 'Guides', 'Commercial Terms']],
  ['Company', ['About Us', 'Careers', 'Terms of Use', 'Privacy Notice', 'Cookie Policy', 'Exercise Your Rights', 'Licensing', 'Accessibility Commitment']],
]
const PHONE_LINKS = ['About Us', 'Careers', 'Contact Us', 'Search', 'Find a Broker', 'Product Overview', 'Mobile', 'Terms of Use', 'Privacy Notice', 'Cookie Policy', 'Exercise Your Rights', 'Licensing']
const SOCIAL = ['in', 'f', 'IG', 'YT', 'TT']
const APPS = ['Download on the App Store', 'Get it on Google Play']
const FONT = { fontSize: 'shell/footer/font-size', lineHeight: 'shell/footer/line-height', fontWeight: 'shell/footer/font-weight' }
const text = (name, chars, fill) => ({ k: 'text', name, chars, ...FONT, fill })
// A grey footer link; one that opens another site carries the Link's new-tab icon (0.875em
// = 14px, 0.25em = 4px after the text, as Link.module.css sizes it).
const link = (label, external) => external
  ? { k: 'frame', name: label, dir: 'H', align: 'start', cross: 'center', gap: 4, children: [text(`${label} text`, label, 'shell/footer/link-text'), { k: 'icon', name: `${label} opens in a new tab`, icon: 'external-link', size: 14, color: 'shell/footer/link-text' }] }
  : text(label, label, 'shell/footer/link-text')
const column = ([title, links, external]) => ({
  k: 'frame', name: `${title} column`, dir: 'V', align: 'start', cross: 'start', gap: 'shell/footer/heading-gap', fr: 1,
  children: [
    text(`${title} heading`, title, 'shell/footer/heading-text'),
    { k: 'frame', name: `${title} links`, dir: 'V', align: 'start', cross: 'start', gap: 'shell/footer/link-gap', stretch: true, children: links.map((l) => link(l, external)) },
  ],
})
function columns(width) {
  if (width === 'Desktop') return { k: 'frame', name: 'Columns', dir: 'H', align: 'start', cross: 'start', gap: 'shell/footer/column-gap', stretch: true, children: COLUMNS.map(column) }
  // Phones: one list of links, each with a line under it, edge to edge.
  return {
    k: 'frame', name: 'Phone links', dir: 'V', align: 'start', cross: 'start', stretch: true,
    children: PHONE_LINKS.map((l) => ({
      k: 'frame', name: `${l} item`, dir: 'H', align: 'start', cross: 'center', stretch: true,
      padY: 'shell/footer/phone-links/padding-block', padX: 'shell/footer/phone-links/padding-inline',
      stroke: 'shell/footer/phone-links/line-color', strokeWidth: 'shell/footer/phone-links/line-width', strokeSides: { bottom: 'shell/footer/phone-links/line-width' },
      children: [text(l, l, 'shell/footer/link-text')],
    })),
  }
}
const brandFor = (width) => ({
  k: 'frame', name: 'Brand', dir: 'V', align: 'start', cross: width === 'Desktop' ? 'start' : 'center', gap: 'shell/footer/brand-item-gap', stretch: true,
  ...(width === 'Desktop' ? {} : { padX: 'shell/footer/padding-x-compact' }),
  children: [
    {
      k: 'frame', name: 'Logo', dir: 'H', align: 'start', cross: 'center', gap: 'shell/logo/gap',
      children: [
        {
          k: 'frame', name: 'Mark', dir: 'H', align: 'center', cross: 'center', size: 'shell/logo/mark-size', radius: 'shell/logo/mark-size', stroke: 'shell/logo/mark-border', strokeWidth: 'shell/logo/mark-border-width',
          children: [{ k: 'text', name: 'Initials', chars: 'AC', fontSize: 'shell/logo/mark-font-size', lineHeight: 'shell/footer/line-height', fill: 'shell/footer/heading-text' }],
        },
        { k: 'text', name: 'Name', chars: 'AcmeCo', fontSize: 'shell/logo/font-size', lineHeight: 'shell/logo/line-height', fontWeight: 'shell/logo/font-weight', fill: 'shell/footer/heading-text' },
      ],
    },
    text('Connect with us', 'Connect with us', 'shell/footer/heading-text'),
    {
      k: 'frame', name: 'Social', dir: 'H', align: 'start', cross: 'center', gap: 'shell/footer/social-gap',
      // Named placeholder marks, not the networks' logos (decision 35, E); screen readers hear "AcmeCo on LinkedIn".
      children: SOCIAL.map((m, i) => ({
        k: 'frame', name: i === 0 ? 'Social mark' : `Social mark ${i + 1}`, dir: 'H', align: 'center', cross: 'center', size: 'shell/footer/social-size', radius: 'shell/footer/social-size',
        fill: 'shell/header/background', stroke: 'shell/footer/social-border', strokeWidth: 'shell/logo/mark-border-width',
        children: [{ k: 'text', name: `Social initials ${i + 1}`, chars: m, fontSize: 'shell/footer/social-font-size', lineHeight: 'shell/footer/line-height', fill: 'shell/footer/heading-text' }],
      })),
    },
    text('Copyright', '© 2026 · Prototype · AcmeCo is a fictional brand', 'shell/footer/heading-text'),
    { k: 'frame', name: 'Apps', dir: 'H', align: width === 'Desktop' ? 'start' : 'center', cross: 'start', gap: 'shell/footer/column-gap', wrapGap: 'shell/footer/link-gap', wrap: true, stretch: true, children: APPS.map((a) => link(a, true)) },
  ],
})

export const footer = {
  id: 'footer',
  name: 'Footer',
  page: 'Footer',
  storybook: 'AcmeCo / Footer',
  code: 'src/components/Footer/Footer.tsx',
  guidance: 'src/components/Footer/Footer.guidance.md',
  tokens: 'tokens/components/shell.json',
  tokenPrefix: 'shell.footer.',
  status: 'Ready',
  axes: { Width: Object.keys(WIDTHS) },
  grid: { columns: null, rowGroups: null, rows: 'Width' },
  gridNote: 'On every page, after the main content: five columns of grey links (three on tablets), then the brand block; on phones AcmeCo\'s one list of links with lines between them, and the brand block centred. Marketplace and app links open in a new tab. Social marks and app links are named placeholders, not the providers\' artwork; the copyright is placeholder wording.',
  properties: [],
  variants: Object.keys(WIDTHS).map((Width) => ({
    props: { Width },
    tree: {
      k: 'frame', dir: 'V', width: WIDTHS[Width], align: 'start', cross: 'start',
      fill: 'shell/footer/background', stroke: 'shell/footer/line-color', strokeWidth: 'shell/footer/line-width', strokeSides: { top: 'shell/footer/line-width' },
      children: [{
        k: 'frame', name: 'Inner', dir: 'V', align: 'start', cross: 'start', gap: 'shell/footer/brand-gap', stretch: true,
        // Phones: no side padding on the list (its lines run edge to edge); the brand block has its own.
        ...(Width === 'Desktop' ? { padX: 'shell/footer/padding', padY: 'shell/footer/padding' } : { padY: 'shell/footer/padding-y-compact' }),
        children: [columns(Width), brandFor(Width)],
      }],
    },
  })),
  anatomy: [
    { part: 'Footer', tokens: 'shell/footer/background (#f3f3f3), a 2px shell/footer/line on top; padding 48px (24 / 32px on phones)', at: 'right' },
    { part: 'Column', tokens: 'a heading (ink, 16px regular) over grey links (shell/footer/link-text), 8px apart; columns 16px apart', layer: 'Search column', at: 'top' },
    { part: 'New-tab link', tokens: 'the Link\'s new-tab icon after the text; "opens in a new tab" for screen readers', layer: 'AcmeCo Homes', at: 'top' },
    { part: 'Brand block', tokens: 'shell/footer/brand-gap (48px) below the columns; placeholder mark, "Connect with us", 32px social placeholders, copyright, app links, 16px apart', layer: 'Brand', at: 'left' },
  ],
  anatomyVariant: { Width: 'Desktop' },
  parity: {
    story: ['acmeco-footer--default', { id: 'acmeco-footer--phone-links', width: 375 }],
    cells: 'footer',
    order: Object.keys(WIDTHS).map((Width) => ({ Width })),
    parts: [
      { name: 'Footer', css: ':scope', layer: null, fields: ['bg', 'borderTop'] },
      { name: 'Inner', css: "[class*='_inner_']", layer: 'Inner', fields: ['padT', 'padL'], only: { Width: 'Desktop' } },
      { name: 'Columns', css: "[class*='_columns_']", layer: 'Columns', fields: ['gap'], only: { Width: 'Desktop' } },
      { name: 'Search column', css: "[class*='_column_']", layer: 'Search column', fields: ['gap', 'startInset'], only: { Width: 'Desktop' } },
      { name: 'Heading', css: "[class*='_heading_']", layer: 'Search heading', fields: ['font', 'color'], only: { Width: 'Desktop' } },
      { name: 'Links', css: "[class*='_links_']", layer: 'Search links', fields: ['gap'], only: { Width: 'Desktop' } },
      { name: 'Link', css: "[class*='_links_'] a", layer: 'Properties For Sale', fields: ['font', 'color'], only: { Width: 'Desktop' } },
      { name: 'Phone link', css: "[class*='_phoneLinks_'] li", layer: 'About Us item', fields: ['padT', 'padL', 'borderBottom', 'startInset', 'w'], only: { Width: 'Phone' } },
      { name: 'Phone link text', css: "[class*='_phoneLinks_'] a", layer: 'About Us', fields: ['font', 'color'], only: { Width: 'Phone' } },
      { name: 'Brand', css: "[class*='_brand_']", layer: 'Brand', fields: ['gap'] },
      { name: 'Mark', css: "[class*='_mark_']", layer: 'Mark', fields: ['w', 'border', 'radius'] },
      { name: 'Social mark', css: "[class*='_socialMark_']", layer: 'Social mark', fields: ['w', 'bg', 'border'] },
      { name: 'Social', css: "[class*='_social_']", layer: 'Social', fields: ['gap'] },
    ],
  },
  specsBy: null,
  specs: () => ['shell/footer/padding', 'shell/footer/column-gap', 'shell/footer/row-gap', 'shell/footer/heading-gap', 'shell/footer/link-gap', 'shell/footer/brand-gap', 'shell/footer/brand-item-gap', 'shell/footer/social-size'],
}
