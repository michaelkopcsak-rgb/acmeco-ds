import type { CSSProperties, ReactNode } from 'react'
import styles from './List.module.css'

export interface ListProps {
  /** The points, in reading order. */
  items: ReactNode[]
  /** Columns: one number for every width, or { base, md } for phones and from 768px. Items run down the first column, then the next, as AcmeCo's two lists do. */
  columns?: number | { base: number; md?: number }
}

/**
 * A bullet list with AcmeCo's dark blue bullets: a listing's highlights, its features. A real
 * list (ul), so screen readers announce how many points there are. In columns, the items
 * flow down one column and on to the next, keeping the reading order.
 */
export function List({ items, columns = 1 }: ListProps) {
  const base = typeof columns === 'number' ? columns : columns.base
  const md = typeof columns === 'number' ? columns : columns.md ?? columns.base
  const style = { '--list-columns': base, '--list-columns-md': md } as CSSProperties
  return (
    // role="list": Safari stops announcing a list when its bullets come from CSS rather than list-style.
    <ul className={styles.list} style={style} role="list">
      {items.map((item, i) => <li key={i} className={styles.item}>{item}</li>)}
    </ul>
  )
}
