import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { listings } from '../../data/fixtures'
import { List } from './List'
import guidance from './List.guidance.md?raw'

const listing = listings[0]

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { items: listing.highlights, columns: { base: 1, md: 2 } },
  decorators: [(Story) => <div style={{ padding: 'var(--space-2)', maxWidth: '960px' }}><Story /></div>],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Highlights (two columns from 768px)',
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list')).toBeInTheDocument()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(listing.highlights.length)
  },
}

export const Features: Story = {
  name: 'Features and Amenities (two, then four columns)',
  args: { items: listing.features, columns: { base: 2, md: 4 } },
}

export const Phone: Story = {
  name: 'Highlights on a phone (one column)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvas }) => {
    const [a, b] = canvas.getAllByRole('listitem')
    await expect(b.getBoundingClientRect().left).toBe(a.getBoundingClientRect().left)
  },
}

// Each column count at a fixed width, for review and the Figma parity check.
const CELLS = [
  { name: 'One column', props: { items: listing.highlights.slice(0, 2), columns: 1 } },
  { name: 'Two columns', props: { items: listing.highlights.slice(0, 4), columns: 2 } },
]
export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <tbody>
        {CELLS.map((c) => (
          <tr key={c.name}>
            <th scope="row" style={{ textAlign: 'left', verticalAlign: 'top', fontWeight: 'var(--font-weight-regular)' }}>{c.name}</th>
            <td style={{ width: '640px', minWidth: '640px' }}><List {...c.props} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
