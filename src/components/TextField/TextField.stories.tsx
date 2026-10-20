import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import type { FieldSize } from '../Field/Field'
import { TextField } from './TextField'
import guidance from './TextField.guidance.md?raw'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    shape: { control: 'inline-radio', options: ['default', 'pill'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: '360px' }}><Story /></div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // The label is the accessible name: the field is found by it.
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.type(input, 'pat@example.com')
    await expect(input).toHaveValue('pat@example.com')
    await expect(args.onChange).toHaveBeenLastCalledWith('pat@example.com')
    // Clicking the label focuses the field.
    input.blur()
    await userEvent.click(canvas.getByText('Email'))
    await expect(input).toHaveFocus()
    input.blur()
  },
}

export const WithHint: Story = {
  args: { hint: "We'll only use this to reply to you." },
  play: async ({ canvas }) => {
    // The hint is linked, so screen readers read it on focus.
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await expect(input).toHaveAccessibleDescription("We'll only use this to reply to you.")
  },
}

export const Required: Story = {
  args: { isRequired: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toBeRequired()
  },
}

export const Invalid: Story = {
  args: { defaultValue: 'pat@', errorMessage: 'Enter an email address like name@company.com' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await expect(input).toBeInvalid()
    // The message is linked to the field, not just shown near it.
    await expect(input).toHaveAccessibleDescription('Enter an email address like name@company.com')
  },
}

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: 'pat@example.com' },
}

export const ReadOnly: Story = {
  args: { label: 'Listing ID', type: 'text', isReadOnly: true, defaultValue: '31872561', autoComplete: undefined },
}

export const Message: Story = {
  name: 'Multiline with counter',
  args: { label: 'Message', type: 'text', multiline: true, maxLength: 500, autoComplete: undefined, hint: 'Ask about availability, pricing or a tour.' },
  play: async ({ canvas, userEvent }) => {
    const textbox = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(textbox, 'Is suite 400 available?')
    await expect(canvas.getByText('23 / 500')).toBeVisible()
    // The limit is in the description, announced once on focus.
    await expect(textbox).toHaveAccessibleDescription('Ask about availability, pricing or a tour. Up to 500 characters.')
    textbox.blur()
  },
}

export const Hero: Story = {
  name: 'Hero (lg, pill)',
  args: { label: 'City, ZIP or address', hideLabel: true, type: 'text', size: 'lg', shape: 'pill', placeholder: 'City, ZIP or address', autoComplete: undefined },
  decorators: [(Story) => <div style={{ maxWidth: '560px' }}><Story /></div>],
  play: async ({ canvas }) => {
    // Hidden visually, but still the accessible name.
    await expect(canvas.getByRole('textbox', { name: 'City, ZIP or address' })).toBeVisible()
  },
}

// Every state at both sizes.
const SIZES: FieldSize[] = ['md', 'lg']
const STATES: { name: string; force?: ForcedState; props?: Record<string, unknown> }[] = [
  { name: 'Default', props: { placeholder: 'name@company.com' } },
  { name: 'Hover', force: 'hover', props: { placeholder: 'name@company.com' } },
  { name: 'Focus', force: 'focus-within', props: { defaultValue: 'pat@example.com' } },
  { name: 'Filled', props: { defaultValue: 'pat@example.com' } },
  { name: 'Invalid', props: { defaultValue: 'pat@', errorMessage: 'Enter an email address like name@company.com' } },
  { name: 'Disabled', props: { defaultValue: 'pat@example.com', isDisabled: true } },
  { name: 'Read-only', props: { defaultValue: 'pat@example.com', isReadOnly: true } },
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
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)', verticalAlign: 'top', paddingTop: 'var(--space-6)' }}>{state.name}</th>
            {SIZES.map((size) => (
              <td key={size} style={{ width: '280px', verticalAlign: 'top' }}>
                <ForceState state={state.force ?? 'default'} target="[data-part='control']">
                  <TextField label={`Email (${state.name.toLowerCase()}, ${size})`} size={size} {...state.props} />
                </ForceState>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
