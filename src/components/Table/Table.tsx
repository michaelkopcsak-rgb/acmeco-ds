import type { ReactNode } from 'react'
import { Cell, Column, Row, Table as AriaTable, TableBody, TableHeader } from 'react-aria-components'
import styles from './Table.module.css'

export interface TableColumn {
  id: string
  /** The column heading ("Size"). Always given, so screen readers can name each cell. */
  label: string
  /** The column that names each row ("Space"): screen readers read it with every cell in the row. One per table. */
  isRowHeader?: boolean
  /** Hide the heading from sight but keep it for screen readers (a column of buttons). */
  hideLabel?: boolean
}

export interface TableRow {
  id: string
  /** Each column's content, by column id. */
  cells: Record<string, ReactNode>
  /** The row as plain text, for typing to jump to a row. */
  textValue: string
}

export interface TableProps {
  columns: TableColumn[]
  rows: TableRow[]
  /** The table's name, when no heading names it. */
  label?: string
  /** The id of the heading that names the table ("All Available Spaces"). */
  labelledBy?: string
  /** Pressing a row (or Enter on it) acts on it: opens the space's details. Rows get a hover state. */
  onRowAction?: (id: string) => void
}

/**
 * Rows of the same facts, compared column by column: AcmeCo's All Available Spaces. Built on
 * React Aria's Table, so arrow keys move between rows and cells and screen readers announce
 * the column heading and the row's name with each cell. AcmeCo's own version is lists with
 * no headings and a chevron that can't take focus.
 */
export function Table({ columns, rows, label, labelledBy, onRowAction }: TableProps) {
  return (
    <AriaTable
      className={styles.table}
      aria-label={label}
      aria-labelledby={labelledBy}
      onRowAction={onRowAction ? (key) => onRowAction(String(key)) : undefined}
    >
      <TableHeader className={styles.header}>
        {columns.map((c) => (
          <Column key={c.id} id={c.id} isRowHeader={c.isRowHeader} className={styles.column}>
            {c.hideLabel ? <span className="sr-only">{c.label}</span> : c.label}
          </Column>
        ))}
      </TableHeader>
      <TableBody className={styles.body}>
        {rows.map((r) => (
          <Row key={r.id} id={r.id} textValue={r.textValue} className={styles.row}>
            {columns.map((c) => <Cell key={c.id} className={styles.cell}>{r.cells[c.id]}</Cell>)}
          </Row>
        ))}
      </TableBody>
    </AriaTable>
  )
}
