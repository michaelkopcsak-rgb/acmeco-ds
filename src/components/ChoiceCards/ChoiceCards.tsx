import type { CSSProperties } from 'react'
import { Label, Radio, RadioGroup } from 'react-aria-components'
import styles from './ChoiceCards.module.css'

export interface ChoiceCardOption {
  value: string
  /** The main line ("English"). */
  label: string
  /** A second line that tells similar options apart ("United Kingdom"). */
  description?: string
  isDisabled?: boolean
}

export interface ChoiceCardsProps {
  /** What's being chosen ("Language and region"): the group's accessible name. */
  label: string
  /** Show the label above the cards. Hidden by default when a heading or tab already says it. */
  showLabel?: boolean
  options: ChoiceCardOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Columns on wider screens (default 3); at 450px and below, at most 2. */
  columns?: 1 | 2 | 3 | 4
  name?: string
}

/**
 * One choice from a handful of options, drawn as cards (AcmeCo's language and currency
 * choices). A radio group underneath: one tab stop, arrow keys move the choice, and the
 * selected card is announced as checked, not only shown in blue.
 */
export function ChoiceCards({ label, showLabel = false, options, value, defaultValue, onChange, columns = 3, name }: ChoiceCardsProps) {
  const style = { '--choice-columns': columns, '--choice-columns-narrow': Math.min(columns, 2) } as CSSProperties
  return (
    <RadioGroup className={styles.group} value={value} defaultValue={defaultValue} onChange={onChange} name={name}>
      <Label className={showLabel ? styles.label : 'sr-only'}>{label}</Label>
      <div className={styles.grid} style={style}>
        {options.map((o) => (
          <Radio key={o.value} value={o.value} isDisabled={o.isDisabled} className={styles.card}>
            <span className={styles.cardLabel}>{o.label}</span>
            {o.description && <span className={styles.description}>{o.description}</span>}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  )
}
