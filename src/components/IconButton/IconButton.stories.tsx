import { useState, type ReactNode } from 'react'
import type { PressEvent } from 'react-aria-components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ChevronRight, Heart, Search, Share } from '../../icons'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { IconButton, type IconButtonSize, type IconButtonVariant } from './IconButton'
import guidance from './IconButton.guidance.md?raw'

// A dark, photo-like backdrop for the overlay variant (stories only).
function Photo({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, var(--color-gray-900), var(--color-navy-700) 60%, var(--color-gray-600))',
      }}
    >
      {children}
    </div>
  )
}

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    label: 'Share listing',
    icon: <Share />,
    variant: 'plain',
    size: 'md',
    onPress: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'overlay', 'primary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

// IconButton's props are a strict union (a toggle can't take onPress, a link can't
// be a toggle), so stories that render it themselves pass explicit props.
type SimpleArgs = { label?: string; icon?: ReactNode; size?: IconButtonSize; isDisabled?: boolean; onPress?: (e: PressEvent) => void }
const plainProps = (args: SimpleArgs) => ({
  label: args?.label ?? 'Share listing',
  icon: args?.icon,
  size: args?.size,
  isDisabled: args?.isDisabled,
  onPress: args?.onPress,
})

export const Plain: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // Found by its label: the accessible name screen readers announce.
    const button = canvas.getByRole('button', { name: 'Share listing' })
    await userEvent.click(button)
    await userEvent.keyboard('{Enter}')
    await expect(args.onPress).toHaveBeenCalledTimes(2)
    button.blur()
  },
}

export const Overlay: Story = {
  args: { variant: 'overlay', label: 'Next photo', icon: <ChevronRight /> },
  render: (args) => (
    <Photo>
      <IconButton {...plainProps(args as SimpleArgs)} variant="overlay" />
    </Photo>
  ),
}

export const Primary: Story = {
  args: { variant: 'primary', label: 'Search', icon: <Search /> },
}

export const PrimaryCircle: Story = {
  name: 'Primary, circle',
  args: { variant: 'primary', label: 'Search', icon: <Search /> },
  render: (args) => <IconButton {...plainProps(args as SimpleArgs)} variant="primary" shape="circle" />,
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
      <IconButton {...plainProps(args as SimpleArgs)} variant={args.variant} size="sm" />
      <IconButton {...plainProps(args as SimpleArgs)} variant={args.variant} size="md" />
      <IconButton {...plainProps(args as SimpleArgs)} variant={args.variant} size="lg" />
    </div>
  ),
}

// A toggle needs state, so it's rendered by a small wrapper.
function SaveToggle({ onChange, variant }: { onChange: (on: boolean) => void; variant: IconButtonVariant }) {
  const [saved, setSaved] = useState(false)
  return (
    <IconButton
      label="Save listing"
      icon={<Heart />}
      variant={variant}
      isSelected={saved}
      onChange={(on) => {
        setSaved(on)
        onChange(on)
      }}
    />
  )
}

// Logs changes in the Actions panel and lets the test check them.
const onSaveChange = fn()

export const SaveToggleStory: Story = {
  name: 'Toggle (save)',
  render: () => <SaveToggle onChange={onSaveChange} variant="plain" />,
  play: async ({ canvas, userEvent }) => {
    onSaveChange.mockClear()
    const toggle = canvas.getByRole('button', { name: 'Save listing' })
    // Announced as a toggle: not pressed, then pressed.
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(onSaveChange).toHaveBeenCalledWith(true)
    await userEvent.keyboard(' ')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    toggle.blur()
  },
}

export const AsLink: Story = {
  name: 'As a link (href)',
  args: { href: '#listing', label: 'Open listing', icon: <ChevronRight /> },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Open listing' })
    await expect(link).toHaveAttribute('href', '#listing')
  },
}

export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Share listing' })
    await userEvent.click(button)
    await expect(args.onPress).not.toHaveBeenCalled()
    await expect(button).toBeDisabled()
  },
}

// Every variant x size x state: the same grid phase 5 draws in Figma.
const VARIANTS: IconButtonVariant[] = ['plain', 'overlay', 'primary']
const SIZES: IconButtonSize[] = ['sm', 'md', 'lg']
const STATES: { name: string; force?: ForcedState; disabled?: boolean; selected?: boolean; variants?: IconButtonVariant[] }[] = [
  { name: 'Default' },
  { name: 'Hover', force: 'hover' },
  { name: 'Pressed', force: 'pressed' },
  { name: 'Focus', force: 'focus' },
  { name: 'Disabled', disabled: true },
  { name: 'Selected', selected: true, variants: ['plain', 'overlay'] },
]

function Cell({ variant, children }: { variant: IconButtonVariant; children: ReactNode }) {
  return variant === 'overlay' ? <Photo>{children}</Photo> : <>{children}</>
}

export const StatesMatrix: Story = {
  name: 'States matrix',
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
          STATES.filter((s) => !s.variants || s.variants.includes(variant)).map((state) => (
            <tr key={`${variant}-${state.name}`}>
              <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)', whiteSpace: 'nowrap' }}>
                {variant} · {state.name}
              </th>
              {SIZES.map((size) => (
                <td key={size}>
                  <Cell variant={variant}>
                    <ForceState state={state.force ?? 'default'}>
                      {state.selected ? (
                        <IconButton label="Save listing" icon={<Heart />} variant={variant} size={size} isSelected onChange={() => {}} />
                      ) : (
                        <IconButton label="Save listing" icon={<Heart />} variant={variant} size={size} isDisabled={state.disabled} />
                      )}
                    </ForceState>
                  </Cell>
                </td>
              ))}
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
}
