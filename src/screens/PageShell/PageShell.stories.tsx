import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouterProvider } from 'react-aria-components'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { PageShell } from './PageShell'

// Links hand their press to a router instead of loading a page (a real navigation would
// unload the test page).
const navigate = fn()

const meta = {
  title: 'Screens/Page shell',
  component: PageShell,
  parameters: { layout: 'fullscreen', docs: { description: { component: 'The page shell every screen starts from: header, main with the page\'s one h1, footer. The worked example in docs/BUILDING-SCREENS.md; its gaps are in docs/screens/page-shell-gaps.md. Prototype · AcmeCo is a fictional brand.' } } },
  decorators: [(Story) => <RouterProvider navigate={navigate}><Story /></RouterProvider>],
} satisfies Meta<typeof PageShell>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: { title: 'Page title' },
  play: async ({ canvas }) => {
    // The landmarks every screen has, and one h1.
    await expect(await canvas.findByRole('banner')).toBeInTheDocument()
    await expect(canvas.getByRole('main')).toBeInTheDocument()
    await expect(canvas.getByRole('contentinfo')).toBeInTheDocument()
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    // The prototype label (the footer's copyright line).
    await expect(canvas.getByText(/Prototype · AcmeCo is a fictional brand/)).toBeInTheDocument()
    // The skip link moves focus to main.
    const skip = canvas.getByRole('link', { name: 'Skip to main content' })
    skip.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByRole('main')).toHaveFocus())
    canvas.getByRole('main').blur()
  },
}

export const Phone: Story = {
  args: { title: 'Page title' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { chromatic: { modes: { 'light phone': { theme: 'light', viewport: 'mobile1' } } } },
  play: async ({ canvas }) => {
    const header = within(await canvas.findByRole('banner'))
    // On phones the search links move into the menu, and the page still has its one h1.
    await expect(header.queryByRole('navigation', { name: 'Search' })).toBeNull()
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  },
}
