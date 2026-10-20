// Card's Figma spec. Mirrors src/components/Card/Card.module.css (tree format: see
// button.mjs). The content is a space's facts, drawn at the card's width (a Fact list
// instance can't shrink: Figma has no 45 / 55 split that follows a resize); replace it with
// what the card holds. Raised has 32px padding on desktop and 16px on phones (768px and
// below): set the padding to card/padding/raised-phone on a phone frame.

const APPEARANCES = ['Outline', 'Raised']
const FACTS = [['Size', '1,850 SF'], ['Rental Rate', '$28.50 /SF/YR'], ['Space Use', 'Office'], ['Availability', 'Now']]
const type = { fontSize: 'fact-list/font-size', lineHeight: 'fact-list/line-height', fontWeight: 'fact-list/font-weight' }

export const card = {
  id: 'card',
  name: 'Card',
  page: 'Card',
  storybook: 'Components / Card',
  code: 'src/components/Card/Card.tsx',
  guidance: 'src/components/Card/Card.guidance.md',
  tokens: 'tokens/components/card.json',
  tokenPrefix: 'card.',
  status: 'Ready (decision 47)',
  axes: { Appearance: APPEARANCES },
  grid: { columns: 'Appearance', rowGroups: null, rows: null },
  gridNote: 'Shown 400px wide. Outline: a listing\'s facts or one space. Raised: a broker\'s panels (16px padding on phones). The content is one space\'s facts; replace it with what the card holds. Turn Show heading off for a plain box.',
  properties: [
    { name: 'Heading', type: 'TEXT', default: 'Floor 2, Suite 200', layer: 'Heading' },
    { name: 'Show heading', type: 'BOOLEAN', default: true, layer: 'Heading' },
  ],
  variants: APPEARANCES.map((Appearance) => {
    const raised = Appearance === 'Raised'
    return {
      props: { Appearance },
      tree: {
        k: 'frame', dir: 'V', align: 'start', cross: 'start', width: 400, gap: 'card/gap',
        padX: raised ? 'card/padding/raised' : 'card/padding/outline', padY: raised ? 'card/padding/raised' : 'card/padding/outline',
        fill: 'card/background', stroke: 'card/border', strokeWidth: 'card/border-width', radius: 'card/radius',
        ...(raised ? { effect: 'shadow/card' } : {}),
        children: [
          { k: 'text', name: 'Heading', chars: 'Floor 2, Suite 200', fontSize: 'heading/size/heading-3/font-size', lineHeight: 'heading/size/heading-3/line-height', fontWeight: 'heading/size/heading-3/font-weight', fill: 'heading/color', stretch: true },
          {
            k: 'frame', name: 'Content', dir: 'V', align: 'start', cross: 'start', gap: 'fact-list/row-gap', stretch: true,
            children: FACTS.map(([label, value], i) => ({
              k: 'frame', name: `Fact ${i + 1}`, dir: 'H', align: 'start', cross: 'start', gap: 'fact-list/column-gap', stretch: true,
              children: [
                { k: 'text', name: i === 0 ? 'Label' : `Label ${i + 1}`, chars: label, ...type, fill: 'fact-list/label', fr: 9 },
                { k: 'text', name: i === 0 ? 'Value' : `Value ${i + 1}`, chars: value, ...type, fill: 'fact-list/value', fr: 11 },
              ],
            })),
          },
        ],
      },
    }
  }),
  anatomy: [
    { part: 'Surface', tokens: 'card/background, 1px card/border, card/radius (8px); Raised adds the card shadow (shadow/card)', at: 'right' },
    { part: 'Padding', tokens: 'card/padding/outline (16px) or card/padding/raised (32px; 16px on phones)', layer: 'Heading', at: 'left' },
    { part: 'Heading', tokens: 'heading-3 (20/30); names the card as a section', layer: 'Heading', at: 'top' },
    { part: 'Content', tokens: 'what the card holds (here a space\'s facts, as Fact list draws them), card/gap (12px) below the heading', layer: 'Content', at: 'bottom' },
  ],
  anatomyVariant: { Appearance: 'Raised' },
  parity: {
    story: 'components-card--states-matrix',
    order: APPEARANCES.map((Appearance) => ({ Appearance })),
    parts: [
      { name: 'Card', css: '[data-appearance]', layer: null, fields: ['bg', 'border', 'radius', 'padT', 'padL', 'gap', 'w'] },
      { name: 'Heading', css: 'h2', layer: 'Heading', fields: ['font', 'color', 'startInset', 'topInset'] },
      { name: 'First label', css: 'dt', layer: 'Label', fields: ['font', 'color', 'startInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['card/padding/outline', 'card/padding/raised', 'card/padding/raised-phone', 'card/gap', 'card/radius', 'card/border-width'],
}
