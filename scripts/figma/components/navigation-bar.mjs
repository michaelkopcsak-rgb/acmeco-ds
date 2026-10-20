// NavigationBar's Figma spec. Mirrors src/components/NavigationBar/NavigationBar.module.css
// (tree format: see button.mjs). AcmeCo's search links: a row in the header, a list of
// 40px rows in a phone menu. The current page is underlined (aria-current), so it isn't
// marked by colour alone; the links are subtle Links (ink, underline on hover).

const ORIENTATIONS = ['Horizontal', 'Vertical']
const LINKS = ['For Lease', 'For Sale', 'Auctions', 'Businesses For Sale']
const linkText = (label, current) => ({
  k: 'text', name: current ? 'Current link' : label, chars: label, fontSize: 'shell/nav/font-size', lineHeight: 'shell/nav/line-height', fill: 'link/subtle/text/default',
  ...(current ? { underline: { thickness: 'link/underline/thickness-hover', offset: 'link/underline/offset' } } : {}),
})

export const navigationBar = {
  id: 'navigation-bar',
  name: 'Navigation bar',
  page: 'Navigation bar',
  storybook: 'AcmeCo / NavigationBar',
  code: 'src/components/NavigationBar/NavigationBar.tsx',
  guidance: 'src/components/NavigationBar/NavigationBar.guidance.md',
  tokens: 'tokens/components/shell.json',
  tokenPrefix: ['shell.nav.', 'shell.header.text'], // its links are the header's text pair
  status: 'Ready',
  axes: { Orientation: ORIENTATIONS },
  grid: { columns: 'Orientation', rowGroups: null, rows: null },
  gridNote: 'The header\'s search links (Horizontal, 24px apart) and the same links as 40px rows in a phone menu (Vertical). The first link is shown as the current page: underlined at 2px. Links are subtle Links: ink, underlined on hover, with the system focus ring.',
  properties: [],
  variants: ORIENTATIONS.map((Orientation) => ({
    props: { Orientation },
    tree: Orientation === 'Horizontal'
      ? { k: 'frame', dir: 'H', align: 'start', cross: 'center', gap: 'shell/nav/gap', children: LINKS.map((l, i) => linkText(l, i === 0)) }
      : {
          k: 'frame', dir: 'V', align: 'start', cross: 'start', gap: 'shell/nav/gap-vertical',
          children: LINKS.map((l, i) => ({ k: 'frame', name: i === 0 ? 'Current item' : 'Item', dir: 'H', align: 'start', cross: 'center', minHeight: 'shell/nav/item-min-height', children: [linkText(l, i === 0)] })),
        },
  })),
  anatomy: [
    { part: 'Link', tokens: 'shell/nav/font-size (16px), a subtle Link (ink); shell/nav/gap (24px) apart', layer: 'For Sale', at: 'top' },
    { part: 'Current page', tokens: 'underlined at link/underline/thickness-hover (2px), link/underline/offset (3px); announced as the current page', layer: 'Current link', at: 'left' },
  ],
  anatomyVariant: { Orientation: 'Horizontal' },
  parity: {
    story: ['acmeco-navigationbar--horizontal', 'acmeco-navigationbar--vertical'],
    cells: '#storybook-root ul',
    order: ORIENTATIONS.map((Orientation) => ({ Orientation })),
    parts: [
      { name: 'List', css: ':scope', layer: null, fields: ['gap'] },
      { name: 'Current link', css: "a[aria-current='page']", layer: 'Current link', fields: ['font', 'color', 'underline'] },
      { name: 'Link', css: 'li:nth-child(2) a', layer: 'For Sale', fields: ['font', 'color', 'underline'] },
      { name: 'Item', css: 'li:nth-child(2)', layer: 'Item', fields: ['h'], only: { Orientation: 'Vertical' } },
    ],
  },
  specsBy: null,
  specs: () => ['shell/nav/gap', 'shell/nav/gap-vertical', 'shell/nav/font-size', 'shell/nav/line-height', 'shell/nav/item-min-height'],
}
