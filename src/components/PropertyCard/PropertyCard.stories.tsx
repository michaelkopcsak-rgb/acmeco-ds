import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, waitFor } from 'storybook/test'
import { brokerById, listings } from '../../data/fixtures'
import type { Listing } from '../../data/types'
import { PropertyCard } from './PropertyCard'
import guidance from './PropertyCard.guidance.md?raw'

const tier1 = listings.find((l) => l.tier === 1)!
const tier2Many = listings.find((l) => l.tier === 2 && l.brokerIds.length === 3)!
const tier2One = listings.find((l) => l.tier === 2 && l.brokerIds.length === 1)!
const tier3 = listings.find((l) => l.tier === 3 && l.spaces.length > 0) ?? listings.find((l) => l.tier === 3)!

// A stand-in router: clicking a real link would navigate away from the page
// running the test (it crashes the runner). React Aria's links use this instead.
const navigate = fn()

function Card({ listing, width = 670, tier }: { listing: Listing; width?: number; tier?: 1 | 2 | 3 }) {
  const [saved, setSaved] = useState(false)
  return (
    <div style={{ width: `${width}px`, maxWidth: '100%' }}>
      <PropertyCard listing={listing} brokers={listing.brokerIds.map(brokerById)} href={`#${listing.id}`} tier={tier} saved={saved} onSaveChange={setSaved} />
    </div>
  )
}

// Padding so the card's shadow and focus ring aren't cropped in Chromatic snapshots.
const Pad = ({ children }: { children: ReactNode }) => (
  <RouterProvider navigate={navigate}>
    <div style={{ padding: 'var(--space-3)' }}>{children}</div>
  </RouterProvider>
)

const meta = {
  title: 'AcmeCo/PropertyCard',
  component: PropertyCard,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: { listing: tier1, brokers: [], href: `#${tier1.id}` },
  render: (args) => <Pad><Card listing={args.listing} tier={args.tier} /></Pad>,
} satisfies Meta<typeof PropertyCard>

export default meta
type Story = StoryObj<typeof meta>

export const Tier1: Story = {
  name: 'Tier 1 (full-width photo)',
  play: async ({ canvas, canvasElement, userEvent }) => {
    navigate.mockClear()
    const card = canvas.getByRole('article', { name: tier1.title })
    // One link per card: the title.
    await expect(canvas.getAllByRole('link')).toHaveLength(1)
    // Keyboard: the title link comes first, and the whole card shows the focus ring.
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: tier1.title })).toHaveFocus()
    await expect(getComputedStyle(card).outlineStyle).toBe('solid')
    // Clicking anywhere on the card (here, the facts) follows the title link.
    const facts = canvas.getByText(`Built in ${tier1.builtYear}`).getBoundingClientRect()
    const hit = canvasElement.ownerDocument.elementFromPoint(facts.left + 4, facts.top + facts.height / 2) as HTMLElement
    await userEvent.click(hit)
    await waitFor(() => expect(navigate).toHaveBeenCalledWith(`#${tier1.id}`, undefined))
    // The save toggle sits above the link: it toggles and doesn't navigate.
    navigate.mockClear()
    const save = canvas.getByRole('button', { name: `Save ${tier1.title}` })
    await userEvent.click(save)
    await expect(save).toHaveAttribute('aria-pressed', 'true')
    await expect(navigate).not.toHaveBeenCalled()
    save.blur()
  },
}

export const Tier2: Story = {
  name: 'Tier 2 (photo beside the details, three brokers)',
  args: { listing: tier2Many, href: `#${tier2Many.id}` },
  play: async ({ canvas }) => {
    // With three brokers only the initials show, but every name is still read out.
    const list = canvas.getByRole('list', { name: 'Listing brokers' })
    await expect(list.querySelectorAll('.sr-only')).toHaveLength(3)
  },
}

export const Tier2OneBroker: Story = {
  name: 'Tier 2 (one broker, name shown)',
  args: { listing: tier2One, href: `#${tier2One.id}` },
}

export const Tier3: Story = {
  name: 'Tier 3 (compact)',
  args: { listing: tier3, href: `#${tier3.id}` },
  play: async ({ canvas }) => {
    // No description, no broker photos, no arrows: a thumbnail, facts and the company logo.
    await expect(canvas.queryByRole('list', { name: 'Listing brokers' })).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Next photo' })).toBeNull()
    await expect(canvas.getByText(tier3.company)).toBeVisible()
  },
}

export const ResultsList: Story = {
  name: 'Results list (tiers 1, 2, 3 in the map sidebar width)',
  render: () => (
    <Pad>
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <Card listing={tier1} />
        <Card listing={tier2Many} />
        <Card listing={tier3} />
      </div>
    </Pad>
  ),
}

export const Narrow: Story = {
  name: 'Narrow (phone width: tier 2 stacks)',
  render: () => (
    <Pad>
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <Card listing={tier1} width={343} />
        <Card listing={tier2Many} width={343} />
        <Card listing={tier3} width={343} />
      </div>
    </Pad>
  ),
}
