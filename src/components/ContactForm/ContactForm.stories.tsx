import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { clearAnnouncer } from 'react-aria/private/live-announcer/LiveAnnouncer'
import { expect, fn, waitFor, within } from 'storybook/test'
import { brokerById, listings } from '../../data/fixtures'
import { Button } from '../Button/Button'
import { DialogTrigger } from '../Dialog/Dialog'
import { ContactForm } from './ContactForm'
import guidance from './ContactForm.guidance.md?raw'

const page = within(document.body)
const listing = listings[0]
const brokers = listing.brokerIds.map(brokerById)
const lead = brokers[0]
const onSubmit = fn()

const meta = {
  title: 'AcmeCo/ContactForm',
  component: ContactForm,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { listingTitle: listing.title, company: listing.company, brokers, onSubmit },
  // Links in the form use a stand-in router: a real navigation would crash the test runner.
  render: (args) => (
    <RouterProvider navigate={() => {}}>
      <DialogTrigger>
        <Button>Message</Button>
        <ContactForm {...args} />
      </DialogTrigger>
    </RouterProvider>
  ),
} satisfies Meta<typeof ContactForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Send a message (labels, validation, sent)',
  play: async ({ canvas, userEvent }) => {
    onSubmit.mockClear()
    const trigger = canvas.getByRole('button', { name: 'Message' })
    await userEvent.click(trigger)
    const dialog = await page.findByRole('dialog', { name: 'Contact broker' })
    const form = within(dialog)
    // Every field has a real label; required ones are announced as required.
    for (const name of ['First name', 'Last name', 'Email', 'Phone', 'Message']) {
      await expect(form.getByRole('textbox', { name: new RegExp(`^${name}`) })).toBeRequired()
    }
    await expect(form.getByRole('textbox', { name: 'Ext (optional)' })).not.toBeRequired()
    // The message is prefilled with the listing, as on AcmeCo.
    await expect(form.getByRole('textbox', { name: /^Message/ })).toHaveValue(`Hi, I found ${listing.title} on AcmeCo and would like to learn more about it. Thanks!`)

    // Sending empty: each problem shows under its field, and focus goes to the first.
    await userEvent.click(form.getByRole('button', { name: 'Contact Broker' }))
    const first = form.getByRole('textbox', { name: /^First name/ })
    await waitFor(() => expect(first).toHaveFocus())
    await expect(first).toHaveAccessibleDescription('Enter your first name.')
    await expect(form.getByText('Enter your phone number.')).toBeVisible()
    await expect(onSubmit).not.toHaveBeenCalled()

    // A wrong email is explained; a fixed field clears its message as you type.
    await userEvent.type(first, 'Sam')
    await expect(first).not.toHaveAccessibleDescription('Enter your first name.')
    await userEvent.type(form.getByRole('textbox', { name: /^Last name/ }), 'Rivera')
    await userEvent.type(form.getByRole('textbox', { name: /^Email/ }), 'sam.example.com')
    await userEvent.type(form.getByRole('textbox', { name: /^Phone/ }), '(303) 555-0142')
    await userEvent.click(form.getByRole('button', { name: 'Contact Broker' }))
    const email = form.getByRole('textbox', { name: /^Email/ })
    await waitFor(() => expect(email).toHaveFocus())
    await expect(email).toHaveAccessibleDescription('Enter an email address like name@example.com.')

    // Fixed: it sends, confirms who it went to, and Done returns focus to Message.
    await userEvent.clear(email)
    await userEvent.type(email, 'sam@example.com')
    await userEvent.click(form.getByRole('button', { name: 'Contact Broker' }))
    const sent = await form.findByRole('status')
    await expect(sent).toHaveTextContent(`Message sent to ${lead.name}.`)
    await waitFor(() => expect(sent).toHaveFocus())
    await expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Sam', email: 'sam@example.com', phone: '(303) 555-0142' }))
    await userEvent.click(form.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    trigger.blur()
    // React Aria announced "Contact Broker" loading and finished, pointing at the button; those
    // announcements stay in the page for 7s, after the dialog (and button) closed. Screen readers
    // read them when they were made; clearing them keeps the accessibility scan below honest.
    clearAnnouncer('assertive')
  },
}

// ---- Open, for visual review (each covers the page, so they're left off the docs page) ----

const openRender: Story['render'] = (args) => (
  <RouterProvider navigate={() => {}}>
    <DialogTrigger defaultOpen>
      <Button>Message</Button>
      <ContactForm {...args} />
    </DialogTrigger>
  </RouterProvider>
)

export const Open: Story = { tags: ['!autodocs'], name: 'Open', render: openRender }

export const OpenWithErrors: Story = {
  tags: ['!autodocs'],
  name: 'Open: problems after sending empty',
  render: openRender,
  play: async ({ userEvent }) => {
    const dialog = await page.findByRole('dialog', { name: 'Contact broker' })
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.click(within(dialog).getByRole('button', { name: 'Contact Broker' }))
    await within(dialog).findByText('Enter your first name.')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const OpenPhone: Story = {
  tags: ['!autodocs'],
  name: 'Open: phone (full screen)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  render: openRender,
}
