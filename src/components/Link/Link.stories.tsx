import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { Link, type LinkVariant } from './Link'
import guidance from './Link.guidance.md?raw'

// Dark backdrop for the inverse variant (stories only).
function Dark({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-brand-dark)', color: 'var(--color-text-inverse)' }}>
      {children}
    </div>
  )
}

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    children: 'floor plans',
    href: '#floor-plans',
    variant: 'inline',
    onPress: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['inline', 'standalone', 'subtle', 'inverse'] },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

// A stand-in router. Clicking a real link would navigate away from the page
// running the test (it crashed the test runner); React Aria's RouterProvider
// hands the press to a router instead, which is also how the app will route.
const navigate = fn()

export const Inline: Story = {
  render: (args) => (
    <RouterProvider navigate={navigate}>
      <p style={{ maxWidth: '60ch' }}>
        Class A office space with flexible suites. See the building&apos;s <Link {...args} /> before booking a tour.
      </p>
    </RouterProvider>
  ),
  play: async ({ args, canvas, userEvent }) => {
    navigate.mockClear()
    const link = canvas.getByRole('link', { name: 'floor plans' })
    await expect(link).toHaveAttribute('href', '#floor-plans')
    await userEvent.click(link)
    await expect(args.onPress).toHaveBeenCalledTimes(1)
    await expect(navigate).toHaveBeenCalledWith('#floor-plans', undefined)
    // Keyboard: Enter follows the link too.
    await userEvent.keyboard('{Enter}')
    await expect(navigate).toHaveBeenCalledTimes(2)
    link.blur()
  },
}

export const Standalone: Story = {
  args: { variant: 'standalone', children: 'View all office listings in Chicago' },
}

export const Subtle: Story = {
  name: 'Subtle (card title)',
  args: { variant: 'subtle', children: '233 S Wacker Dr' },
  render: (args) => (
    // The link takes the heading's size and weight.
    <h3 style={{ margin: 0, fontSize: 'var(--typography-heading-3-font-size)', lineHeight: 'var(--typography-heading-3-line-height)', fontWeight: 'var(--typography-heading-3-font-weight)' }}>
      <Link {...args} />
    </h3>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: '233 S Wacker Dr' })
    await expect(getComputedStyle(link).fontWeight).toBe('600')
  },
}

export const Inverse: Story = {
  args: { variant: 'inverse', children: 'View auction terms' },
  render: (args) => (
    <Dark>
      Bidding opens Monday. <Link {...args} />
    </Dark>
  ),
}

export const External: Story = {
  args: { variant: 'standalone', external: true, href: 'https://www.example.com', children: 'Broker website' },
  play: async ({ canvas }) => {
    // The new tab is announced, not a surprise.
    const link = canvas.getByRole('link', { name: 'Broker website (opens in a new tab)' })
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  },
}

// Every variant x state, in each body text size it's used in.
const VARIANTS: LinkVariant[] = ['inline', 'standalone', 'subtle', 'inverse']
const CONTEXTS = [
  { name: 'body-small', style: { fontSize: 'var(--typography-body-small-font-size)', lineHeight: 'var(--typography-body-small-line-height)' } },
  { name: 'body', style: { fontSize: 'var(--typography-body-font-size)', lineHeight: 'var(--typography-body-line-height)' } },
  { name: 'body-large', style: { fontSize: 'var(--typography-body-large-font-size)', lineHeight: 'var(--typography-body-large-line-height)' } },
]
const STATES: { name: string; force: ForcedState }[] = [
  { name: 'Default', force: 'default' },
  { name: 'Hover', force: 'hover' },
  { name: 'Focus', force: 'focus' },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-3)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">Variant and state</span></th>
          {CONTEXTS.map((c) => <th key={c.name} scope="col" style={{ textAlign: 'left' }}>{c.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {VARIANTS.flatMap((variant) =>
          STATES.map((state) => (
            <tr key={`${variant}-${state.name}`}>
              <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)', whiteSpace: 'nowrap' }}>
                {variant} · {state.name}
              </th>
              {CONTEXTS.map((c) => {
                const link = (
                  <span style={c.style}>
                    <ForceState state={state.force}>
                      <Link variant={variant} href="#listing">View listing</Link>
                    </ForceState>
                  </span>
                )
                return <td key={c.name}>{variant === 'inverse' ? <Dark>{link}</Dark> : link}</td>
              })}
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
}
