import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { brokerById, listings } from '../../data/fixtures'
import { cityLine, sizeAvailable, sizeRange } from '../../data/format'
import type { Price } from '../../data/types'
import { Badge } from '../Badge/Badge'
import { BrokerIdentity } from './BrokerIdentity'
import { PropertyFacts } from './PropertyFacts'
import { PropertyHeader } from './PropertyHeader'
import { PropertyMedia } from './PropertyMedia'
import { PropertyPrice } from './PropertyPrice'
import guidance from './PropertyParts.guidance.md?raw'

const listing = listings[0] // Larkspur Commons: tier 1, virtual tour, 3 brokers

const meta = {
  title: 'AcmeCo/Property parts',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children, width = 640, height }: { children: ReactNode; width?: number; height?: number }) {
  return <div style={{ width: `${width}px`, maxWidth: '100%', height: height ? `${height}px` : undefined }}>{children}</div>
}

// ---- PropertyMedia ----
function Media() {
  const [saved, setSaved] = useState(false)
  return (
    <Frame height={320}>
      <PropertyMedia
        photos={listing.photos}
        title={listing.title}
        saved={saved}
        onSaveChange={setSaved}
        labels={<Badge>{listing.type}</Badge>}
        feature={listing.virtualTour ? <Badge tone="feature">Virtual Tour</Badge> : undefined}
      />
    </Frame>
  )
}

export const MediaStory: Story = {
  name: 'Media (carousel, save, labels)',
  render: () => <Media />,
  play: async ({ canvas, userEvent }) => {
    // A named carousel with labelled controls (AcmeCo's have no names today).
    await expect(canvas.getByRole('group', { name: `Photos of ${listing.title}` })).toBeVisible()
    const first = canvas.getByRole('img').getAttribute('src')
    await userEvent.click(canvas.getByRole('button', { name: 'Next photo' }))
    await expect(canvas.getByRole('img').getAttribute('src')).not.toBe(first)
    await expect(canvas.getByText(`Photo 2 of ${listing.photos.length}`)).toBeInTheDocument()
    // Previous from photo 1 wraps to the last photo.
    await userEvent.click(canvas.getByRole('button', { name: 'Previous photo' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Previous photo' }))
    await expect(canvas.getByText(`Photo ${listing.photos.length} of ${listing.photos.length}`)).toBeInTheDocument()
    // The save toggle is named for the listing.
    const save = canvas.getByRole('button', { name: `Save ${listing.title}` })
    await userEvent.click(save)
    await expect(save).toHaveAttribute('aria-pressed', 'true')
    save.blur()
  },
}

export const Thumbnail: Story = {
  render: () => (
    <Frame width={160} height={110}>
      <PropertyMedia photos={listing.photos} title={listing.title} variant="thumb" showCarousel={false} />
    </Frame>
  ),
}

// ---- PropertyHeader ----
export const Header: Story = {
  render: () => (
    <Frame>
      <PropertyHeader title={listing.title} href="#listing" address={listing.address} sizeText={sizeAvailable(listing)} location={cityLine(listing)} />
    </Frame>
  ),
  play: async ({ canvas }) => {
    // The title is a heading and the card's one link.
    const heading = canvas.getByRole('heading', { level: 3, name: listing.title })
    await expect(heading).toBeVisible()
    await expect(canvas.getByRole('link', { name: listing.title })).toHaveAttribute('href', '#listing')
  },
}

export const HeaderNarrow: Story = {
  name: 'Header (narrow: stacks)',
  render: () => (
    <Frame width={280}>
      <PropertyHeader title={listing.title} href="#listing" address={listing.address} sizeText={sizeAvailable(listing)} location={cityLine(listing)} />
    </Frame>
  ),
}

export const HeaderCompact: Story = {
  name: 'Header (compact: tier 3)',
  render: () => (
    <Frame width={280}>
      <PropertyHeader layout="compact" title={listing.title} href="#listing" address={listing.address} location={cityLine(listing)} />
    </Frame>
  ),
}

// ---- PropertyFacts and PropertyPrice ----
export const Facts: Story = {
  name: 'Facts (price first, with description)',
  render: () => (
    <Frame>
      <PropertyFacts price={listing.price} facts={[`Built in ${listing.builtYear}`, sizeRange(listing.size)]} description={listing.description} />
    </Frame>
  ),
  play: async ({ canvas }) => {
    // Units are spelled out for screen readers.
    await expect(canvas.getByText('$28.50 per square foot per year')).toBeInTheDocument()
  },
}

export const FactsBelow: Story = {
  name: 'Facts (description below: tier 2)',
  render: () => (
    <Frame width={308}>
      <PropertyFacts price={listing.price} facts={[`Built in ${listing.builtYear}`, sizeRange(listing.size)]} description={listing.description} descriptionPlacement="below" />
    </Frame>
  ),
}

const PRICES: { label: string; price: Price }[] = [
  { label: 'Rate', price: { kind: 'rate', amount: 28.5, unit: 'SF/YR' } },
  { label: 'Total', price: { kind: 'total', amount: 1850000 } },
  { label: 'Auction', price: { kind: 'bid', startingBid: 950000 } },
  { label: 'On request', price: { kind: 'request' } },
]

export const Prices: Story = {
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-2)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">Kind</span></th>
          <th scope="col" style={{ textAlign: 'left' }}>compact</th>
          <th scope="col" style={{ textAlign: 'left' }}>prominent</th>
        </tr>
      </thead>
      <tbody>
        {PRICES.map((p) => (
          <tr key={p.label}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)' }}>{p.label}</th>
            <td><PropertyPrice price={p.price} /></td>
            <td><PropertyPrice price={p.price} size="prominent" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

// ---- BrokerIdentity ----
export const Brokers: Story = {
  name: 'Broker identity (1 to 3 brokers, or logo only)',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      {[3, 2, 1, 0].map((n) => (
        <BrokerIdentity key={n} company={listing.company} brokers={listing.brokerIds.slice(0, n).map(brokerById)} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    // The first block lists three brokers by name.
    const lists = canvas.getAllByRole('list', { name: 'Listing brokers' })
    await expect(lists[0].querySelectorAll('li')).toHaveLength(3)
  },
}

export const BrokersCompact: Story = {
  name: 'Broker identity (stacked, names hidden: tier 2)',
  render: () => (
    <Frame width={280}>
      <BrokerIdentity company={listing.company} brokers={listing.brokerIds.map(brokerById)} names="hidden" layout="stacked" />
    </Frame>
  ),
  play: async ({ canvas }) => {
    // Names aren't shown, but screen readers still hear each one.
    for (const id of listing.brokerIds) await expect(canvas.getByText(brokerById(id).name)).toHaveClass('sr-only')
  },
}
