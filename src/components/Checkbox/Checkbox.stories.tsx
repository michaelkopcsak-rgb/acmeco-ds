import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { Checkbox, CheckboxGroup } from './Checkbox'
import guidance from './Checkbox.guidance.md?raw'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: {
    children: 'Email me new listings like this',
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: 'Email me new listings like this' })
    await expect(box).not.toBeChecked()
    // Clicking the label toggles it.
    await userEvent.click(canvas.getByText('Email me new listings like this'))
    await expect(box).toBeChecked()
    await expect(args.onChange).toHaveBeenLastCalledWith(true)
    // Space toggles it from the keyboard.
    await userEvent.keyboard(' ')
    await expect(box).not.toBeChecked()
    box.blur()
  },
}

export const Checked: Story = {
  args: { defaultSelected: true },
}

export const Indeterminate: Story = {
  args: { children: 'Select all space uses', isIndeterminate: true },
  play: async ({ canvas }) => {
    // Announced as "mixed".
    await expect(canvas.getByRole('checkbox')).toBePartiallyChecked()
  },
}

export const WithDescription: Story = {
  args: { children: 'Show listings without a price', description: 'Some brokers share pricing only on request.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Show listings without a price' })).toHaveAccessibleDescription('Some brokers share pricing only on request.')
  },
}

export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true },
}

const onGroupChange = fn()

export const Group: Story = {
  render: () => (
    <CheckboxGroup label="Space use" hint="Choose any that apply." defaultValue={['office']} onChange={onGroupChange}>
      <Checkbox value="office">Office</Checkbox>
      <Checkbox value="retail">Retail</Checkbox>
      <Checkbox value="industrial">Industrial</Checkbox>
      <Checkbox value="flex">Flex</Checkbox>
    </CheckboxGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    onGroupChange.mockClear()
    // The group is named by its label.
    await expect(canvas.getByRole('group', { name: 'Space use' })).toBeVisible()
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Retail' }))
    await expect(onGroupChange).toHaveBeenLastCalledWith(['office', 'retail'])
    canvas.getByRole('checkbox', { name: 'Retail' }).blur()
  },
}

export const GroupInvalid: Story = {
  name: 'Group, invalid',
  render: () => (
    <CheckboxGroup label="Space use" errorMessage="Choose at least one space use" isRequired>
      <Checkbox value="office">Office</Checkbox>
      <Checkbox value="retail">Retail</Checkbox>
      <Checkbox value="industrial">Industrial</Checkbox>
    </CheckboxGroup>
  ),
  play: async ({ canvas }) => {
    // The message is linked to the group, not just shown near it.
    await expect(canvas.getByRole('group', { name: 'Space use' })).toHaveAccessibleDescription('Choose at least one space use')
  },
}

// A "select all" that reflects its group: none, some (indeterminate) or all.
function SelectAll() {
  const all = ['office', 'retail', 'industrial']
  const [value, setValue] = useState<string[]>(['office'])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <Checkbox
        isSelected={value.length === all.length}
        isIndeterminate={value.length > 0 && value.length < all.length}
        onChange={(on) => setValue(on ? all : [])}
      >
        Select all space uses
      </Checkbox>
      <CheckboxGroup label="Space use" value={value} onChange={setValue}>
        <Checkbox value="office">Office</Checkbox>
        <Checkbox value="retail">Retail</Checkbox>
        <Checkbox value="industrial">Industrial</Checkbox>
      </CheckboxGroup>
    </div>
  )
}

export const SelectAllStory: Story = {
  name: 'Select all (indeterminate)',
  render: () => <SelectAll />,
  play: async ({ canvas, userEvent }) => {
    const all = canvas.getByRole('checkbox', { name: 'Select all space uses' })
    await expect(all).toBePartiallyChecked()
    await userEvent.click(all)
    await expect(canvas.getByRole('checkbox', { name: 'Industrial' })).toBeChecked()
    await expect(all).toBeChecked()
    all.blur()
  },
}

// Every state for unchecked, checked and indeterminate.
const VALUES = [
  { name: 'Unchecked', props: {} },
  { name: 'Checked', props: { defaultSelected: true } },
  { name: 'Indeterminate', props: { isIndeterminate: true } },
]
const STATES: { name: string; force?: ForcedState; props?: Record<string, unknown> }[] = [
  { name: 'Default' },
  { name: 'Hover', force: 'hover' },
  { name: 'Pressed', force: 'pressed' },
  { name: 'Focus', force: 'focus' },
  { name: 'Invalid', props: { isInvalid: true } },
  { name: 'Disabled', props: { isDisabled: true } },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-3)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">State</span></th>
          {VALUES.map((v) => <th key={v.name} scope="col" style={{ textAlign: 'left' }}>{v.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {STATES.map((state) => (
          <tr key={state.name}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)' }}>{state.name}</th>
            {VALUES.map((v) => (
              <td key={v.name}>
                <ForceState state={state.force ?? 'default'} target="label">
                  <Checkbox {...v.props} {...state.props}>Office</Checkbox>
                </ForceState>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
