// Dialog's Figma spec. Mirrors src/components/Dialog/Dialog.module.css rule for rule (tree
// format: see button.mjs). Its Close and footer buttons are instances of the Icon button
// and Button sets, as the code composes them. The backdrop isn't part of the component;
// the grid shows each size on it.

const SIZES = ['md', 'lg']

export const dialog = {
  id: 'dialog',
  name: 'Dialog',
  page: 'Dialog',
  storybook: 'Components / Dialog',
  code: 'src/components/Dialog/Dialog.tsx',
  guidance: 'src/components/Dialog/Dialog.guidance.md',
  tokens: 'tokens/components/dialog.json',
  tokenPrefix: 'dialog.',
  status: 'Ready',
  uses: ['Button', 'Icon button'],
  axes: { Size: SIZES },
  grid: { columns: 'Size', rowGroups: null, rows: null, backdrops: [{ when: {}, fill: 'dialog/backdrop', label: 'backdrop' }] },
  gridNote: 'Shown on the backdrop (dialog/backdrop). At 768px and below every size is full screen with no corners, and footer buttons fill the width. Body text is a stand-in: put the dialog\'s content there.',
  properties: [
    { name: 'Title', type: 'TEXT', default: 'Contact broker', layer: 'Title' },
    { name: 'Body', type: 'TEXT', default: 'Follow your favourite listings, get instant alerts and save time on future inquiries with a free account.', layer: 'Body text' },
    { name: 'Show footer', type: 'BOOLEAN', default: true, layer: 'Footer' },
  ],
  variants: SIZES.map((Size) => ({
    props: { Size },
    tree: {
      k: 'frame', dir: 'V', width: `dialog/width/${Size}`, align: 'start', cross: 'start',
      radius: 'dialog/radius', fill: 'dialog/background', effect: 'shadow/raised', clip: true,
      children: [
        {
          k: 'frame', name: 'Header', dir: 'H', align: 'between', cross: 'start', gap: 'dialog/header/gap', stretch: true,
          padTop: 'dialog/padding', padX: 'dialog/padding', padBottom: 'dialog/header/padding-bottom',
          children: [
            { k: 'text', name: 'Title', chars: 'Contact broker', fontSize: 'dialog/title/font-size', lineHeight: 'dialog/title/line-height', fontWeight: 'dialog/title/font-weight', fill: 'dialog/title/color', stretch: true },
            { k: 'instance', name: 'Close', set: 'Icon button', props: { Variant: 'plain', Size: 'sm', State: 'Default' }, icons: { Icon: 'close' } },
          ],
        },
        {
          k: 'frame', name: 'Body', dir: 'V', align: 'start', cross: 'start', padX: 'dialog/padding', padBottom: 'dialog/padding', stretch: true,
          children: [
            { k: 'text', name: 'Body text', chars: 'Follow your favourite listings, get instant alerts and save time on future inquiries with a free account.', fontSize: 'dialog/body/font-size', lineHeight: 'dialog/body/line-height', fill: 'dialog/body/color', stretch: true },
          ],
        },
        {
          k: 'frame', name: 'Footer', dir: 'H', align: 'end', gap: 'dialog/footer/gap', padY: 'dialog/footer/padding-block', padX: 'dialog/padding', stretch: true,
          fill: 'dialog/footer/background', stroke: 'dialog/footer/border-color', strokeWidth: 'dialog/footer/border-width',
          strokeSides: { top: 'dialog/footer/border-width' },
          children: [
            { k: 'instance', name: 'Primary action', set: 'Button', props: { Variant: 'primary', Size: 'md', State: 'Default' }, text: { Label: 'Send message' } },
          ],
        },
      ],
    },
  })),
  anatomy: [
    { part: 'Container', tokens: 'dialog/width/{size} (500 or 768px), dialog/radius (8px), dialog/background, shadow/raised; full screen at 768px and below', at: 'right' },
    { part: 'Title', tokens: 'dialog/title/font-size, line-height, font-weight (heading 3); dialog/padding around it; it names the dialog', layer: 'Title', at: 'top' },
    { part: 'Close', tokens: 'an Icon button (plain, sm) labelled "Close"', layer: 'Close', at: 'top' },
    { part: 'Body', tokens: 'dialog/body/font-size, line-height; scrolls between header and footer; can take focus when it scrolls', layer: 'Body', at: 'left' },
    { part: 'Footer', tokens: 'dialog/footer/padding-block, dialog/footer/gap, 1px dialog/footer/border-color on top; stays put while the body scrolls', layer: 'Footer', at: 'left' },
  ],
  anatomyVariant: { Size: 'md' },
  // Parity with the code: the open dialog in two stories (md with a footer, lg without).
  parity: {
    story: ['components-dialog--open-medium', 'components-dialog--open-large'],
    cells: "[class*='_modal_']",
    order: SIZES.map((Size) => ({ Size })),
    parts: [
      { name: 'Dialog', css: ':scope', layer: null, fields: ['bg', 'radius', 'w'] },
      { name: 'Header', css: "[class*='_header_']", layer: 'Header', fields: ['padT', 'padB', 'padL', 'padR', 'gap'] },
      { name: 'Title', css: "[class*='_title_']", layer: 'Title', fields: ['font', 'color', 'startInset'] },
      { name: 'Close', css: "button[aria-label='Close']", layer: 'Close', fields: ['bg', 'w', 'h', 'radius', 'endInset'] },
      { name: 'Body', css: "[class*='_body_']", layer: 'Body', fields: ['padL', 'padR', 'padB'] },
      { name: 'Body text', css: "[class*='_body_']", layer: 'Body text', fields: ['font', 'color'] },
      { name: 'Footer', css: "[class*='_footer_']", layer: 'Footer', fields: ['bg', 'borderTop', 'padT', 'padB', 'padL', 'padR', 'gap'], only: { Size: 'md' } },
      { name: 'Footer button', css: "[class*='_footer_'] button", layer: 'Primary action', fields: ['bg', 'h', 'endInset'], only: { Size: 'md' } },
    ],
  },
  specsBy: 'Size',
  specs: (size) => [`dialog/width/${size}`, 'dialog/radius', 'dialog/padding', 'dialog/header/padding-bottom', 'dialog/footer/padding-block', 'dialog/footer/gap'],
}
