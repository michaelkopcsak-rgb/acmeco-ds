// Badge's Figma spec. Mirrors src/components/Badge/Badge.module.css rule for rule (tree
// format: see button.mjs). Pills float over content; the feature label is square because
// it's attached to a photo's edge (decision 25).

const TONES = ['neutral', 'subtle', 'auction', 'feature']
const TEXT = { neutral: 'Office', subtle: 'Coworking', auction: 'Auction', feature: 'Virtual Tour' }

export const badge = {
  id: 'badge',
  name: 'Badge',
  page: 'Badge',
  storybook: 'Components / Badge',
  code: 'src/components/Badge/Badge.tsx',
  guidance: 'src/components/Badge/Badge.guidance.md',
  tokens: 'tokens/components/badge.json',
  tokenPrefix: 'badge.',
  status: 'Ready',
  axes: { Tone: TONES },
  grid: { columns: 'Tone', rowGroups: null, rows: null, backdrops: [{ when: { Tone: 'neutral' }, fill: 'Semantic/color/surface/brand-dark', label: 'photo stand-in' }] },
  gridNote: 'Not interactive; edit the text in an instance. Neutral is for photos only (its white would disappear on a white page), so it sits on a dark stand-in for a photo. The feature label is attached to a photo\'s bottom edge.',
  // No text property: each tone shows its own words, and a Figma text property sets the same
  // text in every variant. Edit the label in an instance directly.
  properties: [],
  variants: TONES.map((Tone) => {
    const feature = Tone === 'feature'
    return {
      props: { Tone },
      tree: {
        k: 'frame', dir: 'H',
        padX: feature ? 'badge/feature/padding-x' : 'badge/padding-x', padY: feature ? 'badge/feature/padding-y' : 'badge/padding-y',
        radius: feature ? 'badge/feature/radius' : 'badge/radius', fill: `badge/${Tone}/background`,
        children: [{
          k: 'text', name: 'Label', chars: TEXT[Tone],
          fontSize: feature ? 'badge/feature/font-size' : 'badge/font-size', lineHeight: feature ? 'badge/feature/line-height' : 'badge/line-height', fontWeight: 'badge/font-weight',
          fill: `badge/${Tone}/text`,
          // The feature label is set in capitals with 0.04em tracking (badge.feature.letter-spacing).
          textCase: feature ? 'UPPER' : undefined, letterSpacingEm: feature ? 0.04 : undefined,
        }],
      },
    }
  }),
  anatomy: [
    { part: 'Container', tokens: 'badge/padding-y, badge/padding-x, badge/radius (pill); feature: badge/feature/padding-*, square', at: 'left' },
    { part: 'Label', tokens: 'badge/font-size, badge/line-height; feature: badge/feature/font-size, capitals, 0.04em tracking', layer: 'Label', at: 'top' },
  ],
  anatomyVariant: { Tone: 'auction' },
  // Parity with the code: every badge in the "All tones" story (on a photo, then on white).
  parity: {
    story: 'components-badge--all-tones',
    cells: "#storybook-root [class*='_badge_']",
    order: ['neutral', 'subtle', 'auction', 'feature', 'subtle', 'auction', 'feature'].map((Tone) => ({ Tone })),
    parts: [
      { name: 'Badge', css: ':scope', layer: null, fields: ['bg', 'radius', 'h', 'padL', 'padR', 'padT', 'padB'] },
      { name: 'Label', css: ':scope', layer: 'Label', fields: ['font', 'color', 'case', 'tracking'] },
    ],
  },
  specsBy: null,
  specs: () => ['badge/padding-y', 'badge/padding-x', 'badge/radius', 'badge/font-size', 'badge/line-height', 'badge/feature/padding-x', 'badge/feature/font-size', 'badge/feature/line-height', 'badge/feature/radius'],
}
