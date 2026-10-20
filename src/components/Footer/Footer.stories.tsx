import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, within } from 'storybook/test'
import { footerApps, footerColumns, footerPhoneLinks, footerSocial } from '../../data/footer'
import { Footer } from './Footer'
import guidance from './Footer.guidance.md?raw'

const navigate = fn() // links hand their press to a router: a real navigation would unload the test page

const meta = {
  title: 'AcmeCo/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: guidance } } },
  args: { columns: footerColumns, social: footerSocial, apps: footerApps },
  decorators: [(Story) => <RouterProvider navigate={navigate}><main style={{ minHeight: '80px' }} /><Story /></RouterProvider>],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    // A footer landmark, outside main.
    const footer = await canvas.findByRole('contentinfo')
    const f = within(footer)
    await expect(f.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Search', 'Products & Services', 'Marketplace', 'Resources', 'Company'])
    await expect(f.getByRole('link', { name: 'Accessibility Commitment' })).toBeInTheDocument()
    // Marketplace sites open in a new tab and say so.
    await expect(f.getByRole('link', { name: 'AcmeCo Homes (opens in a new tab)' })).toHaveAttribute('target', '_blank')
    // Named social placeholders.
    await expect(f.getByRole('list', { name: 'Connect with us' })).toBeInTheDocument()
    await expect(f.getByRole('link', { name: 'AcmeCo on LinkedIn (opens in a new tab)' })).toBeInTheDocument()
  },
}

export const WithDisclaimer: Story = {
  name: 'With a disclaimer (search pages)',
  args: { disclaimer: 'Placeholder disclaimer: listing information is provided by brokers and owners and is not guaranteed.' },
}

export const Phone: Story = {
  name: 'Phone (two columns, nothing off screen)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  play: async ({ canvas, canvasElement }) => {
    const footer = await canvas.findByRole('contentinfo')
    // Every column, Company included, sits inside the screen.
    for (const h of within(footer).getAllByRole('heading', { level: 2 })) {
      await expect(h.getBoundingClientRect().right).toBeLessThanOrEqual(canvasElement.ownerDocument.documentElement.clientWidth)
    }
    await expect(canvasElement.ownerDocument.documentElement.scrollWidth).toBeLessThanOrEqual(canvasElement.ownerDocument.documentElement.clientWidth)
  },
}

export const PhoneLinks: Story = {
  name: 'Phone, AcmeCo\'s one list of links (decision 51)',
  args: { phoneLinks: footerPhoneLinks, disclaimer: 'Placeholder disclaimer: listing information is provided by brokers and owners and is not guaranteed.' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  play: async ({ canvas }) => {
    const footer = within(await canvas.findByRole('contentinfo'))
    // The columns (and their headings) give way to one list of AcmeCo's 12 phone links.
    await expect(footer.queryAllByRole('heading')).toHaveLength(0)
    const lists = footer.getAllByRole('list')
    const links = lists.find((l) => within(l).queryByRole('link', { name: 'About Us' }))!
    await expect(within(links).getAllByRole('link')).toHaveLength(footerPhoneLinks.length)
  },
}
