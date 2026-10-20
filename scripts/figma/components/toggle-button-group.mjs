// ToggleButtonGroup's Figma spec. Mirrors ToggleButtonGroup.module.css (tree format: see
// button.mjs). The map placement control (decision 45): two 40px icon buttons, the chosen
// one in AcmeCo's selected style (ChoiceCards: light blue, 2px link-blue border).

const CHOSEN = ['First', 'Second']
const STATES = ['Default', 'Hover', 'Focus']
const ICONS = ['panel-left', 'panel-top']

export const toggleButtonGroup = {
  id: 'toggle-button-group',
  name: 'Toggle button group',
  page: 'Toggle button group',
  storybook: 'Components / ToggleButtonGroup',
  code: 'src/components/ToggleButtonGroup/ToggleButtonGroup.tsx',
  guidance: 'src/components/ToggleButtonGroup/ToggleButtonGroup.guidance.md',
  tokens: 'tokens/components/toggle-button-group.json',
  tokenPrefix: 'toggle-button-group.',
  status: 'Proposal (decision 45)',
  axes: { Chosen: CHOSEN, State: STATES },
  grid: { columns: 'State', rowGroups: null, rows: 'Chosen' },
  gridNote: 'Shown as the map placement: Map on the left, Map on top. Hover = the pointer over the other button; Focus = keyboard focus on the chosen one. Each button\'s name shows as a tooltip on hover and focus (ink, 14px), not drawn here.',
  properties: [],
  variants: CHOSEN.flatMap((Chosen) => STATES.map((State) => ({
    props: { Chosen, State },
    tree: {
      k: 'frame', dir: 'H', gap: 'toggle-button-group/gap',
      children: ICONS.map((icon, i) => {
        const chosen = (i === 0) === (Chosen === 'First')
        return {
          k: 'frame', name: i === 0 ? 'First' : 'Second', dir: 'H', size: 'toggle-button-group/size', radius: 'toggle-button-group/radius',
          fill: chosen ? 'toggle-button-group/background/selected' : State === 'Hover' ? 'toggle-button-group/background/hover' : 'toggle-button-group/background/default',
          stroke: chosen ? 'toggle-button-group/border/selected' : 'transparent', strokeWidth: 'toggle-button-group/border-width',
          focus: chosen && State === 'Focus' ? { ring: 'toggle-button-group/focus-ring/color', width: 'toggle-button-group/focus-ring/width', offset: 'toggle-button-group/focus-ring/offset' } : null,
          children: [{ k: 'icon', name: i === 0 ? 'First icon' : 'Second icon', icon, size: 'toggle-button-group/icon-size', color: 'toggle-button-group/icon' }],
        }
      }),
    },
  }))),
  anatomy: [
    { part: 'Button', tokens: 'toggle-button-group/size (40px), toggle-button-group/radius, a transparent 2px border; hover toggle-button-group/background/hover', layer: 'Second', at: 'top' },
    { part: 'Chosen', tokens: 'toggle-button-group/background/selected and a 2px toggle-button-group/border/selected, so it isn\'t colour alone', layer: 'First', at: 'left' },
    { part: 'Icon', tokens: 'toggle-button-group/icon-size, toggle-button-group/icon', layer: 'First icon', at: 'bottom' },
  ],
  anatomyVariant: { Chosen: 'First', State: 'Default' },
  parity: {
    story: 'components-togglebuttongroup--states-matrix',
    order: CHOSEN.flatMap((Chosen) => STATES.map((State) => ({ Chosen, State }))),
    parts: [
      { name: 'Group', css: '[role=radiogroup]', layer: null, fields: ['gap'] },
      { name: 'First', css: '[role=radio]:nth-of-type(1)', layer: 'First', fields: ['bg', 'border', 'radius', 'w', 'h', 'ring'] },
      { name: 'Second', css: '[role=radio]:nth-of-type(2)', layer: 'Second', fields: ['bg', 'border', 'radius', 'w', 'h', 'ring'] },
      { name: 'First icon', css: '[role=radio]:nth-of-type(1) svg', layer: 'First icon', fields: ['icon'] },
    ],
  },
  specsBy: null,
  specs: () => ['toggle-button-group/size', 'toggle-button-group/gap', 'toggle-button-group/radius', 'toggle-button-group/icon-size', 'toggle-button-group/border-width'],
}
