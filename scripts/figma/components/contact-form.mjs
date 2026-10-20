// ContactForm's Figma spec. Mirrors src/components/ContactForm/ContactForm.tsx and its CSS
// (tree format: see button.mjs). The dialog's frame follows the Dialog spec (md); the
// broker, fields, select and buttons are instances of their own sets, as the code
// composes them. The message box is drawn here with the field tokens: the Text field set
// has no multiline variant (the code's TextField takes `multiline`).

const STATES = ['Form', 'Problems', 'Sent']
const LISTING = 'Larkspur Commons'
const MESSAGE = `Hi, I found ${LISTING} on AcmeCo and would like to learn more about it. Thanks!`
const ERRORS = { 'First name': 'Enter your first name.', 'Last name': 'Enter your last name.', Email: 'Enter your email address.', Phone: 'Enter your phone number.' }
const link = { fill: 'link/inline/text/default', underline: { thickness: 'link/underline/thickness', offset: 'link/underline/offset' } }
const note = (name, chars, links) => ({
  k: 'text', name, chars, stretch: true, links: links.map((text) => ({ text, ...link })),
  fontSize: 'contact-form/note/font-size', lineHeight: 'contact-form/note/line-height', fill: 'contact-form/note/color',
})

// A Text field instance: the label says "required" with the code's visual asterisk; the box
// starts empty (no placeholders in the code); a problem shows under it after sending.
function field(name, { required = true, problems = false, ...extra } = {}) {
  const invalid = problems && ERRORS[name]
  return {
    k: 'instance', name, set: 'Text field', props: { Size: 'md', State: invalid ? 'Invalid' : 'Default' },
    text: { Label: required ? `${name} *` : name, ...(invalid ? { 'Error message': ERRORS[name] } : {}) },
    overrides: [{ layer: 'Value', chars: '' }], ...extra,
  }
}
const pair = (name, children) => ({ k: 'frame', name, dir: 'H', align: 'start', cross: 'start', gap: 'contact-form/column-gap', stretch: true, children })

// The message: a 3-row box (the code's rows={3}: 3 × 24px lines, 8px padding, 1px border)
// with the counter under it, right-aligned.
const message = {
  k: 'frame', name: 'Message', dir: 'V', align: 'start', cross: 'start', gap: 'field/gap', stretch: true,
  children: [
    { k: 'text', name: 'Message label', chars: 'Message *', fontSize: 'field/label/font-size', lineHeight: 'field/label/line-height', fontWeight: 'field/label/font-weight', fill: 'field/label/color', stretch: true },
    {
      k: 'frame', name: 'Message box', dir: 'V', align: 'start', cross: 'start', stretch: true, height: 90,
      padY: 'field/control/gap', padX: 'field/control/md/padding-x', radius: 'field/control/radius',
      fill: 'field/control/background/default', stroke: 'field/control/border/default', strokeWidth: 'field/control/border-width',
      children: [{ k: 'text', name: 'Message text', chars: MESSAGE, fontSize: 'field/control/md/font-size', lineHeight: 'field/control/md/line-height', fill: 'field/control/text/default', stretch: true }],
    },
    { k: 'text', name: 'Counter', chars: `${MESSAGE.length} / 400`, textAlign: 'right', fontSize: 'field/hint/font-size', lineHeight: 'field/hint/line-height', fill: 'field/hint/color', stretch: true },
  ],
}

function body(state) {
  if (state === 'Sent') {
    return [{ k: 'text', name: 'Sent', chars: 'Message sent to Jordan Ellis. They will reply to sam@example.com.', fontSize: 'contact-form/sent/font-size', lineHeight: 'contact-form/sent/line-height', fill: 'contact-form/sent/color', stretch: true }]
  }
  const problems = state === 'Problems'
  return [
    {
      k: 'frame', name: 'About', dir: 'V', align: 'start', cross: 'start', gap: 'contact-form/column-gap', stretch: true,
      children: [
        { k: 'instance', name: 'Broker', set: 'Broker identity', props: { Layout: 'Row', Brokers: '1' } },
        note('About note', `About ${LISTING}. Already a member? Log in`, ['Log in']),
      ],
    },
    {
      k: 'frame', name: 'Form', dir: 'V', align: 'start', cross: 'start', gap: 'contact-form/gap', stretch: true,
      children: [
        pair('Name', [field('First name', { problems, fr: 1 }), field('Last name', { problems, fr: 1 })]),
        field('Email', { problems, stretch: true }),
        // Phone wider than the extension (the CSS's 2fr | 1fr).
        pair('Phone and ext', [field('Phone', { problems, fr: 2 }), field('Ext (optional)', { required: false, fr: 1 })]),
        {
          k: 'instance', name: 'Space', set: 'Select', props: { Appearance: 'Field', Size: 'md', State: 'Placeholder' }, stretch: true,
          text: { Label: 'How much space do you need? (optional)' }, overrides: [{ layer: 'Value', chars: 'Select size' }],
        },
        message,
        note('Terms', 'New to AcmeCo? We\'ll create a free account with these details so you can follow up. By sending, you agree to the Terms of Use and Privacy Notice. (Placeholder wording.)', ['Terms of Use', 'Privacy Notice']),
      ],
    },
  ]
}

export const contactForm = {
  id: 'contact-form',
  name: 'Contact form',
  page: 'Contact form',
  storybook: 'AcmeCo / ContactForm',
  code: 'src/components/ContactForm/ContactForm.tsx',
  guidance: 'src/components/ContactForm/ContactForm.guidance.md',
  tokens: 'tokens/components/contact-form.json',
  tokenPrefix: 'contact-form.',
  status: 'Ready',
  uses: ['Icon button', 'Button', 'Broker identity', 'Text field', 'Select'],
  axes: { State: STATES },
  grid: { columns: 'State', rowGroups: null, rows: null },
  gridNote: 'The contact broker dialog (Dialog md, 500px; full screen at 768px and below). Form: as it opens, the message prefilled. Problems: after sending it empty, each problem under its field (focus moves to the first). Sent: the confirmation, with Done. Fields, select, broker and buttons are instances of their sets.',
  properties: [],
  variants: STATES.map((State) => ({
    props: { State },
    tree: {
      k: 'frame', dir: 'V', width: 'dialog/width/md', align: 'start', cross: 'start',
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
        { k: 'frame', name: 'Body', dir: 'V', align: 'start', cross: 'start', gap: 'contact-form/gap', padX: 'dialog/padding', padBottom: 'dialog/padding', stretch: true, children: body(State) },
        {
          k: 'frame', name: 'Footer', dir: 'H', align: 'end', gap: 'dialog/footer/gap', padY: 'dialog/footer/padding-block', padX: 'dialog/padding', stretch: true,
          fill: 'dialog/footer/background', stroke: 'dialog/footer/border-color', strokeWidth: 'dialog/footer/border-width', strokeSides: { top: 'dialog/footer/border-width' },
          children: [{ k: 'instance', name: 'Send', set: 'Button', props: { Variant: 'primary', Size: 'md', State: 'Default' }, text: { Label: State === 'Sent' ? 'Done' : 'Contact Broker' } }],
        },
      ],
    },
  })),
  anatomy: [
    { part: 'Dialog', tokens: 'Dialog md: dialog/width/md (500px), radius, shadow/raised; a stray click can\'t close it (decision 28)', at: 'right' },
    { part: 'About', tokens: 'a Broker identity instance (the lead broker) and a note in contact-form/note/* (14px, secondary grey); contact-form/column-gap apart', layer: 'About', at: 'left' },
    { part: 'Fields', tokens: 'Text field and Select instances, contact-form/gap apart; pairs contact-form/column-gap apart (names 1fr | 1fr, phone 2fr | 1fr); required marked * and in words for screen readers', layer: 'Name', at: 'left' },
    { part: 'Message', tokens: 'field tokens, 3 rows, a counter in field/hint/* under it', layer: 'Message box', at: 'left' },
    { part: 'Send', tokens: 'a primary Button (md) in the dialog footer; it sends the form', layer: 'Send', at: 'top' },
  ],
  anatomyVariant: { State: 'Form' },
  parity: {
    story: ['acmeco-contactform--open', 'acmeco-contactform--open-with-errors'],
    cells: "[class*='_modal_']",
    order: [{ State: 'Form' }, { State: 'Problems' }],
    parts: [
      { name: 'Dialog', css: ':scope', layer: null, fields: ['bg', 'radius', 'w', 'h'] },
      { name: 'Body', css: "[class*='_body_']", layer: 'Body', fields: ['padL', 'padR', 'padB'] },
      { name: 'Form', css: 'form', layer: 'Form', fields: ['gap', 'w', 'h', 'topInset'] },
      { name: 'About note', css: "[class*='_about_'] p", layer: 'About note', fields: ['font', 'color', 'w'] },
      { name: 'First name', css: "form > div:nth-child(1) > div:nth-child(1)", layer: 'First name', fields: ['w', 'h'] },
      { name: 'Last name', css: "form > div:nth-child(1) > div:nth-child(2)", layer: 'Last name', fields: ['w', 'h', 'startInset'] },
      { name: 'Email', css: 'form > div:nth-child(2)', layer: 'Email', fields: ['w', 'h'] },
      { name: 'Phone', css: "form > div:nth-child(3) > div:nth-child(1)", layer: 'Phone', fields: ['w', 'h'] },
      { name: 'Ext', css: "form > div:nth-child(3) > div:nth-child(2)", layer: 'Ext (optional)', fields: ['w', 'h', 'startInset'] },
      { name: 'Space', css: "form [class*='_select_']", layer: 'Space', fields: ['w', 'h'] },
      { name: 'Message box', css: "form [class*='_multiline_']", layer: 'Message box', fields: ['bg', 'border', 'radius', 'w', 'h', 'padT', 'padL'] },
      { name: 'Counter', css: "[class*='_counter_']", layer: 'Counter', fields: ['font', 'color', 'endInset'] },
      { name: 'Terms', css: 'form > p', layer: 'Terms', fields: ['font', 'color', 'h'] },
      // Size only: the Problems story's test clicks Send, which stays hovered (colours are checked on the Button page).
      { name: 'Send', css: "[class*='_footer_'] button", layer: 'Send', fields: ['h', 'w', 'endInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['contact-form/gap', 'contact-form/column-gap', 'contact-form/note/font-size', 'contact-form/note/line-height', 'contact-form/sent/font-size', 'dialog/width/md', 'dialog/padding'],
}
