import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { ChoiceCards } from './ChoiceCards'
import guidance from './ChoiceCards.guidance.md?raw'

// AcmeCo's language and region options (live site, 2026-10-10).
const LOCALES = [
  { value: 'en-US', label: 'English', description: 'United States' },
  { value: 'en-CA', label: 'English', description: 'Canada' },
  { value: 'en-GB', label: 'English', description: 'United Kingdom' },
  { value: 'es-ES', label: 'Español', description: 'España' },
  { value: 'fr-CA', label: 'Français', description: 'Canada' },
  { value: 'fr-FR', label: 'Français', description: 'France' },
]

const meta = {
  title: 'Components/ChoiceCards',
  component: ChoiceCards,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { label: 'Language and region', options: LOCALES, defaultValue: 'en-US' },
  decorators: [(Story) => <div style={{ maxWidth: '532px', padding: 'var(--space-2)' }}><Story /></div>],
} satisfies Meta<typeof ChoiceCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Language and region' })
    await expect(group).toBeInTheDocument()
    const us = canvas.getByRole('radio', { name: 'English United States' })
    await expect(us).toBeChecked()
    // Keyboard: arrow keys move the choice.
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'English Canada' })).toBeChecked()
    // The selected card has a 2px border, so the choice isn't shown by colour alone.
    const card = canvas.getByRole('radio', { name: 'English Canada' }).closest('label')!
    await expect(getComputedStyle(card).borderTopWidth).toBe('2px')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const Currency: Story = {
  name: 'Currency (with symbols)',
  args: {
    label: 'Currency',
    defaultValue: 'USD',
    options: [
      { value: 'USD', label: 'US Dollar', description: 'USD $' },
      { value: 'AUD', label: 'Australian Dollar', description: 'AUD $' },
      { value: 'CAD', label: 'Canadian Dollar', description: 'CAD $' },
      { value: 'EUR', label: 'Euro', description: 'EUR €' },
      { value: 'GBP', label: 'Pound Sterling', description: 'GBP £' },
    ],
  },
}

export const ShownLabel: Story = {
  name: 'With a visible label and a disabled option',
  args: { showLabel: true, options: [...LOCALES.slice(0, 5), { ...LOCALES[5], isDisabled: true }] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Français France' })).toBeDisabled()
  },
}

export const Phone: Story = {
  name: 'Phone (two columns)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[role=radiogroup] > div')!
    await expect(getComputedStyle(grid).gridTemplateColumns.split(' ')).toHaveLength(2)
  },
}
