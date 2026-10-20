// LocaleDialog's Figma spec. Mirrors src/components/LocaleDialog/LocaleDialog.tsx on the
// Dialog spec (tree format: see button.mjs): Dialog md titled "Language and currency", a
// Tabs instance (Language and Region | Currency) over a grid of Choice card instances,
// three across, and "View My Preferences" (a standalone Link) in the footer. Opens from
// the header's globe.

const TABS = ['Language', 'Currency']
const OPTIONS = {
  Language: [['English', 'United States'], ['English', 'Canada'], ['English', 'United Kingdom'], ['Español', 'España'], ['Français', 'Canada'], ['Français', 'France']],
  Currency: [['US Dollar', 'USD $'], ['Australian Dollar', 'AUD $'], ['Canadian Dollar', 'CAD $'], ['Euro', 'EUR €'], ['Pound Sterling', 'GBP £']],
}
const card = ([label, description], i) => ({
  k: 'instance', name: `${label} ${description}`, set: 'Choice card', props: { Selected: i === 0 ? 'Yes' : 'No', State: 'Default' },
  text: { Label: label, Description: description }, fr: 1,
})
// Three across (the code's grid, choice-cards/gap apart); an empty cell keeps a short row's cards the same width.
function grid(options) {
  const rows = []
  for (let i = 0; i < options.length; i += 3) {
    const cells = options.slice(i, i + 3).map((o, j) => card(o, i + j))
    while (cells.length < 3) cells.push({ k: 'frame', name: 'Empty cell', dir: 'H', fr: 1, height: 'choice-cards/min-height', children: [] })
    rows.push({ k: 'frame', name: `Row ${i / 3 + 1}`, dir: 'H', align: 'start', cross: 'start', gap: 'choice-cards/gap', stretch: true, children: cells })
  }
  return { k: 'frame', name: 'Choices', dir: 'V', align: 'start', cross: 'start', gap: 'choice-cards/gap', stretch: true, children: rows }
}

export const localeDialog = {
  id: 'locale-dialog',
  name: 'Locale dialog',
  page: 'Locale dialog',
  storybook: 'AcmeCo / LocaleDialog',
  code: 'src/components/LocaleDialog/LocaleDialog.tsx',
  guidance: 'src/components/LocaleDialog/LocaleDialog.guidance.md',
  tokens: 'tokens/components/dialog.json',
  // Its own parts' pairs: the dialog's title, the tabs and the cards (not the other dialogs').
  tokenPrefix: ['dialog.title', 'tabs.', 'choice-cards.'],
  status: 'Ready',
  uses: ['Icon button', 'Tabs', 'Choice card', 'Link'],
  axes: { Tab: TABS },
  grid: { columns: 'Tab', rowGroups: null, rows: null, backdrops: [{ when: {}, fill: 'dialog/backdrop', label: 'backdrop' }] },
  gridNote: 'The dialog the header\'s globe opens (Dialog md, on the backdrop). Choosing a card with a pointer applies it and closes the dialog; with the keyboard, arrows change the choice and Enter closes. The current language and currency are selected. Full screen at 768px and below, two cards across at 450px and below.',
  properties: [],
  variants: TABS.map((Tab) => ({
    props: { Tab },
    tree: {
      k: 'frame', dir: 'V', width: 'dialog/width/md', align: 'start', cross: 'start',
      radius: 'dialog/radius', fill: 'dialog/background', effect: 'shadow/raised', clip: true,
      children: [
        {
          k: 'frame', name: 'Header', dir: 'H', align: 'between', cross: 'start', gap: 'dialog/header/gap', stretch: true,
          padTop: 'dialog/padding', padX: 'dialog/padding', padBottom: 'dialog/header/padding-bottom',
          children: [
            { k: 'text', name: 'Title', chars: 'Language and currency', fontSize: 'dialog/title/font-size', lineHeight: 'dialog/title/line-height', fontWeight: 'dialog/title/font-weight', fill: 'dialog/title/color', stretch: true },
            { k: 'instance', name: 'Close', set: 'Icon button', props: { Variant: 'plain', Size: 'sm', State: 'Default' }, icons: { Icon: 'close' } },
          ],
        },
        {
          // The tabs' own panel is off; the cards sit tabs/panel-gap under the line, as in the code's panel.
          k: 'frame', name: 'Body', dir: 'V', align: 'start', cross: 'start', gap: 'tabs/panel-gap', padX: 'dialog/padding', padBottom: 'dialog/padding', stretch: true,
          children: [
            { k: 'instance', name: 'Tabs', set: 'Tabs', props: { Selected: Tab === 'Language' ? 'First' : 'Second' }, bools: { 'Show panel': false }, stretch: true },
            grid(OPTIONS[Tab]),
          ],
        },
        {
          k: 'frame', name: 'Footer', dir: 'H', align: 'end', gap: 'dialog/footer/gap', padY: 'dialog/footer/padding-block', padX: 'dialog/padding', stretch: true,
          fill: 'dialog/footer/background', stroke: 'dialog/footer/border-color', strokeWidth: 'dialog/footer/border-width', strokeSides: { top: 'dialog/footer/border-width' },
          children: [{ k: 'instance', name: 'View My Preferences', set: 'Link', props: { Variant: 'standalone', Context: 'body', State: 'Default' }, text: { Label: 'View My Preferences' } }],
        },
      ],
    },
  })),
  anatomy: [
    { part: 'Dialog', tokens: 'Dialog md: dialog/width/md (500px), dialog/radius (8px), shadow/raised; the title names it', at: 'right' },
    { part: 'Tabs', tokens: 'a Tabs instance: Language and Region | Currency', layer: 'Tabs', at: 'left' },
    { part: 'Choices', tokens: 'Choice card instances, three across, choice-cards/gap (16px) apart; the current one selected', layer: 'Choices', at: 'left' },
    { part: 'Footer link', tokens: 'a standalone Link to the preferences page', layer: 'View My Preferences', at: 'top' },
  ],
  anatomyVariant: { Tab: 'Language' },
  parity: {
    story: ['acmeco-localedialog--open', { id: 'acmeco-localedialog--open', clicks: ["[role=tab]:has-text('Currency')"] }],
    cells: "[class*='_modal_']",
    order: TABS.map((Tab) => ({ Tab })),
    parts: [
      { name: 'Dialog', css: ':scope', layer: null, fields: ['bg', 'radius', 'w', 'h'] },
      { name: 'Title', css: "[class*='_title_']", layer: 'Title', fields: ['font', 'color', 'startInset'] },
      { name: 'Tab list', css: '[role=tablist]', layer: 'Tabs', fields: ['w', 'topInset'] },
      { name: 'First card', css: "label[class*='_card_']", layer: 'Choices', fields: ['topInset'] },
      { name: 'Choices', css: "[class*='_grid_']", layer: 'Choices', fields: ['w', 'h', 'gap'] },
      { name: 'Footer', css: "[class*='_footer_']", layer: 'Footer', fields: ['bg', 'borderTop', 'padT', 'h'] },
      { name: 'Footer link', css: "[class*='_footer_'] a", layer: 'View My Preferences', fields: ['endInset'] }, // its colour and type are checked on the Link page
    ],
  },
  specsBy: null,
  specs: () => ['dialog/width/md', 'dialog/padding', 'choice-cards/gap', 'choice-cards/min-height'],
}
