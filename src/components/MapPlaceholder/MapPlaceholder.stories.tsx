import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { listings } from '../../data/fixtures'
import { mapIllustration } from '../../data/illustrations'
import { MapPlaceholder } from './MapPlaceholder'
import guidance from './MapPlaceholder.guidance.md?raw'

const pins = listings.slice(0, 8).map((l) => ({ id: l.id, x: l.map.x, y: l.map.y }))

const meta = {
  title: 'AcmeCo/MapPlaceholder',
  component: MapPlaceholder,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { label: 'Map of 8 listings in Denver (placeholder)', pins, image: mapIllustration(1) },
  decorators: [(Story) => <div style={{ maxWidth: '640px' }}><Story /></div>],
} satisfies Meta<typeof MapPlaceholder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    // One named image; the badge says it's a placeholder.
    await expect(canvas.getByRole('img', { name: 'Map of 8 listings in Denver (placeholder)' })).toBeInTheDocument()
    await expect(canvas.getByText('Map placeholder')).toBeInTheDocument()
  },
}

export const NoDrawing: Story = {
  name: 'Without a drawing (the grey behind it)',
  args: { image: undefined },
}
