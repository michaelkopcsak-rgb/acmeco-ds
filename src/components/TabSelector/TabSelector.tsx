import { Radio, RadioGroup } from 'react-aria-components'
import { FieldLabel } from '../Field/Field'
import styles from './TabSelector.module.css'

export interface TabSelectorOption {
  value: string
  label: string
  isDisabled?: boolean
}

export interface TabSelectorProps {
  /** Always required: what's being chosen ("Listing type"); the group's accessible name. */
  label: string
  /** Show the label above the tabs. Usually hidden: the tab labels explain themselves. */
  showLabel?: boolean
  /** Two to four short options. */
  options: TabSelectorOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Equal-width tabs across the container. */
  fullWidth?: boolean
  isDisabled?: boolean
  name?: string
}

/**
 * AcmeCo's grey folder tabs, used to make one choice (For Sale / For Lease / Auctions).
 * It looks like tabs but behaves as a radio group, because it sets a value (the search
 * mode) rather than switching between sections of the page: one tab stop, arrow keys
 * move the selection, and screen readers hear "Listing type, radio group, For Sale, 1 of 3, selected".
 * Place the related panel directly below, on a white background, and the selected tab opens into it.
 */
export function TabSelector({ label, showLabel = false, options, value, defaultValue, onChange, fullWidth, isDisabled, name }: TabSelectorProps) {
  return (
    <RadioGroup className={styles.group} value={value} defaultValue={defaultValue} onChange={onChange} orientation="horizontal" isDisabled={isDisabled} name={name}>
      <FieldLabel hidden={!showLabel}>{label}</FieldLabel>
      <div className={fullWidth ? `${styles.row} ${styles.fullWidth}` : styles.row}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} isDisabled={option.isDisabled} className={styles.tab}>
            {option.label}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  )
}
