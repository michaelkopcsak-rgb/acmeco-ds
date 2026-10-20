import type { ReactNode } from 'react'
import styles from './FactList.module.css'

export interface Fact {
  /** What the value is ("Year Built"). */
  label: string
  /** The value ("1998", "22,400 SF"). */
  value: ReactNode
}

export interface FactListProps {
  /** The facts, in reading order. */
  items: Fact[]
  /** 2: two facts on a row where there's room (560px or wider), one below that. */
  columns?: 1 | 2
}

/**
 * Label / value rows: AcmeCo's property facts. A description list, so screen readers pair
 * each label with its value. The label column takes a little under half the row, as on
 * AcmeCo; labels are grey, values ink.
 */
export function FactList({ items, columns = 1 }: FactListProps) {
  return (
    <div className={styles.container}>
      <dl className={styles.list} data-columns={columns}>
        {items.map((f) => (
          <div key={f.label} className={styles.fact}>
            <dt className={styles.label}>{f.label}</dt>
            <dd className={styles.value}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
