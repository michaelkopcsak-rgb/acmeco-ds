import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Menu } from '../../icons'
import { IconButton } from '../IconButton/IconButton'
import { Link } from '../Link/Link'
import { Popover } from './Popover'
import guidance from './Popover.guidance.md?raw'

const page = within(document.body)
const navigate = fn() // links hand their press to a router: a real navigation would unload the test page

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { label: 'Menu', trigger: <IconButton label="Menu" icon={<Menu />} />, children: null },
  decorators: [(Story) => <RouterProvider navigate={navigate}><div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-2) var(--space-2) 220px' }}><Story /></div></RouterProvider>],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const links = (
  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 'var(--space-2)', minWidth: '200px', fontFamily: 'var(--font-family-brand)' }}>
    <li><Link variant="subtle" href="#preferences">Preferences</Link></li>
    <li><Link variant="subtle" href="#help">Help Center</Link></li>
  </ul>
)

export const Default: Story = {
  args: { children: links },
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: 'Menu' })
    await userEvent.click(button)
    const panel = await page.findByRole('dialog', { name: 'Menu' })
    await expect(within(panel).getByRole('link', { name: 'Help Center' })).toBeVisible()
    // Escape closes it and focus goes back to the button.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(button).toHaveFocus())
    button.blur()
  },
}

export const Open: Story = {
  name: 'Open (for the snapshot)',
  tags: ['!autodocs'],
  args: { children: links, isOpen: true },
}
