import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { TabSelector, type TabSelectorOption } from './TabSelector'
import guidance from './TabSelector.guidance.md?raw'

// AcmeCo's order, as in the expanded filters panel.
const LISTING_TYPES: TabSelectorOption[] = [
  { value: 'sale', label: 'For Sale' },
  { value: 'lease', label: 'For Lease' },
  { value: 'auction', label: 'Auctions' },
]

// A sample panel below the tabs (stories only): the selected tab opens into it.
function WithPanel({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: '640px' }}>
      {children}
      <div style={{ padding: 'var(--space-5) var(--space-4)', color: 'var(--color-text-subtle)' }}>Filters for the chosen listing type appear here.</div>
    </div>
  )
}

const meta = {
  title: 'Components/TabSelector',
  component: TabSelector,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    label: 'Listing type',
    options: LISTING_TYPES,
    defaultValue: 'sale',
    onChange: fn(),
  },
  // Rendered above a sample panel. (A shared decorator would also wrap the
  // States matrix: in Storybook, a story's decorators add to the shared ones.)
  render: (args) => (
    <WithPanel>
      <TabSelector {...args} />
    </WithPanel>
  ),
} satisfies Meta<typeof TabSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // A radio group named by its hidden label.
    await expect(canvas.getByRole('radiogroup', { name: 'Listing type' })).toBeVisible()
    const sale = canvas.getByRole('radio', { name: 'For Sale' })
    await expect(sale).toBeChecked()
    // One tab stop; arrow keys move the selection.
    await userEvent.tab()
    await expect(sale).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'For Lease' })).toBeChecked()
    await expect(args.onChange).toHaveBeenLastCalledWith('lease')
    // Clicking a tab works too.
    await userEvent.click(canvas.getByText('Auctions'))
    await expect(args.onChange).toHaveBeenLastCalledWith('auction')
    canvas.getByRole('radio', { name: 'Auctions' }).blur()
  },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
}

export const WithLabel: Story = {
  name: 'With a visible label',
  args: { showLabel: true },
}

export const DisabledOption: Story = {
  name: 'With a disabled option',
  args: { options: [...LISTING_TYPES.slice(0, 2), { value: 'auction', label: 'Auctions', isDisabled: true }] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Auctions' })).toBeDisabled()
  },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

// States of an unselected tab ("For Lease"), beside the selected "For Sale".
const STATES: { name: string; force?: ForcedState; props?: Record<string, unknown> }[] = [
  { name: 'Default' },
  { name: 'Hover', force: 'hover' },
  { name: 'Focus', force: 'focus' },
  { name: 'Disabled', props: { isDisabled: true } },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      {STATES.map((state) => (
        <div key={state.name} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'start', gap: 'var(--space-4)' }}>
          <span style={{ paddingTop: 'var(--space-3)' }}>{state.name} (For Lease)</span>
          <WithPanel>
            <ForceState state={state.force ?? 'default'} target="label:nth-of-type(2)">
              <TabSelector label={`Listing type (${state.name.toLowerCase()})`} options={LISTING_TYPES} defaultValue="sale" {...state.props} />
            </ForceState>
          </WithPanel>
        </div>
      ))}
    </div>
  ),
}
