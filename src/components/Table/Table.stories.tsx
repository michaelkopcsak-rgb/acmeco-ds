import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { listings } from '../../data/fixtures'
import { spaceCells, spaceColumns } from '../../data/facts'
import { Button } from '../Button/Button'
import { Table, type TableRow } from './Table'
import guidance from './Table.guidance.md?raw'

const listing = listings.reduce((a, b) => (b.spaces.length > a.spaces.length ? b : a))
const onRowAction = fn()
const ROWS: TableRow[] = listing.spaces.map((s) => ({
  id: s.name,
  textValue: s.name,
  cells: { ...spaceCells(s), details: <Button variant="tertiary" size="sm" onPress={() => onRowAction(s.name)}>Details<span className="sr-only"> for {s.name}</span></Button> },
}))
const COLUMNS = spaceColumns

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { columns: COLUMNS, rows: ROWS, label: 'All Available Spaces', onRowAction },
  decorators: [(Story) => <div style={{ padding: 'var(--space-2)', maxWidth: '960px' }}><Story /></div>],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Spaces (rows open their details)',
  play: async ({ canvas }) => {
    // React Aria renders the rows a moment after the table, so wait for them (findBy).
    const table = await canvas.findByRole('grid', { name: 'All Available Spaces' })
    await expect(table).toBeInTheDocument()
    await expect(await canvas.findAllByRole('columnheader')).toHaveLength(COLUMNS.length)
    await expect(await canvas.findAllByRole('rowheader')).toHaveLength(ROWS.length)
  },
}

export const OpenRow: Story = {
  name: 'Opening a row (click and keyboard)',
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    onRowAction.mockClear()
    const first = (await canvas.findAllByRole('rowheader'))[0]
    await userEvent.click(first)
    await expect(onRowAction).toHaveBeenCalledWith(ROWS[0].id)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(onRowAction).toHaveBeenLastCalledWith(ROWS[1].id)
    const details = (await canvas.findAllByRole('button', { name: /^Details for / }))[0]
    await userEvent.click(details)
    await expect(onRowAction).toHaveBeenLastCalledWith(ROWS[0].id)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

// The table at a fixed width, for review and the Figma parity check.
export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <tbody>
        <tr>
          <th scope="row" style={{ textAlign: 'left', verticalAlign: 'top', fontWeight: 'var(--font-weight-regular)' }}>Default</th>
          <td style={{ width: '880px', minWidth: '880px' }}><Table columns={COLUMNS} rows={ROWS.slice(0, 3)} label="All Available Spaces (matrix)" onRowAction={onRowAction} /></td>
        </tr>
      </tbody>
    </table>
  ),
}
