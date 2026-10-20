import type { ReactNode } from 'react'
import styles from './Text.module.css'
import { dsText } from '../ds'

export type TextSize = 'body-large' | 'body' | 'body-small' | 'caption'
export type TextTone = 'default' | 'subtle'

export interface TextProps {
  children: ReactNode
  /** body (16/24) for most text; body-large (18/27) for an introduction; body-small (14/21) for secondary detail; caption (12/18) for fine print. One size, or one per width ({ base: 'body-small', md: 'body-large' }). */
  size?: TextSize | { base: TextSize; md?: TextSize }
  /** start (the default) or center. */
  align?: 'start' | 'center'
  /** default: ink. subtle: the secondary grey, for supporting detail (still 4.5:1 or more). */
  tone?: TextTone
  /** p for a paragraph (the default), span for text inside a line, div for a block that holds other elements. */
  as?: 'p' | 'span' | 'div'
  id?: string
}

/**
 * Text in the system's type styles and tones, with no margins (the layout primitives set the
 * space between paragraphs). <strong> inside it uses the loaded semibold, not a faux bold.
 */
export function Text({ children, size = 'body', tone = 'default', align = 'start', as: Tag = 'p', id }: TextProps) {
  const base = typeof size === 'string' ? size : size.base
  const md = typeof size === 'string' ? undefined : size.md
  const className = [styles.text, styles[base], md && styles[`md-${md}`], styles[tone], align === 'center' && styles.center].filter(Boolean).join(' ')
  return <Tag id={id} className={className} {...dsText(base, `Component/text/color/${tone}`)}>{children}</Tag>
}
