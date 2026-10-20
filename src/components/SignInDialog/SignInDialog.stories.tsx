import type { Meta, StoryObj } from '@storybook/react-vite'
import { clearAnnouncer } from 'react-aria/private/live-announcer/LiveAnnouncer'
import { expect, fn, waitFor, within } from 'storybook/test'
import { signInSlides } from '../../data/sign-in'
import { Button } from '../Button/Button'
import { DialogTrigger } from '../Dialog/Dialog'
import { SignInDialog } from './SignInDialog'
import guidance from './SignInDialog.guidance.md?raw'

const page = within(document.body)
const onContinue = fn()
const onProvider = fn()

const slides = signInSlides

const meta = {
  title: 'AcmeCo/SignInDialog',
  component: SignInDialog,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { slides, onContinue, onProvider },
  render: (args) => (
    <DialogTrigger>
      {/* On search results the trigger is "Save results". */}
      <Button variant="tertiary">Save results</Button>
      <SignInDialog {...args} />
    </DialogTrigger>
  ),
} satisfies Meta<typeof SignInDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Log in or sign up (email, options, slides)',
  play: async ({ canvas, userEvent }) => {
    onContinue.mockClear()
    onProvider.mockClear()
    const trigger = canvas.getByRole('button', { name: 'Save results' })
    await userEvent.click(trigger)
    const dialog = await page.findByRole('dialog', { name: 'Log in or sign up' })
    const d = within(dialog)

    // The email field has a real label and is required; Continue checks it.
    const email = d.getByRole('textbox', { name: /^Email/ })
    await expect(email).toBeRequired()
    await userEvent.click(d.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(email).toHaveFocus())
    await expect(email).toHaveAccessibleDescription('Enter your email address.')
    await userEvent.type(email, 'sam@example.com')
    await expect(email).not.toHaveAccessibleDescription('Enter your email address.')
    await userEvent.click(d.getByRole('button', { name: 'Continue' }))
    await expect(onContinue).toHaveBeenCalledWith('sam@example.com')

    // Other options are named in words (AcmeCo's are unnamed logo buttons).
    await userEvent.click(d.getByRole('button', { name: 'Continue with LinkedIn' }))
    await expect(onProvider).toHaveBeenCalledWith('LinkedIn')

    // The carousel: named dots, the current one marked; choosing one shows that slide.
    const carousel = d.getByRole('region', { name: 'Why sign up' })
    await expect(within(carousel).getByRole('button', { name: 'Slide 1 of 4: Never miss a deal' })).toHaveAttribute('aria-current', 'true')
    await userEvent.click(within(carousel).getByRole('button', { name: 'Slide 4 of 4: Access secure data' }))
    await expect(within(carousel).getByRole('heading', { name: 'Access secure data' })).toBeVisible()
    await expect(within(carousel).getByRole('group', { name: '4 of 4' })).toBeInTheDocument()

    // Escape closes it and returns focus to "Save results".
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    trigger.blur()
    // Continue's loading announcements point at a button that has now closed; screen
    // readers read them when made (see ContactForm's story).
    clearAnnouncer('assertive')
  },
}

const openRender: Story['render'] = (args) => (
  <DialogTrigger defaultOpen>
    <Button variant="tertiary">Save results</Button>
    <SignInDialog {...args} />
  </DialogTrigger>
)

export const Open: Story = { tags: ['!autodocs'], name: 'Open', render: openRender }

export const OpenPhone: Story = {
  tags: ['!autodocs'],
  name: 'Open: phone (form first, promo below)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  render: openRender,
}
