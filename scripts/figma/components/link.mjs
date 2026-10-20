// Link's Figma spec. Mirrors src/components/Link/Link.module.css rule for rule (tree
// format: see button.mjs). A link takes its size from the text around it, so the
// Context axis shows it in the three body styles (Semantic typography variables).

const VARIANTS = ['inline', 'standalone', 'subtle', 'inverse']
const CONTEXTS = ['body-small', 'body', 'body-large']
const STATES = ['Default', 'Hover', 'Focus']

function look(variant, state) {
  const hover = state === 'Hover'
  const colour = {
    inline: `link/inline/text/${hover ? 'hover' : 'default'}`,
    standalone: `link/standalone/text/${hover ? 'hover' : 'default'}`,
    subtle: 'link/subtle/text/default',
    inverse: 'link/inverse/text/default',
  }[variant]
  // inline and inverse are always underlined (thicker on hover); the others only on hover.
  const always = variant === 'inline' || variant === 'inverse'
  const underline = always || hover
    ? { thickness: always && hover ? 'link/underline/thickness-hover' : 'link/underline/thickness', offset: 'link/underline/offset' }
    : null
  return { colour, underline }
}

export const link = {
  id: 'link',
  name: 'Link',
  page: 'Link',
  storybook: 'Components / Link',
  code: 'src/components/Link/Link.tsx',
  guidance: 'src/components/Link/Link.guidance.md',
  tokens: 'tokens/components/link.json',
  tokenPrefix: 'link.',
  status: 'Ready',
  axes: { Variant: VARIANTS, Context: CONTEXTS, State: STATES },
  grid: { columns: 'Context', rowGroups: 'Variant', rows: 'State', backdrops: [{ when: { Variant: 'inverse' }, fill: 'Semantic/color/surface/brand-dark', label: 'dark panel' }] },
  gridNote: 'Context = the body text style around the link (a link inherits its size and weight). Inverse links sit on a dark panel, as in their story.',
  properties: [{ name: 'Label', type: 'TEXT', default: 'View listing', layer: 'Label' }],
  variants: VARIANTS.flatMap((Variant) => CONTEXTS.flatMap((Context) => STATES.map((State) => {
    const l = look(Variant, State)
    return {
      props: { Variant, Context, State },
      tree: {
        k: 'frame', dir: 'H', radius: 'link/focus-ring/radius',
        focus: State === 'Focus' ? { ring: Variant === 'inverse' ? 'link/focus-ring/inverse-color' : 'link/focus-ring/color', width: 'link/focus-ring/width', offset: 'link/focus-ring/offset' } : null,
        children: [
          { k: 'text', name: 'Label', chars: 'View listing', fontSize: `Semantic/typography/${Context}/font-size`, lineHeight: `Semantic/typography/${Context}/line-height`, fill: l.colour, underline: l.underline },
        ],
      },
    }
  }))),
  anatomy: [
    { part: 'Text', tokens: 'colour by variant (link/{variant}/text/*); size and weight from the text around it; underline link/underline/thickness (2px on hover), link/underline/offset', layer: 'Label', at: 'top' },
    { part: 'Focus ring', tokens: 'link/focus-ring/color (inverse: link/focus-ring/inverse-color), 2px, 2px away, link/focus-ring/radius corners', at: 'right' },
  ],
  anatomyVariant: { Variant: 'inline', Context: 'body-large', State: 'Focus' },
  // Parity with the code: the States matrix (rows = variant × state, columns = contexts).
  parity: {
    story: 'components-link--states-matrix',
    order: VARIANTS.flatMap((Variant) => STATES.flatMap((State) => CONTEXTS.map((Context) => ({ Variant, Context, State })))),
    parts: [
      { name: 'Link', css: 'a', layer: null, fields: ['radius', 'ring'] },
      { name: 'Text', css: 'a', layer: 'Label', fields: ['font', 'color', 'underline'] },
    ],
  },
  specsBy: null,
  specs: () => ['link/underline/thickness', 'link/underline/thickness-hover', 'link/underline/offset', 'link/focus-ring/width', 'link/focus-ring/offset', 'link/focus-ring/radius'],
}
