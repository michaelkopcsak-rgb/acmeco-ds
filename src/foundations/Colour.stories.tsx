import type { Meta, StoryObj } from '@storybook/react-vite'
import { Page, Section, TokenTable } from './Doc'
import { tokensUnder, type TokenInfo } from './tokens-data'

const swatch = (t: TokenInfo) => {
  const translucent = /^#[0-9a-f]{8}$/i.test(String(t.resolved))
  return translucent ? (
    // Translucent colours are shown over a dark "photo" so their effect is visible.
    <div className="fd-swatch fd-swatch--photo"><span style={{ background: `var(${t.cssVar})` }} /></div>
  ) : (
    <div className="fd-swatch" style={{ background: `var(${t.cssVar})` }} />
  )
}

function ColourPage() {
  return (
    <Page
      title="Colour"
      intro={
        <>
          <p>
            Two tiers. <strong>Primitives</strong> are the raw palette: AcmeCo's observed and
            legacy-named values, each listing the drifting values it replaces. <strong>Semantic
            tokens</strong> give them a meaning; components only ever use these (or their own
            component tokens).
          </p>
          <p>
            Dark blue marks actions, checked and selected states (decision 1). Errors use a separate red
            and always come with an icon and a message (decision 7).
          </p>
        </>
      }
    >
      <Section title="Semantic: text" intro="One off-black, one secondary grey, one link blue.">
        <TokenTable tokens={tokensUnder('color.text', 'semantic')} preview={swatch} />
      </Section>
      <Section title="Semantic: surfaces">
        <TokenTable tokens={[...tokensUnder('color.surface', 'semantic'), ...tokensUnder('color.overlay', 'semantic')]} preview={swatch} />
      </Section>
      <Section title="Semantic: borders" intro="Control borders meet 3:1 (WCAG 1.4.11); decorative borders don't need to.">
        <TokenTable tokens={tokensUnder('color.border', 'semantic')} preview={swatch} />
      </Section>
      <Section title="Semantic: actions" intro="Every state moves away from the page background: hover and pressed get darker.">
        <TokenTable tokens={tokensUnder('color.action', 'semantic')} preview={swatch} />
      </Section>
      <Section title="Semantic: focus, feedback and promo">
        <TokenTable
          tokens={[...tokensUnder('color.focus', 'semantic'), ...tokensUnder('color.feedback', 'semantic'), ...tokensUnder('color.promo', 'semantic')]}
          preview={swatch}
        />
      </Section>
      <Section title="Primitives" intro="The raw palette. Not used by components directly.">
        <TokenTable tokens={tokensUnder('color', 'primitives')} preview={swatch} />
      </Section>
    </Page>
  )
}

const meta = {
  title: 'Foundations/Colour',
  component: ColourPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColourPage>
export default meta
export const Colour: StoryObj<typeof meta> = {}
