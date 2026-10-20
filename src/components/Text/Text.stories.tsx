import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Stack } from '../Layout/Layout'
import { Text } from './Text'
import guidance from './Text.guidance.md?raw'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { children: 'Class A office space with flexible floor plans, close to Union Station.' },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <Stack gap="sm">
      <Text size="body-large">body-large (18/27): an introduction under a page title.</Text>
      <Text>body (16/24): most text on a page.</Text>
      <Text size="body-small">body-small (14/21): secondary detail.</Text>
      <Text size="caption">caption (12/18): fine print.</Text>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const ps = [...canvasElement.querySelectorAll('p')]
    await expect(ps.map((p) => getComputedStyle(p).fontSize)).toEqual(['18px', '16px', '14px', '12px'])
    // No browser margins: the Stack sets the space between paragraphs.
    await expect(ps.every((p) => getComputedStyle(p).marginTop === '0px' && getComputedStyle(p).marginBottom === '0px')).toBe(true)
  },
}

export const Tones: Story = {
  render: () => (
    <Stack gap="sm">
      <Text>default: ink, for what people read to act.</Text>
      <Text tone="subtle">subtle: the secondary grey, for supporting detail.</Text>
    </Stack>
  ),
}

export const Emphasis: Story = {
  name: 'Bold inside text',
  render: () => <Text>Available <strong>now</strong>, from 2,500 SF.</Text>,
  play: async ({ canvas }) => {
    // The loaded semibold, not a faux 700.
    await expect(getComputedStyle(canvas.getByText('now')).fontWeight).toBe('600')
  },
}
