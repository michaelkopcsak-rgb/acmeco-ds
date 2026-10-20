import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Heading } from '../Heading/Heading'
import { Grid, Main, PageContainer, Section, SplitView, Stack, StickyTop, type LayoutGap } from './Layout'
import guidance from './Layout.guidance.md?raw'

// A placeholder block (stories only), so the layout is visible.
function Box({ children, height = 48 }: { children?: ReactNode; height?: number }) {
  return (
    <div
      style={{
        minHeight: `${height}px`,
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-surface-subtle)',
        border: 'var(--border-width-default) solid var(--color-border-default)',
        fontFamily: 'var(--font-family-brand)',
        fontSize: 'var(--typography-body-small-font-size)',
        lineHeight: 'var(--typography-body-small-line-height)',
        color: 'var(--color-text-default)',
      }}
    >
      {children}
    </div>
  )
}
const px = (el: Element, prop: 'rowGap' | 'columnGap') => getComputedStyle(el)[prop]

const meta = {
  title: 'Components/Layout',
  component: Stack,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const StackStory: Story = {
  name: 'Stack',
  args: { children: null },
  render: () => (
    <Stack gap="xl">
      <Stack gap="md" as="ul">
        <li><Box>Vertical, gap md (16px)</Box></li>
        <li><Box>Second</Box></li>
        <li><Box>Third</Box></li>
      </Stack>
      <Stack direction="horizontal" gap="xs" align="center" wrap>
        <Box>Horizontal</Box>
        <Box>gap xs (8px)</Box>
        <Box>wraps when narrow</Box>
      </Stack>
      <Stack direction="horizontal" justify="between" align="center">
        <Box>justify between</Box>
        <Box>pushed to the end</Box>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ul')!
    await expect(px(list, 'rowGap')).toBe('16px')
    // A list stays a list: no bullets or indent from the browser, still announced as a list.
    await expect(getComputedStyle(list).listStyleType).toBe('none')
  },
}

const GAPS: LayoutGap[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
const SIZES = [4, 8, 12, 16, 24, 32, 48, 64]
export const Gaps: Story = {
  name: 'Gap steps',
  args: { children: null },
  render: () => (
    <Stack gap="md">
      {GAPS.map((g) => (
        <Stack key={g} direction="horizontal" gap={g} align="center">
          <Box>{g}</Box>
          <Box>{SIZES[GAPS.indexOf(g)]}px</Box>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const rows = [...canvasElement.querySelectorAll('[data-direction="horizontal"]')]
    for (const [i, row] of rows.entries()) await expect(px(row, 'columnGap')).toBe(`${SIZES[i]}px`)
  },
}

export const GridColumns: Story = {
  name: 'Grid: columns per breakpoint',
  args: { children: null },
  render: () => (
    <Grid columns={{ base: 1, md: 2, xl: 3 }} gap="lg" as="ul">
      {Array.from({ length: 6 }, (_, i) => <li key={i}><Box height={96}>Card {i + 1}</Box></li>)}
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('ul')!
    const w = window.innerWidth
    const expected = w >= 1280 ? 3 : w >= 768 ? 2 : 1
    await expect(getComputedStyle(grid).gridTemplateColumns.split(' ').length).toBe(expected)
    await expect(px(grid, 'columnGap')).toBe('24px')
  },
}

export const MainAside: Story = {
  name: 'Grid: main and aside',
  args: { children: null },
  render: () => (
    <Grid template="main-aside" gap="xl">
      <Box height={240}>Main content (photos, facts, description)</Box>
      <Box height={160}>Aside, 340px (the contact module)</Box>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-template="main-aside"]')!
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ')
    if (window.innerWidth >= 1024) await expect(cols.at(-1)).toBe('340px')
    else await expect(cols.length).toBe(1)
  },
}

export const Page: Story = {
  name: 'A page, put together',
  args: { children: null },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Main>
      <PageContainer>
        <Stack gap="section">
          <Section labelledBy="results-heading">
            <Heading level={1} id="results-heading">Office space for lease (placeholder)</Heading>
            <Grid columns={{ base: 1, md: 2 }} gap="lg">
              <Box height={120}>Card</Box>
              <Box height={120}>Card</Box>
            </Grid>
          </Section>
          <Section labelledBy="more-heading">
            <Heading level={2} id="more-heading">Nearby (placeholder)</Heading>
            <Box height={80}>Block</Box>
          </Section>
        </Stack>
      </PageContainer>
    </Main>
  ),
  play: async ({ canvas, canvasElement }) => {
    // Sections are regions named by their headings, inside the page's main landmark.
    await expect(canvas.getByRole('main')).toBeInTheDocument()
    await expect(canvas.getByRole('region', { name: 'Office space for lease (placeholder)' })).toBeInTheDocument()
    // Main: the skip link's target, 32px above and below the content; the container inside sets the width.
    const main = canvasElement.querySelector('main')!
    await expect(main.id).toBe('main')
    await expect(main.tabIndex).toBe(-1)
    await expect(getComputedStyle(main).paddingTop).toBe('32px')
    const container = main.firstElementChild!
    await expect(getComputedStyle(container).maxWidth).toBe('1440px')
    await expect(getComputedStyle(container).paddingLeft).toBe('16px')
  },
}

export const SplitViewStory: Story = {
  name: 'StickyTop and SplitView (a search page)',
  args: { children: null },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <>
      <StickyTop>
        <PageContainer paddingBlock="xs">
          <Box>Header and filter bar (stay at the top)</Box>
        </PageContainer>
      </StickyTop>
      <Main paddingBlock="none">
        <SplitView aside={<Box height={240}>Aside (the map): fills the window below the bar and stays put</Box>}>
          <Stack gap="lg">
            {Array.from({ length: 6 }, (_, i) => <Box key={i} height={200}>Result {i + 1} (scrolls)</Box>)}
          </Stack>
        </SplitView>
      </Main>
    </>
  ),
  play: async ({ canvasElement }) => {
    // StickyTop shares its height, which the aside uses to fill the window below it.
    await new Promise((r) => setTimeout(r, 50))
    const top = getComputedStyle(document.documentElement).getPropertyValue('--layout-sticky-top')
    await expect(parseFloat(top)).toBeGreaterThan(0)
    await expect(getComputedStyle(canvasElement.querySelector('[class*="_stickyTop_"]')!).position).toBe('sticky')
  },
}

