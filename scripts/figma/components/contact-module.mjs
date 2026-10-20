// ContactModule's Figma spec. Mirrors src/components/ContactModule/ContactModule.module.css
// (tree format: see button.mjs). The contact box in the property detail page's sidebar:
// phone, Message (opens Contact form), the Contact heading, the brokers (a Broker identity
// instance, sidebar layout) and Share | Save. Shown 340px wide, as on AcmeCo.

const COUNTS = ['1', '2', '3']
const action = (name, icon) => ({
  k: 'frame', name, dir: 'H', align: 'center', cross: 'center', stretch: true, height: 'contact-module/action-height',
  // The second half has a line on its left (the CSS's .action + .action).
  ...(name === 'Save action' ? { stroke: 'contact-module/divider', strokeWidth: 'contact-module/border-width', strokeSides: { left: 'contact-module/border-width' } } : {}),
  children: [{ k: 'instance', name: name.replace(' action', ''), set: 'Icon button', props: { Variant: 'plain', Size: 'md', State: 'Default' }, icons: { Icon: icon } }],
})

export const contactModule = {
  id: 'contact-module',
  name: 'Contact module',
  page: 'Contact module',
  storybook: 'AcmeCo / ContactModule',
  code: 'src/components/ContactModule/ContactModule.tsx',
  guidance: 'src/components/ContactModule/ContactModule.guidance.md',
  tokens: 'tokens/components/contact-module.json',
  tokenPrefix: 'contact-module.',
  status: 'Ready',
  uses: ['Icon button', 'Button', 'Broker identity'],
  axes: { Brokers: COUNTS },
  grid: { columns: 'Brokers', rowGroups: null, rows: null },
  gridNote: 'The contact box beside a listing, 340px as on AcmeCo. Message opens the Contact form; the phone number is a call link. Save shows only when the page can save. Brokers, buttons and icon buttons are instances of their sets.',
  properties: [
    { name: 'Phone', type: 'TEXT', default: '(303) 555-0187', layer: 'Phone number' },
    { name: 'Show save', type: 'BOOLEAN', default: true, layer: 'Save action' },
  ],
  variants: COUNTS.map((Brokers) => ({
    props: { Brokers },
    tree: {
      k: 'frame', dir: 'V', width: 340, align: 'start', cross: 'start',
      radius: 'contact-module/radius', fill: 'contact-module/background', stroke: 'contact-module/border-color', strokeWidth: 'contact-module/border-width',
      effect: 'shadow/raised', clip: true,
      children: [
        {
          k: 'frame', name: 'Body', dir: 'V', align: 'start', cross: 'start', gap: 'contact-module/gap', padX: 'contact-module/padding', padY: 'contact-module/padding', stretch: true,
          children: [
            {
              k: 'frame', name: 'Phone', dir: 'H', align: 'center', cross: 'center', gap: 'contact-module/gap', stretch: true,
              children: [
                { k: 'icon', name: 'Phone icon', icon: 'phone', size: 'contact-module/phone/icon-size', color: 'contact-module/heading/color' },
                { k: 'text', name: 'Phone number', chars: '(303) 555-0187', fontSize: 'contact-module/phone/font-size', lineHeight: 'contact-module/phone/line-height', fontWeight: 'contact-module/phone/font-weight', fill: 'link/subtle/text/default' },
              ],
            },
            { k: 'instance', name: 'Message', set: 'Button', props: { Variant: 'primary', Size: 'lg', State: 'Default' }, text: { Label: 'Message' }, stretch: true },
            { k: 'text', name: 'Heading', chars: 'Contact', fontSize: 'contact-module/heading/font-size', lineHeight: 'contact-module/heading/line-height', fontWeight: 'contact-module/heading/font-weight', fill: 'contact-module/heading/color', stretch: true },
            { k: 'instance', name: 'Brokers', set: 'Broker identity', props: { Layout: 'Sidebar', Brokers }, stretch: true },
          ],
        },
        {
          k: 'frame', name: 'Actions', dir: 'H', align: 'start', cross: 'start', stretch: true,
          stroke: 'contact-module/divider', strokeWidth: 'contact-module/border-width', strokeSides: { top: 'contact-module/border-width' },
          children: [action('Share action', 'share'), action('Save action', 'heart')],
        },
      ],
    },
  })),
  anatomy: [
    { part: 'Box', tokens: 'contact-module/radius (8px), background, 1px border-color, shadow/raised', at: 'right' },
    { part: 'Phone', tokens: 'contact-module/phone/* (24px, regular), a 24px phone icon; a call link (subtle)', layer: 'Phone', at: 'left' },
    { part: 'Message', tokens: 'a primary Button (lg), full width; opens the Contact form', layer: 'Message', at: 'left' },
    { part: 'Contact heading', tokens: 'contact-module/heading/* (heading 3); its level is set by the page', layer: 'Heading', at: 'left' },
    { part: 'Brokers', tokens: 'a Broker identity instance (sidebar: 80px photos, logo under them)', layer: 'Brokers', at: 'left' },
    { part: 'Share | Save', tokens: 'plain Icon buttons (md) in two halves contact-module/action-height tall, under a 1px contact-module/divider and split by one', layer: 'Actions', at: 'left' },
  ],
  anatomyVariant: { Brokers: '1' },
  parity: {
    story: ['acmeco-contactmodule--default', 'acmeco-contactmodule--three-brokers'],
    cells: 'aside',
    order: [{ Brokers: '1' }, { Brokers: '3' }],
    parts: [
      { name: 'Box', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'w', 'h'] },
      { name: 'Body', css: "[class*='_body_']", layer: 'Body', fields: ['padT', 'padL', 'gap'] },
      { name: 'Phone', css: "[class*='_phone_']", layer: 'Phone', fields: ['gap', 'h'] },
      { name: 'Phone number', css: "[class*='_phone_'] a", layer: 'Phone number', fields: ['font', 'color'] },
      // Size only: the Default story's test clicks Message and leaves it hovered (colours are checked on the Button page).
      { name: 'Message', css: "[class*='_body_'] > button", layer: 'Message', fields: ['w', 'h'] },
      { name: 'Heading', css: 'h3', layer: 'Heading', fields: ['font', 'color', 'topInset'] },
      { name: 'Brokers', css: "[class*='_broker_']", layer: 'Brokers', fields: ['w', 'h'] },
      { name: 'Actions', css: "[class*='_actions_']", layer: 'Actions', fields: ['borderTop', 'h'] },
      { name: 'Save action', css: "[class*='_action_']:nth-child(2)", layer: 'Save action', fields: ['borderLeft', 'w', 'h'] },
    ],
  },
  specsBy: null,
  specs: () => ['contact-module/radius', 'contact-module/padding', 'contact-module/gap', 'contact-module/phone/font-size', 'contact-module/phone/icon-size', 'contact-module/heading/font-size', 'contact-module/action-height'],
}
