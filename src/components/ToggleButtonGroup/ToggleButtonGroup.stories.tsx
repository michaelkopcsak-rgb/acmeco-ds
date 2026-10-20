import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import { ForceState, type ForcedState } from '../../storybook/ForceState'
import { PanelLeft, PanelTop } from '../../icons'
import { ToggleButtonGroup } from './ToggleButtonGroup'
import guidance from './ToggleButtonGroup.guidance.md?raw'

const PLACEMENTS = [
  { id: 'start', label: 'Map on the left', icon: <PanelLeft /> },
  { id: 'top', label: 'Map on top', icon: <PanelTop /> },
]

const meta = {
  title: 'Components/ToggleButtonGroup',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { label: 'Map placement', options: PLACEMENTS, defaultValue: 'start' },
  // Room for the focus ring and the tooltip below the buttons.
  decorators: [(Story) => <div style={{ padding: 'var(--space-2)', minHeight: 'var(--space-8)' }}><Story /></div>],
} satisfies Meta<typeof ToggleButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup', { name: 'Map placement' })).toBeInTheDocument()
    const left = canvas.getByRole('radio', { name: 'Map on the left' })
    const top = canvas.getByRole('radio', { name: 'Map on top' })
    await expect(left).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(top)
    await waitFor(() => expect(top).toHaveAttribute('aria-checked', 'true'))
    await expect(left).toHaveAttribute('aria-checked', 'false')
    // One is always chosen: pressing it again keeps it.
    await userEvent.click(top)
    await expect(top).toHaveAttribute('aria-checked', 'true')
    // The chosen button is marked by a border, not colour alone.
    await expect(getComputedStyle(top).borderTopWidth).toBe('2px')
    // Keyboard: arrow keys move between the buttons, Space chooses.
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(left).toHaveFocus())
    await userEvent.keyboard(' ')
    await waitFor(() => expect(left).toHaveAttribute('aria-checked', 'true'))
    left.blur()
  },
}

export const Tooltip: Story = {
  name: 'Tooltip on keyboard focus',
  play: async () => {
    await userEvent.tab()
    // The tooltip opens in a portal, outside the story's canvas.
    await waitFor(() => expect(document.querySelector('[role=tooltip]')?.textContent).toBe('Map on the left'))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

// Each choice, at rest, with the pointer over the other button, and with focus, for review
// and for the Figma parity check.
const STATES: { name: string; force: ForcedState; target: string }[] = [
  { name: 'Default', force: 'default', target: '[role=radio]' },
  { name: 'Hover', force: 'hover', target: "[role=radio][aria-checked='false']" },
  { name: 'Focus', force: 'focus', target: "[role=radio][aria-checked='true']" },
]

export const StatesMatrix: Story = {
  name: 'States matrix',
  render: () => (
    <table style={{ borderCollapse: 'separate', borderSpacing: 'var(--space-5) var(--space-4)' }}>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">Chosen</span></th>
          {STATES.map((st) => <th key={st.name} scope="col" style={{ textAlign: 'left' }}>{st.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {PLACEMENTS.map((p) => (
          <tr key={p.id}>
            <th scope="row" style={{ textAlign: 'left', fontWeight: 'var(--font-weight-regular)' }}>{p.label}</th>
            {STATES.map((st) => (
              <td key={st.name}>
                <ForceState state={st.force} target={st.target}>
                  <ToggleButtonGroup label={`Map placement (${st.name.toLowerCase()})`} options={PLACEMENTS} defaultValue={p.id} />
                </ForceState>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
