import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Tabs } from './Tabs'
import guidance from './Tabs.guidance.md?raw'

const p = (text: string) => <p style={{ margin: 0, fontFamily: 'var(--font-family-brand)', color: 'var(--color-text-default)' }}>{text}</p>

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: {
    label: 'Language and currency',
    items: [
      { id: 'language', label: 'Language and Region', content: p('Language and region options (placeholder panel).') },
      { id: 'currency', label: 'Currency', content: p('Currency options (placeholder panel).') },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: '532px', padding: 'var(--space-2)' }}><Story /></div>],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    // React Aria renders the tabs a moment after the list (it builds the collection first), so wait for them.
    const list = await canvas.findByRole('tablist', { name: 'Language and currency' })
    const [first, second] = await within(list).findAllByRole('tab')
    // React Aria also selects the first tab a moment after rendering it: wait for that too.
    await waitFor(() => expect(first).toHaveAttribute('aria-selected', 'true'))
    await expect(await canvas.findByRole('tabpanel', { name: 'Language and Region' })).toBeInTheDocument()
    // Selected: the dark blue underline, not just a colour change.
    await waitFor(() => expect(getComputedStyle(first).borderBottomColor).toBe('rgb(18, 58, 122)'))
    // Keyboard: one tab stop; the arrow key moves to and selects the next tab.
    await userEvent.tab()
    await waitFor(() => expect(first).toHaveFocus())
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(second).toHaveAttribute('aria-selected', 'true'))
    await expect(await canvas.findByRole('tabpanel', { name: 'Currency' })).toBeInTheDocument()
    second.blur()
  },
}

export const SecondSelected: Story = {
  name: 'Second tab selected',
  args: { defaultSelectedId: 'currency' },
  play: async ({ canvas }) => {
    const currency = await canvas.findByRole('tab', { name: 'Currency' })
    await waitFor(() => expect(currency).toHaveAttribute('aria-selected', 'true'))
  },
}
