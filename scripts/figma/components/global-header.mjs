// GlobalHeader's Figma spec. Mirrors src/components/GlobalHeader/GlobalHeader.module.css
// (tree format: see button.mjs). AcmeCo's 64px header with its 2px dark blue top line, at three
// widths: desktop (search links), tablet (768px: links in the menu) and phone (375px: the
// logo, the globe and the menu, decision 42). Phone listings (decision 51, a phone
// recording): a back arrow before the logo; scrolled past the actions row, save and share in
// place of the globe and menu. The logo is a neutral placeholder mark and the name (decision 35); the
// links, Sign In, the globe and the menu are instances of their sets. The skip link shows
// only on keyboard focus (Storybook).

const WIDTHS = { Desktop: 1440, Tablet: 768, Phone: 375 }
const iconButton = (name, icon) => ({ k: 'instance', name, set: 'Icon button', props: { Variant: 'plain', Size: 'md', State: 'Default' }, icons: { Icon: icon } })

function tree(width, page = 'Default') {
  const wide = width === 'Desktop', compact = width !== 'Desktop'
  const gap = compact ? 'shell/header/gap-compact' : 'shell/header/gap'
  return {
    k: 'frame', dir: 'H', width: WIDTHS[width], height: 'shell/header/height', align: 'between', cross: 'center', gap, padX: 'shell/header/padding-x',
    fill: 'shell/header/background', stroke: 'shell/header/stripe-color', strokeWidth: 'shell/header/stripe-width', strokeSides: { top: 'shell/header/stripe-width' },
    children: [
      {
        k: 'frame', name: 'Start', dir: 'H', align: 'start', cross: 'center', gap,
        children: [
          ...(page !== 'Default' ? [{
            k: 'frame', name: 'Back', dir: 'H', align: 'start', cross: 'center', height: 48, padRight: 'shell/header/gap-compact',
            stroke: 'shell/header/divider-color', strokeWidth: 'shell/header/divider-width', strokeSides: { right: 'shell/header/divider-width' },
            children: [iconButton('Back to search results', 'arrow-left')],
          }] : []),
          {
            k: 'frame', name: 'Logo', dir: 'H', align: 'start', cross: 'center', gap: 'shell/logo/gap',
            children: [
              {
                k: 'frame', name: 'Mark', dir: 'H', align: 'center', cross: 'center', size: 'shell/logo/mark-size', radius: 'shell/logo/mark-size',
                stroke: 'shell/logo/mark-border', strokeWidth: 'shell/logo/mark-border-width',
                children: [{ k: 'text', name: 'Initials', chars: 'AC', fontSize: 'shell/logo/mark-font-size', lineHeight: 'shell/logo/line-height', fill: 'shell/logo/mark-text' }],
              },
              { k: 'text', name: 'Name', chars: 'AcmeCo', fontSize: 'shell/logo/font-size', lineHeight: 'shell/logo/line-height', fontWeight: 'shell/logo/font-weight', fill: 'shell/header/text' },
            ],
          },
          ...(wide ? [{ k: 'instance', name: 'Search links', set: 'Navigation bar', props: { Orientation: 'Horizontal' } }] : []),
        ],
      },
      {
        k: 'frame', name: 'End', dir: 'H', align: 'end', cross: 'center', gap,
        children: page === 'Listing scrolled'
          ? [iconButton('Save', 'heart'), iconButton('Share', 'share')]
          : [
            iconButton('Language and region', 'globe'),
            // At 450px and below Sign In and Advertise move into the menu.
            ...(width !== 'Phone' ? [
              { k: 'instance', name: 'Sign In', set: 'Button', props: { Variant: 'tertiary', Size: 'md', State: 'Default' }, text: { Label: 'Sign In' } },
              { k: 'text', name: 'Advertise', chars: 'Advertise', fontSize: 'shell/nav/font-size', lineHeight: 'shell/nav/line-height', fill: 'link/subtle/text/default' },
            ] : []),
            iconButton('Menu', 'menu'),
          ],
      },
    ],
  }
}

export const globalHeader = {
  id: 'global-header',
  name: 'Global header',
  page: 'Global header',
  storybook: 'AcmeCo / GlobalHeader',
  code: 'src/components/GlobalHeader/GlobalHeader.tsx',
  guidance: 'src/components/GlobalHeader/GlobalHeader.guidance.md',
  tokens: 'tokens/components/shell.json',
  tokenPrefix: 'shell.header.',
  status: 'Ready',
  uses: ['Navigation bar', 'Icon button', 'Button'],
  axes: { Width: Object.keys(WIDTHS), Page: ['Default', 'Listing', 'Listing scrolled'] },
  grid: { columns: null, rowGroups: 'Page', rows: 'Width' },
  gridNote: 'On every page (decision 35): the placeholder mark and "AcmeCo" (home), the search links (desktop), the globe (Language and currency dialog), Sign In (sign-in dialog), Advertise and the Menu. At 768px and below the search links move into the menu; at 450px and below Sign In and Advertise do too. Phone listings (decision 51): a back arrow, and save and share once the listing\'s actions row has scrolled under the header. The skip link appears over the top-left corner on keyboard focus.',
  properties: [],
  variants: [...Object.keys(WIDTHS).map((Width) => ({ props: { Width, Page: 'Default' }, tree: tree(Width) })),
    ...['Listing', 'Listing scrolled'].map((Page) => ({ props: { Width: 'Phone', Page }, tree: tree('Phone', Page) }))],
  anatomy: [
    { part: 'Header', tokens: 'shell/header/height (64px), padding-x (16px), white, a 2px dark blue line on top (shell/header/stripe-*)', at: 'right' },
    { part: 'Logo', tokens: 'a 32px placeholder mark (shell/logo/mark-*) and "AcmeCo" at 18px semibold; links home', layer: 'Logo', at: 'left' },
    { part: 'Search links', tokens: 'a Navigation bar (desktop only)', layer: 'Search links', at: 'top' },
    { part: 'Actions', tokens: 'globe (Icon button), Sign In (tertiary Button), Advertise (subtle Link), Menu (Icon button); shell/header/gap (24px), 8px at 768px and below', layer: 'End', at: 'top' },
  ],
  anatomyVariant: { Width: 'Desktop', Page: 'Default' },
  parity: {
    story: [{ id: 'acmeco-globalheader--current-page' }, { id: 'acmeco-globalheader--current-page', width: 768 }, { id: 'acmeco-globalheader--current-page', width: 375 }],
    cells: 'header',
    order: Object.keys(WIDTHS).map((Width) => ({ Width, Page: 'Default' })),
    parts: [
      { name: 'Header', css: ':scope', layer: null, fields: ['bg', 'borderTop', 'h', 'padL', 'padR', 'gap'] },
      { name: 'Start', css: "[class*='_start_']", layer: 'Start', fields: ['gap'] },
      { name: 'Logo', css: "[class*='_logo_']", layer: 'Logo', fields: ['gap', 'startInset'] },
      { name: 'Mark', css: "[class*='_mark_']", layer: 'Mark', fields: ['w', 'h', 'border', 'radius'] },
      { name: 'Name', css: "[class*='_logo_'] > span:nth-child(2)", layer: 'Name', fields: ['font', 'color'] },
      { name: 'Search links', css: "nav[aria-label='Search']", layer: 'Search links', fields: ['w'] },
      { name: 'End', css: "[class*='_end_']", layer: 'End', fields: ['gap', 'endInset'] },
      { name: 'Globe', css: "button[aria-label='Language and region']", layer: 'Language and region', fields: ['w', 'h'] },
      { name: 'Advertise', css: "a[href='#advertise']", layer: 'Advertise', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['shell/header/height', 'shell/header/padding-x', 'shell/header/gap', 'shell/header/gap-compact', 'shell/header/stripe-width', 'shell/logo/mark-size', 'shell/logo/gap', 'shell/logo/font-size'],
}
