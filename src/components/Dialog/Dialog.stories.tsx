import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { Button } from '../Button/Button'
import { TextField } from '../TextField/TextField'
import { Dialog, DialogTrigger } from './Dialog'
import guidance from './Dialog.guidance.md?raw'

// Dialogs render at the end of the page (a portal), outside the story's canvas.
const page = within(document.body)

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: { title: 'Log in or sign up', children: null },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

function ContactForm() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <TextField label="Name" isRequired autoComplete="name" />
      <TextField label="Email" type="email" isRequired autoComplete="email" />
      <TextField label="Message" multiline rows={3} maxLength={400} defaultValue="Hi, I found Larkspur Commons on AcmeCo and would like to learn more about it. Thanks!" />
    </div>
  )
}

// ---- Interactive (closed until opened; shown on the docs page) ----

export const Default: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Log in / Sign up</Button>
      <Dialog title="Log in or sign up">
        <p style={{ margin: 0 }}>Follow your favourite listings and get alerts when new ones match your search.</p>
      </Dialog>
    </DialogTrigger>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Log in / Sign up' })
    await userEvent.click(trigger)
    // Named by its title; focus moves inside.
    const dialog = await page.findByRole('dialog', { name: 'Log in or sign up' })
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    // A short body doesn't scroll, so it adds no extra Tab stop.
    await expect(within(dialog).queryByRole('region')).toBeNull()
    // Escape closes, and focus returns to the button that opened it.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    // Clicking the backdrop closes it too (the default).
    await userEvent.click(trigger)
    const again = await page.findByRole('dialog')
    await userEvent.click(again.parentElement!.parentElement!) // dialog → modal → backdrop
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    // So does the labelled Close button.
    await userEvent.click(trigger)
    await userEvent.click(await page.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    trigger.blur()
  },
}

export const FormDialog: Story = {
  name: 'With a form (backdrop click ignored)',
  render: () => (
    <DialogTrigger>
      <Button>Contact broker</Button>
      <Dialog title="Contact broker" isDismissable={false} footer={(close) => <Button onPress={close}>Send message</Button>}>
        <ContactForm />
      </Dialog>
    </DialogTrigger>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Contact broker' })
    await userEvent.click(trigger)
    const dialog = await page.findByRole('dialog', { name: 'Contact broker' })
    // Let the fade-in finish (fully transparent counts as "not visible").
    await waitFor(() => expect(dialog).toBeVisible())
    // A stray click on the backdrop keeps the form open (decision 28)...
    const backdrop = dialog.parentElement!.parentElement!
    await userEvent.click(backdrop)
    await expect(backdrop).not.toHaveAttribute('data-exiting')
    await expect(page.getByRole('dialog', { name: 'Contact broker' })).toBeInTheDocument()
    // ...while the footer action (or Escape, or Close) still closes it.
    await userEvent.click(page.getByRole('button', { name: 'Send message' }))
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    trigger.blur()
  },
}

// ---- Open, for visual review (each covers the page, so they're left off the docs page) ----

const open = { tags: ['!autodocs'] }

export const OpenMedium: Story = {
  ...open,
  name: 'Open: md with footer (contact broker)',
  render: () => (
    <DialogTrigger defaultOpen>
      <Button>Contact broker</Button>
      <Dialog title="Contact broker" isDismissable={false} footer={<Button>Send message</Button>}>
        <ContactForm />
      </Dialog>
    </DialogTrigger>
  ),
}

export const OpenLarge: Story = {
  ...open,
  name: 'Open: lg (sign-in)',
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="secondary">Log in / Sign up</Button>
      <Dialog title="Log in or sign up" size="lg">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
          <p style={{ margin: 0 }}>Follow your favourite listings, get instant alerts and save time on future inquiries with a free account.</p>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <TextField label="Email" type="email" autoComplete="email" />
            <Button fullWidth>Continue</Button>
          </div>
        </div>
      </Dialog>
    </DialogTrigger>
  ),
}

export const OpenLongContent: Story = {
  ...open,
  name: 'Open: long content (body scrolls)',
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="secondary">Terms</Button>
      <Dialog title="Terms of use" footer={(close) => <Button onPress={close}>Done</Button>}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>Placeholder paragraph {i + 1}. The header and footer stay in place while this text scrolls between them, so the title and the action are always in view.</p>
        ))}
      </Dialog>
    </DialogTrigger>
  ),
  play: async () => {
    const dialog = await page.findByRole('dialog')
    // The body scrolls, so it can take keyboard focus (for arrow keys), named for the dialog.
    const body = await within(dialog).findByRole('region', { name: 'Terms of use, content' })
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)
    await expect(body).toHaveAttribute('tabindex', '0')
  },
}

export const OpenPhone: Story = {
  ...open,
  name: 'Open: phone (full screen)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  render: OpenMedium.render,
}
