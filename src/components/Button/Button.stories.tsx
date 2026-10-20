import type { Meta, StoryObj } from '@storybook/react-vite'
import { Phone } from '../../icons'
import { expect, fn } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { Button, type ButtonSize, type ButtonVariant } from './Button'
import guidance from './Button.guidance.md?raw'

const meta = {
  title: 'Components/Button',
  component: Button,
  // A Docs page with the guidance text and a props table from Button's types.
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    children: 'Contact broker',
    variant: 'primary',
    size: 'md',
    // A stand-in handler: logs presses in the Actions panel and lets tests count them.
    onPress: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Play functions run as tests in CI (npm test). Each ends with blur(), so the
// story (and its Chromatic snapshot) shows the resting look, not a focus ring.

export const Primary: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Contact broker' })
    await userEvent.click(button)
    await expect(args.onPress).toHaveBeenCalledTimes(1)
    // Keyboard: Enter and Space press it too.
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onPress).toHaveBeenCalledTimes(3)
    button.blur()
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Save search' },
}

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Clear filters' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { startIcon: <Phone />, children: 'Call broker' },
  play: async ({ canvas }) => {
    // The icon is hidden from screen readers, so the name is just the label.
    await expect(canvas.getByRole('button', { name: 'Call broker' })).toBeVisible()
  },
}

export const AsLink: Story = {
  name: 'As a link (href)',
  args: { href: '#documents', variant: 'secondary', children: 'View documents' },
  play: async ({ canvas }) => {
    // Navigation renders a real link, announced as a link.
    const link = canvas.getByRole('link', { name: 'View documents' })
    await expect(link).toHaveAttribute('href', '#documents')
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Contact broker' })
    await userEvent.click(button)
    await expect(args.onPress).not.toHaveBeenCalled()
    await expect(button).toBeDisabled()
  },
}

export const Loading: Story = {
  args: { isLoading: true, children: 'Send inquiry', type: 'submit' },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Send inquiry' })
    // Keyboard users can still reach it, and presses are ignored.
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.click(button)
    await expect(args.onPress).not.toHaveBeenCalled()
    await expect(button).not.toBeDisabled()
    button.blur()
  },
}

// Every variant x size x state: the same grid phase 5 draws in Figma.
const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'tertiary']
const SIZES: ButtonSize[] = ['sm', 'md', 'lg']
const STATES: { name: string; force?: ForcedState; disabled?: boolean; loading?: boolean }[] = [
  { name: 'Default' },
  { name: 'Hover', force: 'hover' },
  { name: 'Pressed', force: 'pressed' },
  { name: 'Focus', force: 'focus' },
  { name: 'Disabled', disabled: true },
  { name: 'Loading', loading: true },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  parameters: { layout: 'padded' },
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-4) var(--space-3)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">Variant and state</span></th>
          {SIZES.map((size) => <th key={size} scope="col" style={{ textAlign: 'left' }}>{size}</th>)}
        </tr>
      </thead>
      <tbody>
        {VARIANTS.flatMap((variant) =>
          STATES.map((state) => (
            <tr key={`${variant}-${state.name}`}>
              <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)', whiteSpace: 'nowrap' }}>
                {variant} · {state.name}
              </th>
              {SIZES.map((size) => (
                <td key={size}>
                  <ForceState state={state.force ?? 'default'}>
                    <Button variant={variant} size={size} isDisabled={state.disabled} isLoading={state.loading}>
                      Contact broker
                    </Button>
                  </ForceState>
                </td>
              ))}
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
}
