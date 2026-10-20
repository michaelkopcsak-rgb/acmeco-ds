import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { signInSlides } from '../../data/sign-in'
import { menuLinksAfter, menuLinksBefore, menuSearchLinks } from '../../data/site-menu'
import { SiteMenu } from './SiteMenu'
import guidance from './SiteMenu.guidance.md?raw'

const page = within(document.body)
const navigate = fn() // links hand their press to a router: a real navigation would unload the test page

const meta = {
  title: 'AcmeCo/SiteMenu',
  component: SiteMenu,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { linksBefore: menuLinksBefore, searchLinks: menuSearchLinks, linksAfter: menuLinksAfter, signInSlides },
  decorators: [(Story) => <RouterProvider navigate={navigate}><div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-2) var(--space-2) 480px' }}><Story /></div></RouterProvider>],
} satisfies Meta<typeof SiteMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Open the menu, Search, then sign in',
  play: async ({ canvas }) => {
    const menu = await canvas.findByRole('button', { name: 'Menu' })
    await userEvent.click(menu)
    const panel = within(await page.findByRole('dialog', { name: 'Menu' }))
    const nav = await panel.findByRole('navigation', { name: 'Site' })
    // AcmeCo's items, in order (the Search links stay hidden until the group opens).
    const top = within(nav).getAllByRole('link').map((a) => a.textContent)
    await expect(top).toEqual(['Log In/Sign Up', 'Explore Marketing Solutions', 'Advertise', 'Marketing Center (opens in a new tab)', 'Preferences', 'Help Center'])
    await expect(within(nav).getByRole('link', { name: 'Marketing Center (opens in a new tab)' })).toHaveAttribute('target', '_blank')
    const search = panel.getByRole('button', { name: 'Search' })
    await expect(search).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(search)
    await waitFor(() => expect(search).toHaveAttribute('aria-expanded', 'true'))
    await expect(await panel.findByRole('link', { name: 'Find a Broker' })).toBeVisible()

    // "Log In/Sign Up" closes the menu and opens the sign-in dialog; closing that returns focus to Menu.
    await userEvent.click(panel.getByRole('link', { name: 'Log In/Sign Up' }))
    await page.findByRole('dialog', { name: 'Log in or sign up' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(menu).toHaveFocus())
    menu.blur()
  },
}
