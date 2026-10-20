import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Badge, type BadgeTone } from './Badge'
import guidance from './Badge.guidance.md?raw'

// A photo-like backdrop (stories only), dark enough to test contrast.
function Photo({ children, height = 160 }: { children: ReactNode; height?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '320px',
        height: `${height}px`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-gray-900), var(--color-navy-700) 55%, var(--color-gray-600))',
      }}
    >
      {children}
    </div>
  )
}

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: { children: 'Office', tone: 'neutral' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'subtle', 'auction', 'feature'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const OnAPhoto: Story = {
  name: 'Neutral, on a photo',
  render: (args) => (
    <Photo>
      <span style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
        <Badge {...args} />
      </span>
    </Photo>
  ),
  play: async ({ canvas }) => {
    // A label, not a control: no button role, not reachable with Tab.
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.getByText('Office')).toBeVisible()
  },
}

export const Feature: Story = {
  name: 'Feature, attached to a photo corner',
  args: { tone: 'feature', children: 'Virtual Tour' },
  render: (args) => (
    <Photo>
      <span style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <Badge {...args} />
      </span>
    </Photo>
  ),
}

export const Subtle: Story = {
  args: { tone: 'subtle', children: 'Coworking' },
}

export const Auction: Story = {
  args: { tone: 'auction', children: 'Auction' },
}

const TONES: { tone: BadgeTone; text: string }[] = [
  { tone: 'neutral', text: 'Office' },
  { tone: 'subtle', text: 'Coworking' },
  { tone: 'auction', text: 'Auction' },
  { tone: 'feature', text: 'Virtual Tour' },
]

export const AllTones: Story = {
  name: 'All tones',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <Photo height={96}>
        <span style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
          {TONES.slice(0, 3).map((t) => <Badge key={t.tone} tone={t.tone}>{t.text}</Badge>)}
        </span>
        <span style={{ position: 'absolute', bottom: 0, left: 0 }}><Badge tone="feature">Virtual Tour</Badge></span>
      </Photo>
      {/* On white: neutral is for photos only (its white background would disappear here). */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        {TONES.filter((t) => t.tone !== 'neutral').map((t) => <Badge key={t.tone} tone={t.tone}>{t.text}</Badge>)}
      </div>
    </div>
  ),
}
