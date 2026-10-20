import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import styles from './Layout.module.css'
import { dsFrame } from '../ds'

// The layout primitives (decision 34): the only way a screen sets width, gaps and columns.
// Each takes named steps of the spacing scale (tokens/components/layout.json), never numbers,
// so screens stay on the 4px grid and on AcmeCo's own layout values without writing CSS.

/** Named gaps: 4px steps from 2xs (4px) to 3xl (64px), and AcmeCo's fluid block and section gaps. */
export type LayoutGap = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'block' | 'section'
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type Justify = 'start' | 'center' | 'end' | 'between'

const gapVar = (gap: LayoutGap) => `var(--layout-gap-${gap})`

export interface PageContainerProps {
  children: ReactNode
  /** The element to render: main for the page's main content, header or footer for the shell. */
  as?: ElementType
  /** Space above and below the content (none by default): a band such as a search page's filter bar. */
  paddingBlock?: LayoutGap
  /** page: AcmeCo's maximum width, 1440px (the default). gallery: the gallery results' narrower 1,032px, two cards side by side. */
  width?: 'page' | 'gallery'
}

/** Centres the page's content at AcmeCo's maximum width (1440px, or the gallery's 1,032px) with the side gutter (16px). */
export function PageContainer({ children, as: Tag = 'div', paddingBlock = 'none', width = 'page' }: PageContainerProps) {
  const style = { '--container-padding-block': gapVar(paddingBlock) } as CSSProperties
  return <Tag className={styles.container} style={style} data-width={width}>{children}</Tag>
}

export interface BandProps {
  /** What the band holds: usually a PageContainer, so its content keeps the page's width. */
  children: ReactNode
  /** default: white. subtle: AcmeCo's light grey (a results bar). */
  tone?: 'default' | 'subtle'
  /** A thin line under the band (the gallery's title band and filter bar). */
  divider?: boolean
}

/** A strip across the whole window, white or light grey, optionally with a line under it: the gallery's title band, filter bar and results bar. */
export function Band({ children, tone = 'default', divider = false }: BandProps) {
  return <div className={styles.band} data-tone={tone} data-divider={divider || undefined} {...dsFrame(`Component/layout/band/color-${tone}`, divider)}>{children}</div>
}

export interface MainProps {
  children: ReactNode
  /** The id GlobalHeader's skip link points to (its mainId). */
  id?: string
  /** Space above and below the page's content, between the header and the footer (default xl, 32px). */
  paddingBlock?: LayoutGap
}

/**
 * The page's main landmark: the target of GlobalHeader's skip link (it takes focus, with no
 * ring, since it isn't a control) and the space between the header, the content and the
 * footer. Put a PageContainer inside it for the width.
 */
export function Main({ children, id = 'main', paddingBlock = 'xl' }: MainProps) {
  const style = { '--main-padding': gapVar(paddingBlock) } as CSSProperties
  return <main id={id} tabIndex={-1} className={styles.main} style={style}>{children}</main>
}

export interface StickyTopProps {
  /** What stays at the top: GlobalHeader and, on a search page, its filter bar. */
  children: ReactNode
  /** Also fixed on phones (a listing's header and title bar, as AcmeCo's). By default it scrolls away below 768px, so a list has the screen. */
  fixedOnPhones?: boolean
}

/**
 * Keeps the header (and a search page's filter bar) at the top of the window while the page
 * scrolls, as on AcmeCo's results. It shares its height (--layout-sticky-top) so a
 * SplitView's aside fills the rest of the window below it.
 */
export function StickyTop({ children, fixedOnPhones }: StickyTopProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const set = () => root.style.setProperty('--layout-sticky-top', `${el.offsetHeight}px`)
    set()
    const observer = new ResizeObserver(set)
    observer.observe(el)
    return () => { observer.disconnect(); root.style.removeProperty('--layout-sticky-top') }
  }, [])
  return <div ref={ref} className={styles.stickyTop} data-fixed-on-phones={fixedOnPhones || undefined}>{children}</div>
}

export interface SplitViewProps {
  /** The main column: a list that scrolls with the page (search results). */
  children: ReactNode
  /** Beside it, on the left: something that stays put (MapPlaceholder). Below 1024px it's a band above the list. */
  aside: ReactNode
  /** Below 768px: show the aside as a band (the default) or hide it (a phone shows the map only when asked). */
  compactAside?: 'band' | 'hidden'
  /**
   * From 1024px: start puts the aside on the left, filling the window and staying put
   * (AcmeCo's map view, the default); top puts it in a band above a full-width list, the
   * band staying in view while the cards scroll beneath it (a proposal, decision 45). Below 1024px the aside is always on top.
   */
  placement?: 'start' | 'top'
}

/**
 * AcmeCo's results layout: the aside (the map) on the left, filling the window below the
 * StickyTop and staying put, and the list column (670px, light grey behind white cards) on
 * the right scrolling with the page; or, with placement="top", the aside in a band above a
 * full-width list. Full width: put it straight in Main, not in a PageContainer.
 */
export function SplitView({ children, aside, compactAside = 'band', placement = 'start' }: SplitViewProps) {
  return (
    <div className={styles.split} data-compact-aside={compactAside} data-placement={placement}>
      <div className={styles.splitAside}>{aside}</div>
      <div className={styles.splitMain} {...dsFrame('Component/layout/split/main-background')}>{children}</div>
    </div>
  )
}

export interface StickyProps {
  /** What stays in view (a listing's contact box beside its details). */
  children: ReactNode
  /** Space between it and the StickyTop above it (default md, 16px). */
  offset?: LayoutGap
}

/**
 * Keeps its content in view below the StickyTop while the column beside it scrolls, from
 * 1024px (a listing's contact box). Below 1024px, where columns stack, it scrolls normally.
 */
export function Sticky({ children, offset = 'md' }: StickyProps) {
  const style = { '--sticky-offset': gapVar(offset) } as CSSProperties
  return <div className={styles.sticky} style={style}>{children}</div>
}

export interface DockProps {
  /** What floats over the page: the AI assistant (corner), or a phone's Call and Message (bar). */
  children: ReactNode
  /** corner: the bottom-right corner (the default). bar: a white bar across the bottom of the window, on phones only (below 768px), with room kept for it at the page's end. */
  placement?: 'corner' | 'bar'
  /** corner only: on phones, sit above a bottom bar instead of over it. */
  clearBar?: boolean
}

/** Fixes its content to the window: the bottom-right corner, or (on phones) a bar across the bottom. */
export function Dock({ children, placement = 'corner', clearBar }: DockProps) {
  if (placement === 'bar') {
    return (
      <>
        {/* Keeps the page's end clear of the bar. */}
        <div className={styles.dockBarSpace} aria-hidden="true" />
        <div className={styles.dockBar}>{children}</div>
      </>
    )
  }
  return <div className={styles.dock} data-clear-bar={clearBar || undefined}>{children}</div>
}

export interface StackProps {
  children: ReactNode
  /** vertical: one under another (the default). horizontal: side by side. */
  direction?: 'vertical' | 'horizontal'
  /** A named gap, or one per width ({ base: 'none', md: 'lg' }: none on phones, lg from 768px). */
  gap?: LayoutGap | { base: LayoutGap; md?: LayoutGap }
  /** Cross-axis alignment (CSS align-items). */
  align?: Align
  /** Main-axis distribution (CSS justify-content); between pushes the first and last apart. */
  justify?: Justify
  /** Lets a horizontal stack wrap onto more lines when it runs out of room. */
  wrap?: boolean
  /** A horizontal stack that, below 768px, stays on one line and scrolls sideways (a phone's filter pills). */
  scrollBelow?: 'md'
  /** The first or last child takes the space left over (a search box beside a button). */
  fill?: 'first' | 'last'
  /** The element to render: ul for a list of items, nav, form, and so on. */
  as?: ElementType
}
/** Lays out its children in one direction with a gap between them. */
export function Stack({ children, direction = 'vertical', gap = 'md', align, justify, wrap = false, scrollBelow, fill, as: Tag = 'div' }: StackProps) {
  const base = typeof gap === 'string' ? gap : gap.base
  const md = typeof gap === 'string' ? gap : gap.md ?? gap.base
  const style = { '--stack-gap': gapVar(base), '--stack-gap-md': gapVar(md) } as CSSProperties
  return (
    <Tag
      className={styles.stack}
      style={style}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      data-scroll-below={scrollBelow}
      data-fill={fill}
    >
      {children}
    </Tag>
  )
}

/** Columns at each width: a number for the base, or one per breakpoint (sm 450, md 768, lg 1024, xl 1280px and up). */
export type GridColumns = number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }

export interface HideProps {
  children: ReactNode
  /** Hidden below this width (md: 768px, lg: 1024px). */
  below?: 'md' | 'lg'
  /** Hidden from this width up. */
  above?: 'md' | 'lg'
  /** span inside a line of text (part of a heading), div elsewhere (the default). */
  as?: 'div' | 'span'
}

/**
 * Shows its content only at some widths (a phone's filter bar, a desktop's Sort), adding no box
 * of its own. Hidden content is out of the page for everyone, screen readers included, so
 * each width still gets every control it needs.
 */
export function Hide({ children, below, above, as: Tag = 'div' }: HideProps) {
  return <Tag className={styles.hide} data-below={below} data-above={above}>{children}</Tag>
}

export interface DividerProps {
  /** horizontal: a line across (the default). vertical: a short line between items in a row ("Save | Map"). */
  orientation?: 'horizontal' | 'vertical'
}

/** A thin line between parts of a page, or between items in a row. Decorative: screen readers skip it. */
export function Divider({ orientation = 'horizontal' }: DividerProps) {
  return <span className={styles.divider} data-orientation={orientation} aria-hidden="true" {...dsFrame('Component/layout/divider/color')} />
}

export interface BleedProps {
  children: ReactNode
}

/**
 * Below 768px, takes its content to the screen's edges through the page gutter (a phone's
 * results list, cards edge to edge as on AcmeCo). From 768px it does nothing.
 */
export function Bleed({ children }: BleedProps) {
  return <div className={styles.bleed}>{children}</div>
}

export interface GridProps {
  children: ReactNode
  /** Equal columns (default 1). Ignored when template is set. */
  columns?: GridColumns
  /**
   * main-aside: the content and a 340px sidebar beside it (the property detail page's contact
   * column), stacking below 1024px with the sidebar after the content.
   */
  template?: 'main-aside'
  gap?: LayoutGap
  /** Vertical alignment of items in a row (CSS align-items). */
  align?: Exclude<Align, 'baseline'>
  as?: ElementType
}

/** Columns that collapse at the breakpoints. Items take one column each, in reading order. */
export function Grid({ children, columns = 1, template, gap = 'lg', align, as: Tag = 'div' }: GridProps) {
  const cols = typeof columns === 'number' ? { base: columns } : columns
  // Each breakpoint inherits the one below it, so { base: 1, lg: 3 } is 1 column until 1024px.
  const steps = ['base', 'sm', 'md', 'lg', 'xl'] as const
  const style: Record<string, string> = { '--grid-gap': gapVar(gap) }
  let last = cols.base ?? 1
  for (const s of steps) { last = cols[s] ?? last; style[`--grid-cols-${s}`] = String(last) }
  return (
    <Tag className={styles.grid} style={style as CSSProperties} data-template={template} data-align={align}>
      {children}
    </Tag>
  )
}

export interface SectionProps {
  children: ReactNode
  /** The id of the section's heading, so the section is a named region screen readers can jump to. */
  labelledBy?: string
  /** The gap between the section's blocks (default: AcmeCo's fluid block gap). */
  gap?: LayoutGap
}

/**
 * A page section: a section element named by its heading, its blocks stacked with the block
 * gap. Put sections in a Stack with gap="section" for the space between them.
 */
export function Section({ children, labelledBy, gap = 'block' }: SectionProps) {
  const style = { '--stack-gap': gapVar(gap) } as CSSProperties
  return (
    <section className={styles.stack} style={style} data-direction="vertical" aria-labelledby={labelledBy}>
      {children}
    </section>
  )
}
