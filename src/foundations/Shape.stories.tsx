import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Page, Section, TokenTable } from './Doc'
import { Badge } from '../components/Badge/Badge'
import { Button } from '../components/Button/Button'
import { IconButton } from '../components/IconButton/IconButton'
import { Heart } from '../icons'
import { tokensUnder } from './tokens-data'

// The shape rule (decision 26): a radius is chosen by what a thing does.
const SHAPE_RULE: { shape: string; token: string; role: string; components: string; example: ReactNode }[] = [
  {
    shape: 'Pill / circle',
    token: 'radius.pill',
    role: 'Floats over content, or filters it',
    components: 'Photo badges · compact Select (filter bar) · hero search · plain and overlay IconButtons',
    example: (
      <span style={{ display: 'inline-flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        <Badge tone="subtle">Office</Badge>
        <IconButton label="Save listing" icon={<Heart />} size="sm" />
      </span>
    ),
  },
  {
    shape: '4px',
    token: 'radius.sm',
    role: 'Something you act on or type into',
    components: 'Buttons · text, search and select fields · checkboxes · tab tops · chips (they sit inside fields)',
    example: <Button size="sm">Contact broker</Button>,
  },
  {
    shape: '8px',
    token: 'radius.md',
    role: 'A surface that holds things',
    components: 'Cards · popovers (the Select list) · panels · dialogs (decision 28)',
    example: <span className="fd-shape-surface" />,
  },
  {
    shape: 'Square',
    token: 'radius.none',
    role: 'A label attached to an edge',
    components: 'The "Virtual Tour" label in a photo corner',
    example: <Badge tone="feature">Virtual Tour</Badge>,
  },
]

// Spacing, radius, elevation and borders: the scales that shape every component.
// Components reach these through their own component tokens, never directly.

function SpacingPage() {
  return (
    <Page
      title="Spacing"
      intro={
        <p>
          A 4px grid (decision 5). AcmeCo uses a 5px rhythm (5 / 10 / 15 / 20) beside an 8px one;
          only 25–34% of spacing on interior pages sits on a 4px grid, against 90–96% on the benchmark.
        </p>
      }
    >
      <Section title="Space scale">
        <TokenTable tokens={tokensUnder('space', 'primitives')} preview={(t) => <div className="fd-space-bar" style={{ width: `var(${t.cssVar})` }} />} />
      </Section>
      <Section title="Layout">
        <TokenTable tokens={tokensUnder('layout', 'primitives')} />
      </Section>
      <Section title="Breakpoints" intro="Reference values: CSS variables can't be used inside @media, so media queries use these numbers.">
        <TokenTable tokens={tokensUnder('breakpoint', 'primitives')} />
      </Section>
    </Page>
  )
}

function RadiusPage() {
  return (
    <Page
      title="Radius and borders"
      intro={
        <p>
          One radius scale everywhere (decision 5), and one rule for which radius to use: <strong>shape follows role</strong> (decision 26).
          AcmeCo uses 22 radii today (8px on the homepage, 3px on results, 2px on property detail), but its pill filter bar and photo
          badges are already recognisable, so the rule keeps them rather than forcing one shape on everything.
        </p>
      }
    >
      <Section title="When to use which radius" intro="Every component's radius token follows this table. A new component picks its radius by asking what it does.">
        <table className="fd-table">
          <thead>
            <tr>
              <th scope="col">Shape</th>
              <th scope="col">Role</th>
              <th scope="col">Used by</th>
              <th scope="col">Example</th>
            </tr>
          </thead>
          <tbody>
            {SHAPE_RULE.map((r) => (
              <tr key={r.shape}>
                <td><strong>{r.shape}</strong><code className="fd-var">{r.token}</code></td>
                <td>{r.role}</td>
                <td className="fd-note">{r.components}</td>
                <td>{r.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Section title="Radius">
        <TokenTable tokens={tokensUnder('radius', 'primitives')} preview={(t) => <div className="fd-radius-box" style={{ borderRadius: `var(${t.cssVar})` }} />} />
      </Section>
      <Section title="Border width and focus ring">
        <TokenTable tokens={[...tokensUnder('border', 'primitives'), ...tokensUnder('focus', 'primitives')]} />
      </Section>
    </Page>
  )
}

function ElevationPage() {
  return (
    <Page
      title="Elevation"
      intro={<p>Three levels. AcmeCo uses 24 distinct shadows (11 on the core journey), none dominant; the benchmark uses 3. The card shadow is kept exactly as observed (decision 11).</p>}
    >
      <Section title="Shadows">
        <TokenTable tokens={tokensUnder('shadow', 'primitives')} preview={(t) => <div className="fd-shadow-box" style={{ boxShadow: `var(${t.cssVar})` }} />} />
      </Section>
    </Page>
  )
}

const meta = {
  title: 'Foundations/Shape',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Spacing: Story = { render: () => <SpacingPage /> }
export const RadiusAndBorders: Story = { name: 'Radius and borders', render: () => <RadiusPage /> }
export const Elevation: Story = { render: () => <ElevationPage /> }
