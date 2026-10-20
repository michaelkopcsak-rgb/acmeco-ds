import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { currencies, locales } from '../../data/locales'
import { searchLinks } from '../../data/navigation'
import { signInSlides } from '../../data/sign-in'
import { menuLinksAfter, menuLinksBefore, menuSearchLinks } from '../../data/site-menu'
import { Heart } from '../../icons'
import { IconButton } from '../IconButton/IconButton'
import { PageContainer } from '../Layout/Layout'
import { GlobalHeader } from './GlobalHeader'
import guidance from './GlobalHeader.guidance.md?raw'

const page = within(document.body)
// Links hand their press to a router instead of loading a page: a real navigation would
// unload the test page (the Link stories found it crashes the test runner).
const navigate = fn()
const menu = { linksBefore: menuLinksBefore, searchLinks: menuSearchLinks, linksAfter: menuLinksAfter }

// The header over a placeholder page, holding the language and currency the way a page would.
function Demo({ current }: { current?: string }) {
  const [locale, setLocale] = useState('en-US')
  const [currency, setCurrency] = useState('USD')
  return (
    <RouterProvider navigate={navigate}>
      <GlobalHeader
        links={searchLinks.map((l) => ({ ...l, isCurrent: l.label === current }))}
        menu={menu}
        locales={locales}
        currencies={currencies}
        locale={locale}
        currency={currency}
        onLocaleChange={setLocale}
        onCurrencyChange={setCurrency}
        signInSlides={signInSlides}
      />
      <main id="main" tabIndex={-1} style={{ outline: 'none', padding: 'var(--space-5) 0' }}>
        <PageContainer>
          <p style={{ margin: 0, fontFamily: 'var(--font-family-brand)', color: 'var(--color-text-subtle)' }}>Page content (placeholder)</p>
        </PageContainer>
      </main>
    </RouterProvider>
  )
}

const meta = {
  title: 'AcmeCo/GlobalHeader',
  component: GlobalHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: guidance } } },
  args: { links: searchLinks, menu, locales, currencies, locale: 'en-US', currency: 'USD', signInSlides },
} satisfies Meta<typeof GlobalHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (skip link, globe, sign in, menu)',
  render: () => <Demo />,
  play: async ({ canvas, canvasElement }) => {
    const header = await canvas.findByRole('banner')
    const h = within(header)
    await expect(h.getByRole('link', { name: 'AcmeCo home' })).toBeInTheDocument()
    const nav = await h.findByRole('navigation', { name: 'Search' })
    await expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual(['For Lease', 'For Sale', 'Auctions', 'Businesses For Sale'])
    // AcmeCo's order on the right: globe, Sign In, Advertise, menu.
    await expect(h.getByRole('link', { name: 'Advertise' })).toBeVisible()

    // The skip link is the first stop and moves focus to the page's main content.
    await userEvent.tab()
    const skip = canvas.getByRole('link', { name: 'Skip to main content' })
    await waitFor(() => expect(skip).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvasElement.ownerDocument.activeElement).toBe(canvas.getByRole('main')))

    // The globe opens the language and currency dialog; Escape closes it and focus returns.
    const globe = h.getByRole('button', { name: 'Language and region' })
    await userEvent.click(globe)
    await page.findByRole('dialog', { name: 'Language and currency' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(globe).toHaveFocus())

    // Sign In is a real button that opens the sign-in dialog.
    const signIn = h.getByRole('button', { name: 'Sign In' })
    await userEvent.click(signIn)
    await page.findByRole('dialog', { name: 'Log in or sign up' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(signIn).toHaveFocus())

    // The menu opens AcmeCo's panel.
    const menuButton = h.getByRole('button', { name: 'Menu' })
    await userEvent.click(menuButton)
    await page.findByRole('dialog', { name: 'Menu' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(menuButton).toHaveFocus())
    menuButton.blur()
  },
}

export const CurrentPage: Story = {
  name: 'Current page marked',
  render: () => <Demo current="For Lease" />,
  play: async ({ canvas }) => {
    const current = await canvas.findByRole('link', { name: 'For Lease' })
    await waitFor(() => expect(current).toHaveAttribute('aria-current', 'page'))
    await expect(canvas.getByRole('link', { name: 'For Sale' })).not.toHaveAttribute('aria-current')
  },
}

export const Phone: Story = {
  name: 'Phone (logo, globe, menu)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  render: () => <Demo />,
  play: async ({ canvas }) => {
    const header = within(await canvas.findByRole('banner'))
    // The story's phone viewport applies in the test runner too: the logo, the globe and the menu,
    // as on AcmeCo's phones; search links, Sign In and Advertise are in the menu.
    await expect(header.queryByRole('navigation', { name: 'Search' })).toBeNull()
    await expect(header.getByRole('button', { name: 'Language and region' })).toBeVisible()
    await expect(header.queryByRole('button', { name: 'Sign In' })).toBeNull()
    await expect(header.queryByRole('link', { name: 'Advertise' })).toBeNull()
    // They're in the menu's Search group, as on AcmeCo.
    const menuButton = header.getByRole('button', { name: 'Menu' })
    await userEvent.click(menuButton)
    const panel = within(await page.findByRole('dialog', { name: 'Menu' }))
    await userEvent.click(panel.getByRole('button', { name: 'Search' }))
    await expect(await panel.findByRole('link', { name: 'For Lease' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(menuButton).toHaveFocus())
    menuButton.blur()
  },
}

// A listing on a phone (decision 51): the back arrow, and save / share in place of the globe and
// menu once the page's actions row has scrolled under the header.
function ListingDemo() {
  const [saved, setSaved] = useState(false)
  return (
    <RouterProvider navigate={navigate}>
      <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <GlobalHeader
          links={searchLinks} menu={menu} locales={locales} currencies={currencies} locale="en-US" currency="USD" signInSlides={signInSlides}
          back={{ href: '#results', label: 'Back to search results' }}
          pageActions={{ after: 'story-actions', content: <IconButton label="Save Larkspur Commons" icon={<Heart />} isSelected={saved} onChange={setSaved} /> }}
        />
      </div>
      <main id="main" tabIndex={-1}>
        <PageContainer>
          <p id="story-actions">The listing's actions row (location, share, save) would be here.</p>
          <div style={{ height: '2000px' }} />
        </PageContainer>
      </main>
    </RouterProvider>
  )
}

export const ListingPhone: Story = {
  name: 'Listing on a phone (back arrow; save once scrolled)',
  render: () => <ListingDemo />,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('link', { name: 'Back to search results' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Menu' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Save Larkspur Commons' })).toBeNull()
    window.scrollTo(0, 800)
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Save Larkspur Commons' })).toBeVisible())
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull()
    window.scrollTo(0, 0)
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Menu' })).toBeVisible())
  },
}
