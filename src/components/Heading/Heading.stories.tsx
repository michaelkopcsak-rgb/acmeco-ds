import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Stack } from '../Layout/Layout'
import { Heading } from './Heading'
import guidance from './Heading.guidance.md?raw'

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { level: 2, children: 'Office space for lease in Denver' },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Levels: Story = {
  name: 'Levels and their default sizes',
  render: () => (
    <Stack gap="md">
      <Heading level={1}>Heading 1: the page title (32/40)</Heading>
      <Heading level={2}>Heading 2: a section (24/32)</Heading>
      <Heading level={3}>Heading 3: a part of a section (20/30, semibold)</Heading>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const h1 = canvas.getByRole('heading', { level: 1 })
    const cs = getComputedStyle(h1)
    // The system's heading-1, with no browser margins and a line height taller than the text.
    await expect([cs.fontSize, cs.lineHeight, cs.fontWeight, cs.marginTop, cs.marginBottom]).toEqual(['32px', '40px', '400', '0px', '0px'])
    await expect(getComputedStyle(canvas.getByRole('heading', { level: 3 })).fontWeight).toBe('600')
  },
}

export const LevelAndSize: Story = {
  name: 'Level and size apart',
  render: () => (
    <Stack gap="md">
      <Heading level={2} size="heading-3">An h2 that looks like heading-3</Heading>
      <Heading level={1} size="display">Display: a hero h1 (48/56, 32/40 on phones)</Heading>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const h2 = canvas.getByRole('heading', { level: 2 })
    await expect(getComputedStyle(h2).fontSize).toBe('20px')
  },
}
