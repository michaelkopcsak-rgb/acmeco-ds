// Disclosure's Figma spec: the button that shows or hides a group, open or closed, in
// each state. Mirrors src/components/Disclosure/Disclosure.module.css (tree format: see
// button.mjs). The group's content follows it with no indent.

const EXPANDED = ['No', 'Yes']
const STATES = ['Default', 'Hover', 'Focus']

export const disclosure = {
  id: 'disclosure',
  name: 'Disclosure',
  page: 'Disclosure',
  storybook: 'Components / Disclosure',
  code: 'src/components/Disclosure/Disclosure.tsx',
  guidance: 'src/components/Disclosure/Disclosure.guidance.md',
  tokens: 'tokens/components/disclosure.json',
  tokenPrefix: 'disclosure.',
  status: 'Ready',
  axes: { Expanded: EXPANDED, State: STATES },
  grid: { columns: 'Expanded', rowGroups: null, rows: 'State' },
  gridNote: 'The button (264px shown; it fills its container). Open, the chevron points up and the group\'s content follows below it, aligned with the text (disclosure/panel/padding-start is 0). In the header menu the rows run edge to edge with the menu\'s grey hover (SiteMenu).',
  properties: [{ name: 'Title', type: 'TEXT', default: 'Search', layer: 'Title' }],
  variants: EXPANDED.flatMap((Expanded) => STATES.map((State) => ({
    props: { Expanded, State },
    tree: {
      k: 'frame', dir: 'H', width: 264, align: 'between', minHeight: 'disclosure/trigger/min-height', padX: 'disclosure/trigger/padding-x', gap: 'disclosure/trigger/gap',
      radius: 'disclosure/trigger/radius', fill: State === 'Hover' ? 'disclosure/trigger/background-hover' : undefined,
      focus: State === 'Focus' ? { ring: 'disclosure/focus-ring/color', width: 'disclosure/focus-ring/width', offset: 'disclosure/focus-ring/offset' } : null,
      children: [
        { k: 'text', name: 'Title', chars: 'Search', fontSize: 'disclosure/trigger/font-size', lineHeight: 'disclosure/trigger/line-height', fontWeight: 'disclosure/trigger/font-weight', fill: 'disclosure/trigger/text' },
        // Open, the chevron turns to point up (the code rotates chevron-down 180°).
        { k: 'icon', name: 'Chevron', icon: 'chevron-down', rotate: Expanded === 'Yes' ? 180 : 0, size: 'disclosure/trigger/chevron-size', color: 'disclosure/trigger/text' },
      ],
    },
  }))),
  anatomy: [
    { part: 'Button', tokens: 'disclosure/trigger/min-height (40px), padding-x (8px), radius (4px); grey on hover', at: 'right' },
    { part: 'Title', tokens: 'disclosure/trigger/font-size (16px), semibold, ink', layer: 'Title', at: 'left' },
    { part: 'Chevron', tokens: 'disclosure/trigger/chevron-size (16px); points up when open', layer: 'Chevron', at: 'top' },
  ],
  anatomyVariant: { Expanded: 'No', State: 'Default' },
  parity: {
    story: ['components-disclosure--default', 'components-disclosure--open'],
    cells: "#storybook-root [slot='trigger']",
    order: [{ Expanded: 'No', State: 'Default' }, { Expanded: 'Yes', State: 'Default' }],
    parts: [
      { name: 'Button', css: ':scope', layer: null, fields: ['radius', 'h', 'padL', 'gap'] },
      { name: 'Title', css: 'span', layer: 'Title', fields: ['font', 'color', 'startInset'] },
      { name: 'Chevron', css: 'svg', layer: 'Chevron', fields: ['endInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['disclosure/trigger/min-height', 'disclosure/trigger/padding-x', 'disclosure/trigger/gap', 'disclosure/trigger/radius', 'disclosure/trigger/chevron-size'],
}
