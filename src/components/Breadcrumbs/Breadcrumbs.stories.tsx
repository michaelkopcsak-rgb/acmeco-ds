import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn } from 'storybook/test'
import { Breadcrumbs } from './Breadcrumbs'
import guidance from './Breadcrumbs.guidance.md?raw'

const navigate = fn()
const LISTING = [
  { label: 'Office Spaces', href: '#office' },
  { label: 'Colorado', href: '#colorado' },
  { label: 'Denver', href: '#denver' },
  { label: '1840 Larkspur Ave, Denver, CO 80202' },
]
const BACK = [{ label: 'Larkspur Commons', href: '#listing' }, { label: 'Jordan Ellis' }]

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { items: LISTING },
  decorators: [(Story) => <RouterProvider navigate={navigate}><div style={{ padding: 'var(--space-2)' }}><Story /></div></RouterProvider>],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    // React Aria renders the items a moment after the list, so wait for them (findBy).
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(await canvas.findAllByRole('link')).toHaveLength(3)
    await expect(nav.querySelector('ol')).not.toBeNull()
    const current = await canvas.findByText('1840 Larkspur Ave, Denver, CO 80202')
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(current.closest('a')).toBeNull()
  },
}

export const Plain: Story = {
  name: 'Plain, one step back',
  args: { items: BACK, appearance: 'plain' },
}

export const Phone: Story = {
  name: 'Phone (the current page wraps)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvas }) => {
    const items = await canvas.findAllByRole('listitem')
    // The address drops onto its own line below the links, as on AcmeCo's phone.
    await expect(items.at(-1)!.getBoundingClientRect().top).toBeGreaterThan(items[0].getBoundingClientRect().top)
  },
}

// Each appearance and length, for review and the Figma parity check.
const CELLS = [
  { name: 'Strip, four', props: { items: LISTING } },
  { name: 'Plain, four', props: { items: LISTING, appearance: 'plain' as const } },
  { name: 'Strip, two', props: { items: BACK } },
  { name: 'Plain, two', props: { items: BACK, appearance: 'plain' as const } },
]
export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <tbody>
        {CELLS.map((c) => (
          <tr key={c.name}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)' }}>{c.name}</th>
            <td style={{ width: '560px' }}><Breadcrumbs label={`Breadcrumb (${c.name})`} {...c.props} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
