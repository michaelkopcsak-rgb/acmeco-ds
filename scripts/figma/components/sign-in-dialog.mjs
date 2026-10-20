// SignInDialog's Figma spec. Mirrors src/components/SignInDialog/SignInDialog.module.css
// (tree format: see button.mjs). Dialog lg (768px): AcmeCo's promo carousel on the left,
// reaching the dialog's edges, and the email form on the right; the email field and
// Continue are Text field and Button instances. On phones (full screen) the form comes
// first and the promo follows; that layout is in Storybook ("Open: phone").

const STATES = ['Default', 'Problem']
const PROVIDERS = [['Google', 'G'], ['LinkedIn', 'in'], ['Apple', 'A']]

const provider = ([name, mark]) => ({
  k: 'frame', name: `Continue with ${name}`, dir: 'H', align: 'center', cross: 'center', size: 'sign-in/provider/size',
  radius: 'sign-in/provider/size', fill: 'sign-in/provider/background', stroke: 'sign-in/provider/border', strokeWidth: 'dialog/footer/border-width',
  // A neutral placeholder mark, not the provider's logo (decision 31).
  children: [{ k: 'text', name: 'Mark', chars: mark, fontSize: 'sign-in/promo/title-font-size', lineHeight: 'sign-in/promo/title-line-height', fontWeight: 'sign-in/promo/title-font-weight', fill: 'sign-in/provider/text' }],
})
// "or continue with", a line either side (the CSS's ::before and ::after, 1px top borders).
const line = (name) => ({ k: 'frame', name, dir: 'H', stretch: true, height: 'dialog/footer/border-width', stroke: 'sign-in/divider/line', strokeWidth: 'dialog/footer/border-width', strokeSides: { top: 'dialog/footer/border-width' }, children: [] })
const dot = (i) => ({
  k: 'frame', name: `Dot ${i + 1}`, dir: 'H', align: 'center', cross: 'center', size: 'sign-in/dot/target',
  children: [{
    k: 'frame', name: `Dot mark ${i + 1}`, dir: 'H', width: i === 0 ? 'sign-in/dot/current-width' : 'sign-in/dot/size', height: 'sign-in/dot/size',
    radius: 'sign-in/dot/size', fill: i === 0 ? 'sign-in/dot/current-color' : 'sign-in/dot/color', children: [],
  }],
})

function account(state) {
  return {
    // As tall as the promo (the taller of the two), content centred; the body's bottom
    // padding sits under it.
    k: 'frame', name: 'Account', dir: 'V', align: 'center', cross: 'start', gap: 'sign-in/gap', stretch: true, fillHeight: true, padBottom: 'dialog/padding',
    children: [
      { k: 'text', name: 'Intro', chars: 'Enter your email to log in or create a free account.', textAlign: 'center', fontSize: 'sign-in/intro/font-size', lineHeight: 'sign-in/intro/line-height', fill: 'sign-in/intro/color', stretch: true },
      {
        k: 'frame', name: 'Form', dir: 'V', align: 'start', cross: 'start', gap: 'sign-in/gap', stretch: true,
        children: [
          {
            k: 'instance', name: 'Email', set: 'Text field', props: { Size: 'md', State: state === 'Problem' ? 'Invalid' : 'Default' }, stretch: true,
            text: { Label: 'Email *', ...(state === 'Problem' ? { 'Error message': 'Enter your email address.' } : {}) }, overrides: [{ layer: 'Value', chars: '' }],
          },
          { k: 'instance', name: 'Continue', set: 'Button', props: { Variant: 'primary', Size: 'lg', State: 'Default' }, text: { Label: 'Continue' }, stretch: true },
        ],
      },
      {
        k: 'frame', name: 'Divider', dir: 'H', align: 'start', cross: 'center', gap: 'sign-in/gap', stretch: true,
        children: [line('Line start'), { k: 'text', name: 'Divider text', chars: 'or continue with', fontSize: 'sign-in/divider/font-size', lineHeight: 'sign-in/divider/line-height', fill: 'sign-in/divider/text' }, line('Line end')],
      },
      { k: 'frame', name: 'Providers', dir: 'H', align: 'center', cross: 'center', gap: 'sign-in/provider/gap', stretch: true, children: PROVIDERS.map(provider) },
    ],
  }
}

const promo = {
  // Half the body plus the dialog padding it reaches over (the CSS's negative margins):
  // (768 - 2 × 24 - 24) / 2 + 24 = 372px.
  k: 'frame', name: 'Promo', dir: 'V', align: 'center', cross: 'center', gap: 'sign-in/promo/gap', width: 372,
  padX: 'sign-in/promo/padding', padY: 'sign-in/promo/padding', fill: 'sign-in/promo/background',
  children: [
    {
      k: 'frame', name: 'Slide', dir: 'V', align: 'start', cross: 'center', gap: 'sign-in/promo/gap', stretch: true,
      children: [
        { k: 'text', name: 'Slide title', chars: 'Never miss a deal', textAlign: 'center', fontSize: 'sign-in/promo/title-font-size', lineHeight: 'sign-in/promo/title-line-height', fontWeight: 'sign-in/promo/title-font-weight', fill: 'sign-in/promo/text-color' },
        { k: 'frame', name: 'Slide image', dir: 'H', width: 'sign-in/promo/image-width', height: 'sign-in/promo/image-height', radius: 'dialog/radius', image: 's01', clip: true, children: [] },
        { k: 'text', name: 'Slide text', chars: 'Receive new listings that match your saved searches.', textAlign: 'center', fontSize: 'sign-in/intro/font-size', lineHeight: 'sign-in/intro/line-height', fill: 'sign-in/promo/text-color', stretch: true },
      ],
    },
    { k: 'frame', name: 'Dots', dir: 'H', align: 'start', cross: 'center', children: [0, 1, 2, 3].map(dot) },
  ],
}

export const signInDialog = {
  id: 'sign-in-dialog',
  name: 'Sign-in dialog',
  page: 'Sign-in dialog',
  storybook: 'AcmeCo / SignInDialog',
  code: 'src/components/SignInDialog/SignInDialog.tsx',
  guidance: 'src/components/SignInDialog/SignInDialog.guidance.md',
  tokens: 'tokens/components/sign-in.json',
  tokenPrefix: 'sign-in.',
  status: 'Ready',
  uses: ['Icon button', 'Button', 'Text field'],
  axes: { State: STATES },
  grid: { columns: 'State', rowGroups: null, rows: null },
  gridNote: 'Dialog lg (768px): promo | form. Problem: Continue with the email empty (focus moves to the field). On phones the dialog is full screen, the form first and the promo below (Storybook: Open: phone). Sign-in marks are neutral placeholders, not the providers\' logos. The slide picture is a placeholder illustration.',
  properties: [
    { name: 'Slide title', type: 'TEXT', default: 'Never miss a deal', layer: 'Slide title' },
    { name: 'Slide text', type: 'TEXT', default: 'Receive new listings that match your saved searches.', layer: 'Slide text' },
  ],
  variants: STATES.map((State) => ({
    props: { State },
    tree: {
      k: 'frame', dir: 'V', width: 'dialog/width/lg', align: 'start', cross: 'start',
      radius: 'dialog/radius', fill: 'dialog/background', effect: 'shadow/raised', clip: true,
      children: [
        {
          k: 'frame', name: 'Header', dir: 'H', align: 'between', cross: 'start', gap: 'dialog/header/gap', stretch: true,
          padTop: 'dialog/padding', padX: 'dialog/padding', padBottom: 'dialog/header/padding-bottom',
          children: [
            { k: 'text', name: 'Title', chars: 'Log in or sign up', fontSize: 'dialog/title/font-size', lineHeight: 'dialog/title/line-height', fontWeight: 'dialog/title/font-weight', fill: 'dialog/title/color', stretch: true },
            { k: 'instance', name: 'Close', set: 'Icon button', props: { Variant: 'plain', Size: 'sm', State: 'Default' }, icons: { Icon: 'close' } },
          ],
        },
        { k: 'frame', name: 'Body', dir: 'H', align: 'start', cross: 'start', gap: 'dialog/padding', padRight: 'dialog/padding', stretch: true, children: [promo, account(State)] },
      ],
    },
  })),
  anatomy: [
    { part: 'Dialog', tokens: 'Dialog lg: dialog/width/lg (768px), radius, shadow/raised; a stray click can\'t close it', at: 'right' },
    { part: 'Promo', tokens: 'sign-in/promo/* (grey, 24px padding, 16px gaps), reaching the dialog\'s edges; picture 272 × 248 with dialog/radius corners', layer: 'Promo', at: 'left' },
    { part: 'Dots', tokens: '8px marks (sign-in/dot/size) in 24px targets; the current one a 16px pill in ink, not just darker', layer: 'Dots', at: 'bottom' },
    { part: 'Email and Continue', tokens: 'a Text field and a primary Button (lg), sign-in/gap apart', layer: 'Form', at: 'end' },
    { part: 'Sign-in options', tokens: 'round 48px buttons (sign-in/provider/*), 1px control border, named "Continue with …"; neutral placeholder marks', layer: 'Providers', at: 'end' },
  ],
  anatomyVariant: { State: 'Default' },
  parity: {
    story: ['acmeco-signindialog--open'],
    cells: "[class*='_modal_']",
    order: [{ State: 'Default' }],
    parts: [
      { name: 'Dialog', css: ':scope', layer: null, fields: ['bg', 'radius', 'w', 'h'] },
      { name: 'Promo', css: "[class*='_promo_']", layer: 'Promo', fields: ['bg', 'w', 'h', 'padT', 'padL', 'gap'] },
      { name: 'Slide title', css: "[class*='_slideTitle_']", layer: 'Slide title', fields: ['font', 'color', 'topInset'] },
      { name: 'Slide image', css: "[class*='_slideImage_']", layer: 'Slide image', fields: ['w', 'h', 'radius', 'startInset'] },
      { name: 'Slide text', css: "[class*='_slideText_']", layer: 'Slide text', fields: ['font', 'color', 'align'] },
      { name: 'Current dot', css: "button[aria-current='true'] [class*='_dotMark_']", layer: 'Dot mark 1', fields: ['bg', 'w', 'h', 'radius'] },
      { name: 'Dot', css: "button:not([aria-current]) [class*='_dotMark_']", layer: 'Dot mark 2', fields: ['bg', 'w', 'h'] },
      { name: 'Account', css: "[class*='_account_']", layer: 'Account', fields: ['w', 'gap', 'startInset'] },
      { name: 'Intro', css: "[class*='_intro_']", layer: 'Intro', fields: ['font', 'color', 'align', 'topInset'] },
      { name: 'Continue', css: "form button", layer: 'Continue', fields: ['bg', 'w', 'h'] },
      { name: 'Divider text', css: "[class*='_divider_']", layer: 'Divider text', fields: ['font', 'color'] },
      { name: 'Provider', css: "[class*='_provider_']", layer: 'Continue with Google', fields: ['bg', 'border', 'radius', 'w', 'h', 'startInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['dialog/width/lg', 'sign-in/gap', 'sign-in/provider/size', 'sign-in/provider/gap', 'sign-in/promo/padding', 'sign-in/promo/gap', 'sign-in/promo/image-width', 'sign-in/promo/image-height', 'sign-in/dot/size', 'sign-in/dot/target'],
}
