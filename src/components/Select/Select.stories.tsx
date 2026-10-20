import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { Select, type SelectOption } from './Select'
import guidance from './Select.guidance.md?raw'

const PROPERTY_TYPES: SelectOption[] = [
  { value: 'office', label: 'Office' },
  { value: 'retail', label: 'Retail' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'flex', label: 'Flex' },
  { value: 'land', label: 'Land' },
  { value: 'multifamily', label: 'Multifamily' },
]
const SORT: SelectOption[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'size', label: 'Size: largest first' },
]

// The list opens in a layer attached to the page body, outside the story, so
// tests look for it across the whole page.
const page = within(document.body)

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    label: 'Property type',
    options: PROPERTY_TYPES,
    placeholder: 'Select a property type',
    onChange: fn(),
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['field', 'compact'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: '320px', minHeight: '360px' }}><Story /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /Property type/ })
    await userEvent.click(trigger)
    const list = await page.findByRole('listbox')
    await userEvent.click(within(list).getByRole('option', { name: 'Retail' }))
    await expect(args.onChange).toHaveBeenLastCalledWith('retail')
    await expect(trigger).toHaveTextContent('Retail')
    // Keyboard: open with Enter, move with the arrow key, choose with Enter.
    await userEvent.keyboard('{Enter}')
    await page.findByRole('listbox')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(args.onChange).toHaveBeenLastCalledWith('industrial')
    // Focus returns to the trigger. React Aria does this a moment after the list
    // closes, so wait for it: checking instantly made this test fail 2 runs in 8.
    await waitFor(() => expect(trigger).toHaveFocus())
    trigger.blur()
  },
}

export const Open: Story = {
  name: 'Open (with a selection)',
  args: { defaultValue: 'retail', defaultOpen: true },
  play: async () => {
    // The selected option is marked for screen readers, not just with the check mark.
    const list = await page.findByRole('listbox')
    await expect(within(list).getByRole('option', { name: 'Retail' })).toHaveAttribute('aria-selected', 'true')
  },
}

export const Compact: Story = {
  name: 'Compact (sort)',
  args: { label: 'Sort', options: SORT, appearance: 'compact' },
  play: async ({ canvas, userEvent }) => {
    // Named "Sort" once (not "Sort, Sort"), and shows "Sort" as its text before a choice.
    const trigger = canvas.getByRole('button')
    await expect(trigger).toHaveAccessibleName('Sort')
    await expect(trigger).toHaveTextContent('Sort')
    // After a choice, React Aria announces the value, then the label (its order for every Select).
    await userEvent.click(trigger)
    await userEvent.click(within(await page.findByRole('listbox')).getByRole('option', { name: 'Newest' }))
    await expect(trigger).toHaveAccessibleName('Newest Sort')
    trigger.blur()
  },
}

export const WithHint: Story = {
  args: { hint: 'Choose the main use.' },
}

export const Invalid: Story = {
  args: { errorMessage: 'Choose a property type', isRequired: true },
}

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: 'office' },
}

export const DisabledOption: Story = {
  name: 'With a disabled option',
  args: {
    defaultOpen: true,
    options: [...PROPERTY_TYPES.slice(0, 3), { value: 'hotel', label: 'Hospitality (no listings)', isDisabled: true }],
  },
  play: async () => {
    const list = await page.findByRole('listbox')
    await expect(within(list).getByRole('option', { name: 'Hospitality (no listings)' })).toHaveAttribute('aria-disabled', 'true')
  },
}

// Every trigger state for field (md, lg) and compact.
const COLUMNS = [
  { name: 'field md', props: { appearance: 'field', size: 'md' } },
  { name: 'field lg', props: { appearance: 'field', size: 'lg' } },
  { name: 'compact', props: { appearance: 'compact' } },
] as const
const STATES: { name: string; force?: ForcedState; props?: Record<string, unknown> }[] = [
  { name: 'Placeholder' },
  { name: 'Hover', force: 'hover' },
  { name: 'Focus', force: 'focus' },
  { name: 'Filled', props: { defaultValue: 'office' } },
  { name: 'Invalid', props: { errorMessage: 'Choose a property type' } },
  { name: 'Disabled', props: { isDisabled: true } },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">State</span></th>
          {COLUMNS.map((c) => <th key={c.name} scope="col" style={{ textAlign: 'left' }}>{c.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {STATES.map((state) => (
          <tr key={state.name}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)', verticalAlign: 'top' }}>{state.name}</th>
            {COLUMNS.map((c) => (
              <td key={c.name} style={{ width: c.props.appearance === 'compact' ? 'auto' : '240px', verticalAlign: 'top' }}>
                <ForceState state={state.force ?? 'default'} target="button">
                  <Select
                    label={c.props.appearance === 'compact' ? 'Property type' : `Property type (${state.name.toLowerCase()}, ${c.name})`}
                    hideLabel={c.props.appearance === 'field'}
                    options={PROPERTY_TYPES}
                    placeholder="Select a property type"
                    {...c.props}
                    {...state.props}
                  />
                </ForceState>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
