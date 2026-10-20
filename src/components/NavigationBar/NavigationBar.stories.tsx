import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { searchLinks } from '../../data/navigation'
import { NavigationBar } from './NavigationBar'
import guidance from './NavigationBar.guidance.md?raw'

const meta = {
  title: 'AcmeCo/NavigationBar',
  component: NavigationBar,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { links: searchLinks.map((l, i) => ({ ...l, isCurrent: i === 0 })), label: 'Search' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof NavigationBar>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  name: 'Horizontal (header)',
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Search' })
    await expect(within(nav).getByRole('list')).toBeInTheDocument()
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(4)
    const current = within(nav).getByRole('link', { name: 'For Lease' })
    await expect(current).toHaveAttribute('aria-current', 'page')
    // Marked by an underline, not by colour alone.
    await expect(getComputedStyle(current).textDecorationLine).toBe('underline')
  },
}

export const Vertical: Story = {
  name: 'Vertical (phone menu)',
  args: { orientation: 'vertical', label: 'Site' },
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem')
    for (const li of items) await expect(li.getBoundingClientRect().height).toBeGreaterThanOrEqual(40)
  },
}
