// Tabs' Figma spec. Mirrors src/components/Tabs/Tabs.module.css (tree format: see
// button.mjs). Two tabs over the list's 1px line, with the panel below; the selected tab
// is ink with AcmeCo's 2px dark blue underline sitting on the line, the other grey.

const SELECTED = ['First', 'Second']
const LABELS = ['Language and Region', 'Currency']
function tab(label, selected) {
  return {
    k: 'frame', name: selected ? 'Selected tab' : 'Tab', dir: 'H', padY: 'tabs/padding-y',
    // Every tab keeps a 2px bottom edge (transparent unless selected), as the CSS does.
    stroke: selected ? 'tabs/indicator/color' : 'transparent', strokeWidth: 'tabs/indicator/width',
    strokeSides: { top: 0, right: 0, bottom: 'tabs/indicator/width', left: 0 },
    children: [{ k: 'text', name: selected ? 'Selected label' : 'Label', chars: label, fontSize: 'tabs/font-size', lineHeight: 'tabs/line-height', fontWeight: 'tabs/font-weight', fill: selected ? 'tabs/text/selected' : 'tabs/text/default' }],
  }
}

export const tabs = {
  id: 'tabs',
  name: 'Tabs',
  page: 'Tabs',
  storybook: 'Components / Tabs',
  code: 'src/components/Tabs/Tabs.tsx',
  guidance: 'src/components/Tabs/Tabs.guidance.md',
  tokens: 'tokens/components/tabs.json',
  tokenPrefix: 'tabs.',
  status: 'Ready',
  axes: { Selected: SELECTED },
  grid: { columns: 'Selected', rowGroups: null, rows: null },
  gridNote: 'Two tabs over the tab list\'s 1px line (tabs/line), with the panel below; add tabs by duplicating one. The selected tab is ink with the 2px dark blue underline (tabs/indicator), the others the secondary grey. Hover turns a tab ink; focus shows the system ring (Storybook).',
  // Show panel: off when a screen puts its own content under the tabs (the Locale dialog's cards).
  properties: [{ name: 'Show panel', type: 'BOOLEAN', default: true, layer: 'Panel' }],
  variants: SELECTED.map((Selected, s) => ({
    props: { Selected },
    tree: {
      k: 'frame', dir: 'V', width: 532, align: 'start', cross: 'start',
      children: [
        {
          k: 'frame', name: 'Tab list', dir: 'H', align: 'start', cross: 'end', gap: 'tabs/gap', stretch: true,
          children: [
            ...LABELS.map((l, i) => tab(l, i === s)),
            // The line under the tabs, behind them: the selected tab's underline covers it, as
            // the CSS overlaps them by the line's width (a frame's own outline would draw on top).
            { k: 'frame', name: 'Tab list line', dir: 'H', width: 532, height: 'tabs/line/width', stroke: 'tabs/line/color', strokeWidth: 'tabs/line/width', strokeSides: { top: 0, right: 0, bottom: 'tabs/line/width', left: 0 }, strokesInLayout: false, abs: { left: 0, right: 0, bottom: 0 }, behind: true },
          ],
        },
        {
          k: 'frame', name: 'Panel', dir: 'V', align: 'start', cross: 'start', padTop: 'tabs/panel-gap', stretch: true,
          children: [{ k: 'text', name: 'Panel content', chars: 'Panel content: put the tab\'s content here.', fontSize: 'Semantic/typography/body/font-size', lineHeight: 'Semantic/typography/body/line-height', fill: 'Semantic/color/text/subtle', stretch: true }],
        },
      ],
    },
  })),
  anatomy: [
    { part: 'Tab', tokens: 'tabs/font-size (18px), tabs/padding-y (8px), the secondary grey (tabs/text/default); tabs/gap (24px) apart', layer: 'Tab', at: 'top' },
    { part: 'Selected tab', tokens: 'ink (tabs/text/selected) with a 2px dark blue underline (tabs/indicator/*) on the line', layer: 'Selected tab', at: 'left' },
    { part: 'Line', tokens: 'tabs/line/color, 1px, under the whole list', layer: 'Tab list line', at: 'right' },
    { part: 'Panel', tokens: 'tabs/panel-gap (16px) below the line', layer: 'Panel', at: 'left' },
  ],
  anatomyVariant: { Selected: 'First' },
  parity: {
    story: ['components-tabs--second-selected'],
    cells: "#storybook-root [class*='_tabs_']",
    order: [{ Selected: 'Second' }],
    parts: [
      { name: 'Tabs', css: ':scope', layer: null, fields: ['w'] },
      { name: 'Tab list', css: '[role=tablist]', layer: 'Tab list', fields: ['gap', 'h'] },
      { name: 'Line', css: '[role=tablist]', layer: 'Tab list line', fields: ['borderBottom'] },
      { name: 'Tab', css: "[role=tab][aria-selected='false']", layer: 'Tab', fields: ['padT', 'h'] },
      { name: 'Tab label', css: "[role=tab][aria-selected='false']", layer: 'Label', fields: ['font', 'color'] },
      { name: 'Selected tab', css: "[role=tab][aria-selected='true']", layer: 'Selected tab', fields: ['borderBottom', 'startInset'] },
      { name: 'Selected label', css: "[role=tab][aria-selected='true']", layer: 'Selected label', fields: ['font', 'color'] },
      { name: 'Panel', css: '[role=tabpanel]', layer: 'Panel', fields: ['padT', 'topInset'] },
    ],
  },
  specsBy: null,
  specs: () => ['tabs/gap', 'tabs/font-size', 'tabs/padding-y', 'tabs/panel-gap', 'tabs/indicator/width', 'tabs/line/width'],
}
