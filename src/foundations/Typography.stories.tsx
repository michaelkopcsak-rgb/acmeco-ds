import type { Meta, StoryObj } from '@storybook/react-vite'
import { Labels, Page, Section, TokenTable } from './Doc'
import { allTokens, tokensUnder } from './tokens-data'

const STYLES: { name: string; sample: string }[] = [
  { name: 'display', sample: 'Find your next space' },
  { name: 'display-mobile', sample: 'Find your next space' },
  { name: 'heading-1', sample: 'Office space for lease in Chicago, IL' },
  { name: 'heading-2', sample: 'Property facts' },
  { name: 'heading-3', sample: '233 S Wacker Dr' },
  { name: 'body-large', sample: 'A landmark Class A tower with floor-to-ceiling windows and views of the Loop.' },
  { name: 'body', sample: 'Suites from 2,400 to 12,400 SF, move-in ready, with on-site parking and a fitness centre.' },
  { name: 'body-small', sample: 'Listing updated 3 days ago · Listing ID 31872561' },
  { name: 'label', sample: 'Space use' },
  { name: 'caption', sample: 'Photo 1 of 24' },
  { name: 'price', sample: '$42.50 /SF/YR' },
  { name: 'price-compact', sample: '$42.50 /SF/YR' },
]

function TypographyPage() {
  return (
    <Page
      title="Typography"
      intro={
        <>
          <p>
            <strong>12 styles, down from 76</strong> distinct text styles observed on AcmeCo's core
            journey (the benchmark: 37). Two weights: 400 and 600 (decision 4).
          </p>
          <p>
            Outfit is AcmeCo's brand typeface, at weights 400 and 600.
            Swapping the brand font is one token change.
            Text up to 20px keeps AcmeCo's 1.5× line height (decision 9).
          </p>
        </>
      }
    >
      <Section title="Styles">
        {STYLES.map(({ name, sample }) => {
          const v = (p: string) => `var(--typography-${name}-${p})`
          const size = allTokens[`typography.${name}.font-size`]
          const [px, line, weight] = ['font-size', 'line-height', 'font-weight'].map((p) =>
            String(tokensUnder(`typography.${name}.${p}`, 'semantic')[0].resolved),
          )
          return (
            <div key={name} className="fd-type-row">
              <div className="fd-type-meta">
                <strong>{name}</strong>
                {px} / {line} / {weight}
                <br />
                <code>{String(size)}</code>
              </div>
              <p className="fd-type-sample" style={{ fontSize: v('font-size'), lineHeight: v('line-height'), fontWeight: v('font-weight') }}>
                {sample}
              </p>
            </div>
          )
        })}
      </Section>
      <Section title="Typeface and weights">
        <TokenTable tokens={[...tokensUnder('font.family', 'primitives'), ...tokensUnder('font.weight', 'primitives')]} />
      </Section>
      <Section title="Size and line-height scales" intro="Each size lists the observed sizes it absorbs.">
        <TokenTable tokens={[...tokensUnder('font.size', 'primitives'), ...tokensUnder('font.line-height', 'primitives')]} />
      </Section>
      <p className="fd-note">
        Evidence key: <Labels labels={['OBSERVED', 'LEGACY-NAMED', 'PROPOSED', 'BENCHMARK-INFORMED', 'REFERENCE-OBSERVED']} />
      </p>
    </Page>
  )
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypographyPage>
export default meta
export const Typography: StoryObj<typeof meta> = {}
