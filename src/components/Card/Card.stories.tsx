import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { brokers, listings } from '../../data/fixtures'
import { spaceFacts } from '../../data/facts'
import { Button } from '../Button/Button'
import { FactList } from '../FactList/FactList'
import { Text } from '../Text/Text'
import { Card } from './Card'
import guidance from './Card.guidance.md?raw'

const listing = listings.find((l) => l.spaces.length > 0) ?? listings[0]
const space = listing.spaces[0]
const broker = brokers.find((b) => b.bio) ?? brokers[0]

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { heading: space.name, children: <FactList items={spaceFacts(space)} /> },
  // Padding so the raised card's shadow isn't cropped (Chromatic crops tightly).
  decorators: [(Story) => <div style={{ padding: 'var(--space-6)', maxWidth: '480px' }}><Story /></div>],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Outline (a space, with its facts)',
  play: async ({ canvas }) => {
    // A card with a heading is a region named by it.
    await expect(canvas.getByRole('region', { name: space.name })).toBeInTheDocument()
  },
}

export const Raised: Story = {
  name: 'Raised (a broker panel)',
  args: { appearance: 'raised', heading: 'Bio', children: <Text>{broker.bio}</Text> },
}

export const WithActions: Story = {
  name: 'With actions',
  args: { actions: <Button variant="secondary">Details</Button> },
}

export const NoHeading: Story = {
  name: 'No heading (a plain box)',
  args: { heading: undefined, children: <Text>Very walkable · 80 / 100</Text> },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('region')).toBeNull()
  },
}

export const Phone: Story = {
  name: 'Raised on a phone (16px padding)',
  args: { appearance: 'raised', heading: 'Bio', children: <Text>{broker.bio}</Text> },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

// Each appearance, for review and the Figma parity check.
const CELLS = [
  { name: 'Outline', props: { appearance: 'outline' as const } },
  { name: 'Raised', props: { appearance: 'raised' as const } },
]
export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-6) var(--space-5)' }}>
      <tbody>
        {CELLS.map((c) => (
          <tr key={c.name}>
            <th scope="row" style={{ textAlign: 'left', verticalAlign: 'top', fontWeight: 'var(--font-weight-regular)' }}>{c.name}</th>
            <td style={{ width: '400px', minWidth: '400px' }}><Card heading={`${space.name} (${c.name})`} {...c.props}><FactList items={spaceFacts(space)} /></Card></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
