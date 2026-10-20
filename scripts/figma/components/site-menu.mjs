// SiteMenu's Figma spec: the open menu panel. Mirrors src/components/SiteMenu/SiteMenu.module.css
// (tree format: see button.mjs). A Popover panel (white, 8px corners, 1px line,
// shadow/raised) whose 280px of rows run edge to edge: Log In/Sign Up in dark blue, AcmeCo's
// links, the Search group (a Disclosure row) and Preferences / Help Center, with inset lines
// between groups. Rows turn grey on hover (Storybook). It opens from the header's Menu
// Icon button.

const SEARCH = ['Closed', 'Open']
const row = (label, opts = {}) => ({
  k: 'frame', name: opts.name ?? label, dir: 'H', align: 'between', cross: 'center', minHeight: 'site-menu/item/min-height', padX: 'site-menu/item/padding-x', stretch: true,
  children: [
    { k: 'text', name: opts.textName ?? `${label} text`, chars: label, fontSize: 'site-menu/item/font-size', lineHeight: 'site-menu/item/line-height', fontWeight: opts.sub ? 'site-menu/sub-item/font-weight' : 'site-menu/item/font-weight', fill: opts.fill ?? 'link/subtle/text/default' },
    ...(opts.external ? [{ k: 'icon', name: 'Opens in a new tab', icon: 'external-link', size: 'site-menu/external-icon-size', color: 'link/subtle/text/default' }] : []),
    ...(opts.chevron ? [{ k: 'icon', name: 'Chevron', icon: 'chevron-down', rotate: opts.open ? 180 : 0, size: 'disclosure/trigger/chevron-size', color: 'disclosure/trigger/text' }] : []),
  ],
})
// The line between groups: 1px, inset like the text, site-menu/divider/gap above and below.
const divider = (i) => ({
  k: 'frame', name: `Divider ${i}`, dir: 'V', align: 'start', cross: 'start', padX: 'site-menu/item/padding-x', padY: 'site-menu/divider/gap', stretch: true,
  children: [{ k: 'frame', name: `Divider line ${i}`, dir: 'H', height: 'site-menu/divider/width', stroke: 'site-menu/divider/color', strokeWidth: 'site-menu/divider/width', strokeSides: { top: 'site-menu/divider/width' }, stretch: true, children: [] }],
})
const group = (name, rows) => ({ k: 'frame', name, dir: 'V', align: 'start', cross: 'start', stretch: true, children: rows })

function tree(search) {
  const open = search === 'Open'
  return {
    // The panel: the menu cancels the popover's side padding, so rows reach its edges.
    k: 'frame', dir: 'V', align: 'start', cross: 'start', padY: 'popover/padding',
    radius: 'popover/radius', fill: 'popover/background', stroke: 'popover/border', strokeWidth: 'popover/border-width', effect: 'shadow/raised',
    children: [{
      k: 'frame', name: 'Menu', dir: 'V', width: 'site-menu/width', align: 'start', cross: 'start',
      children: [
        group('Account', [row('Log In/Sign Up', { name: 'Log In/Sign Up', fill: 'site-menu/login-text' })]),
        divider(1),
        group('Marketing', [row('Explore Marketing Solutions'), row('Advertise'), row('Marketing Center', { external: true, name: 'Marketing Center' })]),
        divider(2),
        group('Search', [
          row('Search', { name: 'Search button', textName: 'Search title', chevron: true, open }),
          ...(open ? ['For Lease', 'For Sale', 'Auctions', 'Businesses', 'Find a Broker'].map((l) => row(l, { sub: true })) : []),
        ]),
        divider(3),
        group('Help', [row('Preferences'), row('Help Center')]),
      ],
    }],
  }
}

export const siteMenu = {
  id: 'site-menu',
  name: 'Site menu',
  page: 'Site menu',
  storybook: 'AcmeCo / SiteMenu',
  code: 'src/components/SiteMenu/SiteMenu.tsx',
  guidance: 'src/components/SiteMenu/SiteMenu.guidance.md',
  tokens: 'tokens/components/site-menu.json',
  tokenPrefix: 'site-menu.',
  status: 'Ready',
  axes: { Search: SEARCH },
  grid: { columns: 'Search', rowGroups: null, rows: null },
  gridNote: 'The panel the header\'s Menu button opens (a Popover, 4px under the button, right edges aligned). Rows are 40px and run edge to edge; hovered rows turn grey with no underline (Storybook). Log In/Sign Up opens the sign-in dialog; Marketing Center opens in a new tab; Search shows or hides its five links.',
  properties: [],
  variants: SEARCH.map((Search) => ({ props: { Search }, tree: tree(Search) })),
  anatomy: [
    { part: 'Panel', tokens: 'a Popover: popover/radius (8px), 1px popover/border, shadow/raised; site-menu/width (280px) of rows', at: 'right' },
    { part: 'Log In/Sign Up', tokens: 'site-menu/login-text (dark blue), opens the sign-in dialog', layer: 'Log In/Sign Up', at: 'left' },
    { part: 'Row', tokens: 'site-menu/item/min-height (40px), padding-x (16px), 16px semibold; grey on hover (site-menu/item/background-hover)', layer: 'Advertise', at: 'left' },
    { part: 'External link', tokens: 'a 16px icon at the row\'s end (site-menu/external-icon-size); "opens in a new tab" for screen readers', layer: 'Opens in a new tab', at: 'top' },
    { part: 'Divider', tokens: '1px site-menu/divider/color, inset 16px, site-menu/divider/gap (8px) above and below', layer: 'Divider 2', at: 'left' },
    { part: 'Search', tokens: 'a Disclosure row; its links at the regular weight (site-menu/sub-item/font-weight)', layer: 'Search button', at: 'left' },
  ],
  anatomyVariant: { Search: 'Closed' },
  parity: {
    story: [
      { id: 'acmeco-sitemenu--default', clicks: ["button[aria-label='Menu']"] },
      { id: 'acmeco-sitemenu--default', clicks: ["button[aria-label='Menu']", "nav[aria-label='Site'] button"] },
    ],
    cells: "[class*='_popover_']",
    order: SEARCH.map((Search) => ({ Search })),
    parts: [
      { name: 'Panel', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'padT', 'h'] },
      { name: 'Menu', css: "nav[aria-label='Site']", layer: 'Menu', fields: ['w'] },
      // The link fills its row (the CSS moves the row's padding onto it), so it is the row here.
      { name: 'Log In/Sign Up row', css: "[class*='_login_'] a", layer: 'Log In/Sign Up', fields: ['startInset', 'padL', 'h'] },
      { name: 'Log In/Sign Up', css: "[class*='_login_'] a", layer: 'Log In/Sign Up text', fields: ['font', 'color'] },
      { name: 'Row', css: "a[href='#advertise']", layer: 'Advertise', fields: ['h', 'padL'] },
      { name: 'Row text', css: "a[href='#advertise']", layer: 'Advertise text', fields: ['font', 'color'] },
      { name: 'External icon', css: "a[href='#marketing-center'] svg", layer: 'Opens in a new tab', fields: ['w', 'endInset'] },
      { name: 'Search button', css: "nav[aria-label='Site'] button", layer: 'Search button', fields: ['h', 'padL'] },
      { name: 'Search title', css: "nav[aria-label='Site'] button span", layer: 'Search title', fields: ['font', 'color'] },
      { name: 'Sub link', css: "a[href='#find-a-broker']", layer: 'Find a Broker text', fields: ['font', 'color'], only: { Search: 'Open' } },
    ],
  },
  specsBy: null,
  specs: () => ['site-menu/width', 'site-menu/item/min-height', 'site-menu/item/padding-x', 'site-menu/item/font-size', 'site-menu/external-icon-size', 'site-menu/divider/width', 'site-menu/divider/gap'],
}
