import type { ReactNode } from 'react'
import styles from './Heading.module.css'
import { dsText } from '../ds'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = 'display' | 'heading-1' | 'heading-2' | 'heading-3'

export interface HeadingProps {
  children: ReactNode
  /** Its place in the page's outline: 1 for the page's one h1, then 2, 3… in order, never skipping. */
  level: HeadingLevel
  /** How it looks, independent of the level (an h2 can look like heading-3). Defaults: level 1 → heading-1, 2 → heading-2, 3 and below → heading-3. display is for a hero. One size, or one per width ({ base: 'heading-3', md: 'heading-1' }: smaller on phones). */
  size?: HeadingSize | { base: HeadingSize; md?: HeadingSize }
  /** start (the default) or center: a title bar's lines centred, also when they wrap. */
  align?: 'start' | 'center'
  /** For Section's labelledBy, so the section is named by its heading. */
  id?: string
}

const defaultSize = (level: HeadingLevel): HeadingSize => (level === 1 ? 'heading-1' : level === 2 ? 'heading-2' : 'heading-3')

/**
 * A heading in the system's type styles, with no margins (the layout primitives set the
 * space around it). The level sets the outline screen readers navigate; the size sets the look.
 */
export function Heading({ children, level, size = defaultSize(level), align = 'start', id }: HeadingProps) {
  const Tag = `h${level}` as const
  const base = typeof size === 'string' ? size : size.base
  const md = typeof size === 'string' ? undefined : size.md
  const className = [styles.heading, styles[base], md && styles[`md-${md}`], align === 'center' && styles.center].filter(Boolean).join(' ')
  return <Tag id={id} className={className} {...dsText(base, 'Component/heading/color')}>{children}</Tag>
}
