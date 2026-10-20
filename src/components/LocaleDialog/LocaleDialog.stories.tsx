import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { currencies, locales } from '../../data/locales'
import { Globe } from '../../icons'
import { DialogTrigger } from '../Dialog/Dialog'
import { IconButton } from '../IconButton/IconButton'
import { LocaleDialog } from './LocaleDialog'
import guidance from './LocaleDialog.guidance.md?raw'

const page = within(document.body)
const navigate = fn() // links hand their press to a router: a real navigation would unload the test page
const onLocaleChange = fn()

// The globe button and the dialog, holding the choices the way a page would.
function Demo({ open }: { open?: boolean }) {
  const [locale, setLocale] = useState('en-US')
  const [currency, setCurrency] = useState('USD')
  const dialog = (
    <LocaleDialog
      locales={locales}
      currencies={currencies}
      locale={locale}
      currency={currency}
      onLocaleChange={(l) => { setLocale(l); onLocaleChange(l) }}
      onCurrencyChange={setCurrency}
      {...(open ? { isOpen: true } : {})}
    />
  )
  return (
    <RouterProvider navigate={navigate}>
      {open ? dialog : (
        <DialogTrigger>
          <IconButton label="Language and region" icon={<Globe />} />
          {dialog}
        </DialogTrigger>
      )}
    </RouterProvider>
  )
}

const meta = {
  title: 'AcmeCo/LocaleDialog',
  component: LocaleDialog,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { locales, currencies, locale: 'en-US', currency: 'USD' },
} satisfies Meta<typeof LocaleDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Choose a language and a currency',
  render: () => <Demo />,
  play: async ({ canvas }) => {
    const globe = await canvas.findByRole('button', { name: 'Language and region' })
    await userEvent.click(globe)
    const dialog = await page.findByRole('dialog', { name: 'Language and currency' })
    const d = within(dialog)
    await expect(await d.findByRole('tablist', { name: 'Language and currency' })).toBeInTheDocument()
    await waitFor(() => expect(d.getByRole('radio', { name: 'English United States' })).toBeChecked())

    // A pointer choice applies and closes, and focus returns to the globe.
    await userEvent.click(d.getByText('United Kingdom'))
    await waitFor(() => expect(onLocaleChange).toHaveBeenLastCalledWith('en-GB'))
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(globe).toHaveFocus())

    // Keyboard: arrows apply without closing; Enter closes.
    await userEvent.keyboard('{Enter}')
    const again = within(await page.findByRole('dialog', { name: 'Language and currency' }))
    await userEvent.click(await again.findByRole('tab', { name: 'Currency' }))
    await waitFor(() => expect(again.getByRole('radio', { name: 'US Dollar USD $' })).toBeChecked())
    again.getByRole('radio', { name: 'US Dollar USD $' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(again.getByRole('radio', { name: 'Australian Dollar AUD $' })).toBeChecked())
    await expect(page.getByRole('dialog', { name: 'Language and currency' })).toBeInTheDocument()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    globe.blur()
  },
}

export const Open: Story = {
  name: 'Open (for the snapshot)',
  tags: ['!autodocs'],
  render: () => <Demo open />,
}
