import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { listings } from '../../data/fixtures'
import { propertyFacts, spaceFacts } from '../../data/facts'
import { FactList } from './FactList'
import guidance from './FactList.guidance.md?raw'

const listing = listings.find((l) => l.spaces.length > 0) ?? listings[0]
const PROPERTY = propertyFacts(listing, '9/24/2026')
const SPACE = spaceFacts(listing.spaces[0])

const meta = {
  title: 'Components/FactList',
  component: FactList,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { items: SPACE },
  decorators: [(Story) => <div style={{ padding: 'var(--space-2)', maxWidth: '720px' }}><Story /></div>],
} satisfies Meta<typeof FactList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'One column (a space)',
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('term')).toHaveLength(SPACE.length)
    await expect(canvas.getAllByRole('definition')).toHaveLength(SPACE.length)
    await expect(canvas.getByText('Size').closest('div')).toHaveTextContent(/SF/)
  },
}

export const TwoColumns: Story = {
  name: 'Two columns (Property Facts)',
  args: { items: PROPERTY, columns: 2 },
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByRole('term')
    // Two facts on a row where there's room (the column is 704px here).
    await expect(second.getBoundingClientRect().top).toBe(first.getBoundingClientRect().top)
  },
}

export const Phone: Story = {
  name: 'Two columns on a phone (one fact a row)',
  args: { items: PROPERTY, columns: 2 },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByRole('term')
    await expect(second.getBoundingClientRect().top).toBeGreaterThan(first.getBoundingClientRect().top)
  },
}

// Each layout at a fixed width, for review and the Figma parity check.
const CELLS = [
  { name: 'One column', props: { items: SPACE } },
  { name: 'Two columns', props: { items: PROPERTY, columns: 2 as const } },
]
export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <tbody>
        {CELLS.map((c) => (
          <tr key={c.name}>
            <th scope="row" style={{ textAlign: 'left', verticalAlign: 'top', fontWeight: 'var(--font-weight-regular)' }}>{c.name}</th>
            <td style={{ width: '640px', minWidth: '640px' }}><FactList {...c.props} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
