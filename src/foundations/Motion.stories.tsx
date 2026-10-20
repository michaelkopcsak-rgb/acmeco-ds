import type { Meta, StoryObj } from '@storybook/react-vite'
import { Page, Section, TokenTable } from './Doc'
import { tokensUnder } from './tokens-data'

function MotionPage() {
  return (
    <Page
      title="Motion"
      intro={
        <p>
          AcmeCo names one transition: <code>--legacy-cta-transition</code>, background, colour and
          border colour over 0.15s, ease-in-out. It's kept as the default. Transitions only run when
          the viewer hasn't asked their system to reduce motion.
        </p>
      }
    >
      <Section title="Try it" intro="Hover or focus the button: the background changes over duration.fast with easing.default.">
        <button type="button" className="fd-motion-demo">Contact broker</button>
      </Section>
      <Section title="Duration and easing">
        <TokenTable tokens={[...tokensUnder('duration', 'primitives'), ...tokensUnder('easing', 'primitives')]} />
      </Section>
    </Page>
  )
}

const meta = {
  title: 'Foundations/Motion',
  component: MotionPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MotionPage>
export default meta
export const Motion: StoryObj<typeof meta> = {}
