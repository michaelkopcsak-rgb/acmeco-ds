import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { ChipGroup, type ChipItem } from './Chip'
import guidance from './Chip.guidance.md?raw'

const STATES_SELECTED: ChipItem[] = [
  { id: 'co', label: 'Colorado' },
  { id: 'tx', label: 'Texas' },
  { id: 'il', label: 'Illinois' },
]

const meta = {
  title: 'Components/Chip',
  component: ChipGroup,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  args: { label: 'Selected states', items: STATES_SELECTED, onRemove: fn() },
} satisfies Meta<typeof ChipGroup>

export default meta
type Story = StoryObj<typeof meta>

// Removing needs state, so this wrapper keeps the list.
function Removable({ onRemove }: { onRemove: (ids: string[]) => void }) {
  const [items, setItems] = useState(STATES_SELECTED)
  return (
    <ChipGroup
      label="Selected states"
      items={items}
      onRemove={(ids) => {
        setItems((current) => current.filter((i) => !ids.includes(i.id)))
        onRemove(ids)
      }}
    />
  )
}

const onRemove = fn()

export const Default: Story = {
  name: 'Removable',
  render: () => <Removable onRemove={onRemove} />,
  play: async ({ canvas, userEvent }) => {
    onRemove.mockClear()
    // A list named by its label.
    await expect(canvas.getByRole('grid', { name: 'Selected states' })).toBeVisible()
    // Each x is a labelled button, named once ("Remove Colorado", not "Remove Colorado Colorado").
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Colorado' }))
    await expect(onRemove).toHaveBeenLastCalledWith(['co'])
    await expect(canvas.queryByText('Colorado')).toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

const onKeyboardRemove = fn()

export const KeyboardRemove: Story = {
  name: 'Removing with the keyboard',
  render: () => <Removable onRemove={onKeyboardRemove} />,
  play: async ({ canvas, userEvent }) => {
    onKeyboardRemove.mockClear()
    // Tab reaches the first chip; arrow keys move between chips; Delete removes.
    await userEvent.tab()
    await expect(canvas.getByText('Colorado').closest('[role=row]')).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{Delete}')
    await expect(onKeyboardRemove).toHaveBeenLastCalledWith(['tx'])
    await expect(canvas.queryByText('Texas')).toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const NotRemovable: Story = {
  name: 'Not removable',
  args: { onRemove: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const WithLabel: Story = {
  name: 'With a visible label',
  args: { showLabel: true },
}

// Chip states, and the remove button's hover.
const STATES: { name: string; force?: ForcedState; target?: string }[] = [
  { name: 'Default' },
  { name: 'Focus (chip)', force: 'focus', target: '[role=row]' },
  { name: 'Hover (remove)', force: 'hover', target: 'button' },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 'var(--space-4) var(--space-5)', alignItems: 'center' }}>
      {STATES.map((s) => (
        <div key={s.name} style={{ display: 'contents' }}>
          <span>{s.name}</span>
          <ForceState state={s.force ?? 'default'} target={s.target}>
            <ChipGroup label={`Selected states (${s.name.toLowerCase()})`} items={STATES_SELECTED.slice(0, 1)} onRemove={() => {}} />
          </ForceState>
        </div>
      ))}
    </div>
  ),
}
