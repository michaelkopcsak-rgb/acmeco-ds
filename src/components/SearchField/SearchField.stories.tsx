import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Navigation } from '../../icons'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import type { FieldSize } from '../Field/Field'
import { SearchField } from './SearchField'
import guidance from './SearchField.guidance.md?raw'

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    label: 'City, ZIP or address',
    placeholder: 'City, ZIP or address',
    onChange: fn(),
    onSubmit: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    shape: { control: 'inline-radio', options: ['default', 'pill'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: '480px' }}><Story /></div>],
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole('searchbox', { name: 'City, ZIP or address' })
    // No clear button while empty: hidden, so screen readers don't find it either.
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull()
    await userEvent.type(box, 'Chicago')
    await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeVisible()
    // Enter searches.
    await userEvent.keyboard('{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledWith('Chicago')
    // Escape clears.
    await userEvent.keyboard('{Escape}')
    await expect(box).toHaveValue('')
    box.blur()
  },
}

export const ClearButton: Story = {
  name: 'Clear button',
  args: { defaultValue: 'Chicago, IL' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(canvas.getByRole('searchbox')).toHaveValue('')
  },
}

export const Hero: Story = {
  name: 'Hero (lg, pill, submit)',
  args: { size: 'lg', shape: 'pill', showSubmit: true, hideLabel: true },
  decorators: [(Story) => <div style={{ maxWidth: '560px' }}><Story /></div>],
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole('searchbox', { name: 'City, ZIP or address' })
    await userEvent.type(box, 'Chicago, IL')
    // The submit button submits; it must not clear the field (SearchField gives
    // its buttons the clear behaviour unless it's switched off).
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Chicago, IL')
    await expect(box).toHaveValue('Chicago, IL')
    canvas.getByRole('button', { name: 'Search' }).blur()
  },
}

const SIZES: FieldSize[] = ['md', 'lg']
const STATES: { name: string; force?: ForcedState; props?: Record<string, unknown> }[] = [
  { name: 'Empty' },
  { name: 'Hover', force: 'hover' },
  { name: 'Focus', force: 'focus-within', props: { defaultValue: 'Chicago, IL' } },
  { name: 'Filled', props: { defaultValue: 'Chicago, IL' } },
  { name: 'Disabled', props: { isDisabled: true } },
  { name: 'Hero', props: { shape: 'pill', showSubmit: true, defaultValue: 'Chicago, IL' } },
  // The search results' field, proposed (decision 45): location arrow and the hero's dark blue Search button.
  { name: 'Results', props: { shape: 'pill', showSubmit: true, startIcon: <Navigation />, defaultValue: 'Chicago, IL' } },
  // AcmeCo's results field today (decision 42): location arrow, plain dark blue magnifier.
  { name: 'Results (AcmeCo today)', props: { shape: 'pill', showSubmit: true, submitAppearance: 'icon', startIcon: <Navigation />, defaultValue: 'Chicago, IL' } },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">State</span></th>
          {SIZES.map((size) => <th key={size} scope="col" style={{ textAlign: 'left' }}>{size}</th>)}
        </tr>
      </thead>
      <tbody>
        {STATES.map((state) => (
          <tr key={state.name}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)' }}>{state.name}</th>
            {SIZES.map((size) => (
              <td key={size} style={{ width: '320px' }}>
                <ForceState state={state.force ?? 'default'} target="[data-part='control']">
                  <SearchField label={`Location (${state.name.toLowerCase()}, ${size})`} hideLabel placeholder="City, ZIP or address" size={size} {...state.props} />
                </ForceState>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
