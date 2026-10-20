// The Select's open list as its own Figma set. Mirrors the list rules in
// src/components/Select/Select.module.css (tree format: see button.mjs). The trigger is the
// Select set; this is what opens under it (select/popover/offset below), at least as wide
// as the trigger (320px shown, the stories' width).

const TYPES = ['Office', 'Retail', 'Industrial', 'Flex', 'Land', 'Multifamily']
const LISTS = {
  'With selection': { options: TYPES, selected: 'Retail' },
  'With disabled option': { options: [...TYPES.slice(0, 3), 'Hospitality (no listings)'], disabled: 'Hospitality (no listings)' },
}
// Every option has the same box; the selected one is semibold with a check, a disabled one grey.
// (Focused options get select/option/background-focused in code: shown in Storybook.)
function option(label, i, { selected, disabled }) {
  const isSelected = label === selected, isDisabled = label === disabled
  return {
    k: 'frame', name: `Option ${i + 1}`, dir: 'H', align: 'between', stretch: true, minHeight: 'select/option/min-height',
    padX: 'select/option/padding-x', gap: 'select/option/gap', radius: 'select/option/radius',
    children: [
      // A disabled option's label says so in its layer name, so the lint treats it as disabled text (WCAG exempts it).
      { k: 'text', name: `Option ${i + 1} label${isDisabled ? ' (disabled)' : ''}`, chars: label, fontSize: 'select/option/font-size', lineHeight: 'select/option/line-height', ...(isSelected ? { fontWeight: 'select/option/selected-weight' } : {}), fill: isDisabled ? 'select/option/text-disabled' : 'select/option/text' },
      ...(isSelected ? [{ k: 'icon', name: 'Check', icon: 'check', size: 'select/option/icon-size', color: 'select/option/text' }] : []),
    ],
  }
}

export const selectList = {
  id: 'select-list',
  name: 'Select list',
  page: 'Select list',
  storybook: 'Components / Select (Open)',
  code: 'src/components/Select/Select.tsx',
  guidance: 'src/components/Select/Select.guidance.md',
  tokens: 'tokens/components/select.json',
  tokenPrefix: 'select.',
  status: 'Ready',
  axes: { List: Object.keys(LISTS) },
  grid: { columns: 'List', rowGroups: null, rows: null },
  gridNote: 'The list that opens under a Select trigger (Select page), select/popover/offset below it and at least as wide (320px shown). Options are layers: edit their text in an instance, or hide the ones you don\'t need. The option under the pointer or keyboard gets select/option/background-focused (Storybook).',
  properties: [],
  variants: Object.entries(LISTS).map(([List, l]) => ({
    props: { List },
    tree: {
      k: 'frame', dir: 'V', width: 320, align: 'start', cross: 'start', padX: 'select/popover/padding', padY: 'select/popover/padding',
      radius: 'select/popover/radius', fill: 'select/popover/background', stroke: 'select/popover/border', strokeWidth: 'select/popover/border-width', effect: 'shadow/raised',
      children: l.options.map((label, i) => option(label, i, l)),
    },
  })),
  anatomy: [
    { part: 'List', tokens: 'select/popover/* : 1px border, select/popover/radius (8px), shadow/raised, 4px padding; scrolls past select/popover/max-height (320px)', at: 'right' },
    { part: 'Option', tokens: 'select/option/min-height (40px), padding-x, radius (4px); 14/21 text in select/option/text', layer: 'Option 1', at: 'left' },
    { part: 'Selected', tokens: 'semibold (select/option/selected-weight) with a 16px check; announced as selected', layer: 'Option 2', at: 'left' },
  ],
  anatomyVariant: { List: 'With selection' },
  parity: {
    story: ['components-select--open', 'components-select--disabled-option'],
    cells: "[class*='_popover_']",
    order: Object.keys(LISTS).map((List) => ({ List })),
    parts: [
      { name: 'List', css: ':scope', layer: null, fields: ['bg', 'border', 'radius', 'w', 'h'] },
      { name: 'Listbox', css: '[role=listbox]', layer: null, fields: ['padT', 'padL'] },
      { name: 'Option', css: '[role=option]', layer: 'Option 1', fields: ['h', 'padL', 'radius', 'startInset', 'topInset'] },
      { name: 'Option label', css: '[role=option]', layer: 'Option 1 label', fields: ['font', 'color'] },
      { name: 'Selected label', css: "[role=option][aria-selected='true']", layer: 'Option 2 label', fields: ['font'], only: { List: 'With selection' } },
      { name: 'Check', css: "[role=option][aria-selected='true'] svg", layer: 'Check', fields: ['icon', 'endInset'], only: { List: 'With selection' } },
      { name: 'Disabled label', css: "[role=option][aria-disabled='true']", layer: 'Option 4 label (disabled)', fields: ['color'], only: { List: 'With disabled option' } },
    ],
  },
  specsBy: null,
  specs: () => ['select/popover/radius', 'select/popover/padding', 'select/popover/offset', 'select/popover/max-height', 'select/option/min-height', 'select/option/padding-x', 'select/option/radius', 'select/option/icon-size'],
}
