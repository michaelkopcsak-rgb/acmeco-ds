import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { clearAnnouncer } from 'react-aria/private/live-announcer/LiveAnnouncer'
import { expect, fn, waitFor, within } from 'storybook/test'
import { brokerById, brokers, listings } from '../../data/fixtures'
import { ContactModule } from './ContactModule'
import guidance from './ContactModule.guidance.md?raw'

const page = within(document.body)
const listing = listings[1]
const onShare = fn()
const navigate = fn()

function Demo({ brokerCount = 1 }: { brokerCount?: number }) {
  const [saved, setSaved] = useState(false)
  // The listing's own lead broker, or three different brokers.
  const people = brokerCount === 1 ? [brokerById(listing.brokerIds[0])] : brokers.slice(0, brokerCount)
  return (
    // A stand-in router: following the tel: link in a test would leave the page.
    <RouterProvider navigate={navigate}>
      {/* AcmeCo's sidebar is 340px wide; padded so the shadow isn't cropped in snapshots. */}
      <div style={{ width: '340px', padding: 'var(--space-4)' }}>
        <ContactModule
          listingTitle={listing.title}
          company={listing.company}
          brokers={people}
          saved={saved}
          onSaveChange={setSaved}
          onShare={onShare}
        />
      </div>
    </RouterProvider>
  )
}

const meta = {
  title: 'AcmeCo/ContactModule',
  component: ContactModule,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { listingTitle: listing.title, company: listing.company, brokers: [] },
  render: () => <Demo />,
} satisfies Meta<typeof ContactModule>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (one broker, as on AcmeCo)',
  play: async ({ canvas, userEvent }) => {
    const lead = brokerById(listing.brokerIds[0])
    const box = canvas.getByRole('complementary', { name: `Contact about ${listing.title}` })
    // The phone number is a real link that calls.
    await expect(within(box).getByRole('link', { name: `Call ${lead.phone}` })).toHaveAttribute('href', expect.stringMatching(/^tel:\+1\d{10}$/))
    await expect(within(box).getByRole('heading', { level: 3, name: 'Contact' })).toBeVisible()
    // Share and Save are named for the listing; Save is a toggle.
    await userEvent.click(within(box).getByRole('button', { name: `Share ${listing.title}` }))
    await expect(onShare).toHaveBeenCalled()
    const save = within(box).getByRole('button', { name: `Save ${listing.title}` })
    await userEvent.click(save)
    await expect(save).toHaveAttribute('aria-pressed', 'true')
    // Message opens the contact form, and closing it returns focus to Message.
    const message = within(box).getByRole('button', { name: 'Message' })
    await userEvent.click(message)
    await page.findByRole('dialog', { name: 'Contact broker' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(message).toHaveFocus())
    message.blur()
    clearAnnouncer('assertive')
  },
}

export const ThreeBrokers: Story = { name: 'Three brokers', render: () => <Demo brokerCount={3} /> }
