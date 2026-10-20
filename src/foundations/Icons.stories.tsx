import type { Meta, StoryObj } from '@storybook/react-vite'
import { icons } from '../icons'
import { Page, Section } from './Doc'

// Reads the registry, so a new icon appears here automatically.
function IconsPage() {
  return (
    <Page
      title="Icons"
      intro={
        <>
          <p>
            Lucide icons (decision 6), replacing the existing product's custom icon fonts. Only the icons the system uses are listed: this registry
            (<code>src/icons/index.ts</code>) is the single list components import from, and the
            source of the Figma Icons page in phase 5.
          </p>
          <p>
            Icons are always hidden from screen readers. The component around them supplies the
            accessible name (a button's label, or IconButton's required <code>label</code>).
          </p>
        </>
      }
    >
      <Section title={`${Object.keys(icons).length} icons`}>
        <ul className="fd-icon-grid">
          {Object.entries(icons).map(([name, Icon]) => (
            <li key={name} className="fd-icon-cell">
              <Icon aria-hidden="true" className="fd-icon" />
              <code className="fd-var">{name}</code>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  )
}

const meta = {
  title: 'Foundations/Icons',
  component: IconsPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof IconsPage>
export default meta
export const Icons: StoryObj<typeof meta> = {}
