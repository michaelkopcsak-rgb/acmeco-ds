// Breadcrumbs' Figma spec. Mirrors src/components/Breadcrumbs/Breadcrumbs.module.css (tree
// format: see button.mjs). The trail wraps: set the instance narrower and the current page
// drops to its own line, as on AcmeCo's phone. Edit the Crumb and Current layers per page.

const APPEARANCES = ['Strip', 'Plain']
const LENGTHS = ['Four', 'Two']
const TRAILS = { Four: ['Office Spaces', 'Colorado', 'Denver', '1840 Larkspur Ave, Denver, CO 80202'], Two: ['1840 Larkspur Ave', 'Jordan Ellis'] }
const type = { fontSize: 'breadcrumbs/font-size', lineHeight: 'breadcrumbs/line-height' }

export const breadcrumbs = {
  id: 'breadcrumbs',
  name: 'Breadcrumbs',
  page: 'Breadcrumbs',
  storybook: 'Components / Breadcrumbs',
  code: 'src/components/Breadcrumbs/Breadcrumbs.tsx',
  guidance: 'src/components/Breadcrumbs/Breadcrumbs.guidance.md',
  tokens: 'tokens/components/breadcrumbs.json',
  tokenPrefix: 'breadcrumbs.',
  status: 'Ready (decision 47)',
  axes: { Appearance: APPEARANCES, Length: LENGTHS },
  grid: { columns: 'Length', rowGroups: null, rows: 'Appearance' },
  gridNote: 'Shown 560px wide; narrower, the trail wraps and the current page drops to its own line. Strip: a listing and the end of the results. Plain: a step back (a broker\'s page). Edit the Crumb and Current layers per page; the current page is never a link.',
  properties: [],
  variants: APPEARANCES.flatMap((Appearance) => LENGTHS.map((Length) => {
    const strip = Appearance === 'Strip', words = TRAILS[Length], last = words.length - 1
    return {
      props: { Appearance, Length },
      tree: {
        k: 'frame', dir: 'H', align: 'start', width: 560, wrap: true, gap: 'breadcrumbs/gap', wrapGap: 'breadcrumbs/row-gap',
        ...(strip ? {
          padX: 'breadcrumbs/strip/padding-inline', padY: 'breadcrumbs/strip/padding-block', fill: 'breadcrumbs/strip/background',
          stroke: 'breadcrumbs/strip/border', strokeWidth: 'breadcrumbs/strip/border-width', strokeSides: { top: 'breadcrumbs/strip/border-width', bottom: 'breadcrumbs/strip/border-width' },
        } : {}),
        children: words.map((w, i) => (i === last
          ? { k: 'text', name: 'Current', chars: w, ...type, fill: 'breadcrumbs/current' }
          : { k: 'frame', name: `Item ${i + 1}`, dir: 'H', gap: 'breadcrumbs/gap', children: [
            { k: 'text', name: `Crumb ${i + 1}`, chars: w, ...type, fill: 'link/standalone/text/default' },
            { k: 'text', name: 'Separator', chars: '/', ...type, fill: 'breadcrumbs/separator' },
          ] })),
      },
    }
  })),
  anatomy: [
    { part: 'Strip', tokens: 'breadcrumbs/strip/background, 1px breadcrumbs/strip/border above and below, breadcrumbs/strip/padding-block, breadcrumbs/strip/padding-inline (Strip only)', at: 'left' },
    { part: 'Link', tokens: 'AcmeCo blue (link/standalone/text/default), breadcrumbs/font-size, breadcrumbs/line-height', layer: 'Crumb 1', at: 'top' },
    { part: 'Separator', tokens: 'an ink slash (breadcrumbs/separator), breadcrumbs/gap either side; skipped by screen readers', layer: 'Separator', at: 'bottom' },
    { part: 'Current page', tokens: 'breadcrumbs/current; text, not a link (aria-current="page")', layer: 'Current', at: 'top' },
  ],
  anatomyVariant: { Appearance: 'Strip', Length: 'Four' },
  parity: {
    story: 'components-breadcrumbs--states-matrix',
    order: [['Strip', 'Four'], ['Plain', 'Four'], ['Strip', 'Two'], ['Plain', 'Two']].map(([Appearance, Length]) => ({ Appearance, Length })),
    parts: [
      { name: 'Trail', css: 'nav', layer: null, fields: ['bg', 'borderTop', 'borderBottom', 'padT', 'padL'] },
      { name: 'First link', css: 'li:first-child a', layer: 'Crumb 1', fields: ['font', 'color', 'startInset'] },
      { name: 'Current', css: "[aria-current='page']", layer: 'Current', fields: ['font', 'color'] },
    ],
  },
  specsBy: null,
  specs: () => ['breadcrumbs/font-size', 'breadcrumbs/line-height', 'breadcrumbs/gap', 'breadcrumbs/strip/padding-block', 'breadcrumbs/strip/padding-inline', 'breadcrumbs/strip/border-width'],
}
