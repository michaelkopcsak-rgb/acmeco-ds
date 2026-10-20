import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { SlidersHorizontal } from '../../icons'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox'
import { Stack } from '../Layout/Layout'
import { FilterButton, FilterMenu } from './FilterButton'
import guidance from './FilterButton.guidance.md?raw'

const page = within(document.body)

const meta = {
  title: 'Components/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { children: 'Rent' },
  decorators: [(Story) => <div style={{ padding: 'var(--space-2)', minHeight: '320px' }}><Story /></div>],
} satisfies Meta<typeof FilterButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// A search bar's pills: one not set, one set (clears in place), All Filters with its count.
function Bar() {
  const [types, setTypes] = useState<string[]>(['Office', 'Coworking'])
  return (
    <Stack direction="horizontal" gap="xs" align="center" wrap>
      <FilterMenu label="Space Use" value={types.length === 0 ? undefined : types.length === 1 ? types[0] : 'Multiple'} onClear={() => setTypes([])}>
        <CheckboxGroup label="Space use" value={types} onChange={setTypes}>
          {['Office', 'Coworking', 'Retail', 'Industrial'].map((t) => <Checkbox key={t} value={t}>{t}</Checkbox>)}
        </CheckboxGroup>
      </FilterMenu>
      <FilterMenu label="Size">
        <CheckboxGroup label="Size" value={[]}>
          <Checkbox value="small">Under 5,000 SF</Checkbox>
        </CheckboxGroup>
      </FilterMenu>
      <FilterButton icon={<SlidersHorizontal />} count={types.length ? 1 : 0} hasMenu={false}>All Filters</FilterButton>
    </Stack>
  )
}

export const SearchBar: Story = {
  name: 'In a search bar (set, not set, All Filters)',
  render: () => <Bar />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /^All Filters\W+1 applied$/ })).toBeInTheDocument()
    // The set pill opens its panel of choices.
    await userEvent.click(canvas.getByRole('button', { name: 'Multiple' }))
    const panel = within(await page.findByRole('dialog', { name: 'Space Use' }))
    await expect(panel.getByRole('checkbox', { name: 'Office' })).toBeChecked()
    await userEvent.keyboard('{Escape}')
    // The pill's x clears it: back to its name, and All Filters' count goes.
    await userEvent.click(canvas.getByRole('button', { name: 'Clear Space Use' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Space Use' })).toBeInTheDocument())
    await expect(canvas.getByRole('button', { name: 'All Filters' })).toBeInTheDocument()
    canvas.getByRole('button', { name: 'Space Use' }).blur()
  },
}

// Every kind of pill in every state, for review and for the Figma parity check.
const KINDS = ['Menu', 'Set', 'All filters', 'Icon only'] as const
const FORCED: { name: string; force: ForcedState }[] = [
  { name: 'Default', force: 'default' },
  { name: 'Hover', force: 'hover' },
  { name: 'Focus', force: 'focus' },
]
const pill = (kind: (typeof KINDS)[number]) => {
  if (kind === 'Menu') return <FilterButton>Rent</FilterButton>
  if (kind === 'Set') return <FilterMenu label="Space Use" value="Multiple" onClear={() => {}}>{null}</FilterMenu>
  if (kind === 'All filters') return <FilterButton icon={<SlidersHorizontal />} count={1} hasMenu={false}>All Filters</FilterButton>
  return <FilterButton icon={<SlidersHorizontal />} count={1} hasMenu={false} iconOnly>All Filters</FilterButton>
}

export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">Kind</span></th>
          {FORCED.map((f) => <th key={f.name} scope="col" style={{ textAlign: 'left' }}>{f.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {KINDS.map((kind) => (
          <tr key={kind}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)' }}>{kind}</th>
            {FORCED.map((f) => (
              <td key={f.name}>
                <ForceState state={f.force} target="button">{pill(kind)}</ForceState>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
