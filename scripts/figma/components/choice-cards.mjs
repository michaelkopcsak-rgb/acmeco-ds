// ChoiceCards' Figma spec: one card, selected or not, in each state. Mirrors
// src/components/ChoiceCards/ChoiceCards.module.css (tree format: see button.mjs). Place
// cards in a grid (choice-cards/gap, 16px; three columns, two on phones).

const SELECTED = ['No', 'Yes']
const STATES = ['Default', 'Hover', 'Focus', 'Disabled']

export const choiceCards = {
  id: 'choice-cards',
  name: 'Choice card',
  page: 'Choice cards',
  storybook: 'Components / ChoiceCards',
  code: 'src/components/ChoiceCards/ChoiceCards.tsx',
  guidance: 'src/components/ChoiceCards/ChoiceCards.guidance.md',
  tokens: 'tokens/components/choice-cards.json',
  tokenPrefix: 'choice-cards.',
  status: 'Ready',
  axes: { Selected: SELECTED, State: STATES },
  grid: { columns: 'Selected', rowGroups: null, rows: 'State' },
  gridNote: 'One card per option (160px shown): place them in a grid, choice-cards/gap (16px) apart, three columns (two on phones). The selected card is light blue with a 2px blue border; every card keeps a 2px border (transparent until selected), so nothing moves.',
  properties: [
    { name: 'Label', type: 'TEXT', default: 'English', layer: 'Label' },
    { name: 'Description', type: 'TEXT', default: 'United States', layer: 'Description' },
  ],
  variants: SELECTED.flatMap((Selected) => STATES.map((State) => {
    const selected = Selected === 'Yes', disabled = State === 'Disabled'
    const fill = selected ? 'choice-cards/background/selected' : State === 'Hover' ? 'choice-cards/background/hover' : 'choice-cards/background/default'
    const text = disabled ? 'choice-cards/text-disabled' : 'choice-cards/text'
    return {
      props: { Selected, State },
      tree: {
        k: 'frame', dir: 'V', width: 160, minHeight: 'choice-cards/min-height', align: 'center', cross: 'start', padX: 'choice-cards/padding', padY: 'choice-cards/padding',
        radius: 'choice-cards/radius', fill, stroke: selected ? 'choice-cards/border/selected' : 'transparent', strokeWidth: 'choice-cards/border-width',
        focus: State === 'Focus' ? { ring: 'choice-cards/focus-ring/color', width: 'choice-cards/focus-ring/width', offset: 'choice-cards/focus-ring/offset' } : null,
        children: [
          { k: 'text', name: 'Label', chars: 'English', fontSize: 'choice-cards/font-size', lineHeight: 'choice-cards/line-height', fontWeight: 'choice-cards/label-font-weight', fill: text, stretch: true },
          { k: 'text', name: 'Description', chars: 'United States', fontSize: 'choice-cards/font-size', lineHeight: 'choice-cards/line-height', fontWeight: 'choice-cards/description-font-weight', fill: text, stretch: true },
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Card', tokens: 'choice-cards/min-height (70px), padding (8px), radius (4px); a 2px border, transparent until selected', at: 'right' },
    { part: 'Label', tokens: 'choice-cards/font-size (16px), semibold (choice-cards/label-font-weight)', layer: 'Label', at: 'left' },
    { part: 'Description', tokens: 'the same size, regular (choice-cards/description-font-weight)', layer: 'Description', at: 'left' },
  ],
  anatomyVariant: { Selected: 'Yes', State: 'Default' },
  // Parity: the Currency story at rest, US Dollar selected and Australian Dollar not (hover,
  // focus and disabled aren't forced in a story; disabled is shown in "With a visible label").
  parity: {
    story: ['components-choicecards--currency'],
    cells: "#storybook-root label[class*='_card_']:nth-child(-n+2)",
    order: [{ Selected: 'Yes', State: 'Default' }, { Selected: 'No', State: 'Default' }],
    parts: [
      { name: 'Card', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'h', 'padL', 'padT'] },
      { name: 'Label', css: "[class*='_cardLabel_']", layer: 'Label', fields: ['font', 'color', 'startInset'] },
      { name: 'Description', css: "[class*='_description_']", layer: 'Description', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['choice-cards/min-height', 'choice-cards/padding', 'choice-cards/radius', 'choice-cards/border-width', 'choice-cards/gap', 'choice-cards/font-size'],
}
