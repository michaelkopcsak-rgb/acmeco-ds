import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { Link } from '../Link/Link'
import { Disclosure } from './Disclosure'
import guidance from './Disclosure.guidance.md?raw'

const navigate = fn() // links hand their press to a router: a real navigation would unload the test page

// The Search group from AcmeCo's menu (live site, 2026-10-10); addresses are placeholders.
const SEARCH = ['For Lease', 'For Sale', 'Auctions', 'Businesses', 'Find a Broker']
const list = (
  <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: 'var(--font-family-brand)' }}>
    {SEARCH.map((s) => (
      <li key={s} style={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}>
        <Link variant="subtle" href={`#${s.toLowerCase().replaceAll(' ', '-')}`}>{s}</Link>
      </li>
    ))}
  </ul>
)

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { title: 'Search', children: list },
  decorators: [(Story) => <RouterProvider navigate={navigate}><div style={{ width: '264px', padding: 'var(--space-2)' }}><Story /></div></RouterProvider>],
} satisfies Meta<typeof Disclosure>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Closed, then opened',
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: 'Search' })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByRole('link', { name: 'For Lease' })).toBeNull()
    await userEvent.click(button)
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'true'))
    await expect(await canvas.findByRole('link', { name: 'For Lease' })).toBeVisible()
    // Keyboard: Enter closes it again.
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'))
    button.blur()
  },
}

export const Open: Story = {
  args: { defaultExpanded: true },
}

export const AsHeading: Story = {
  name: 'As a section heading (accordion)',
  args: { title: 'Spaces available', headingLevel: 3, defaultExpanded: true, children: <p style={{ margin: 0, fontFamily: 'var(--font-family-brand)' }}>Placeholder section content.</p> },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { level: 3, name: 'Spaces available' })).toBeInTheDocument()
  },
}
