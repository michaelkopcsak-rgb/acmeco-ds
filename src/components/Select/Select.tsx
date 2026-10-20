import { Button, ListBox, ListBoxItem, Popover, Select as AriaSelect, SelectValue, type Key } from 'react-aria-components'
import { Check, ChevronDown } from '../../icons'
import { FieldErrorMessage, FieldHint, FieldLabel, type FieldSize } from '../Field/Field'
import fieldStyles from '../Field/Field.module.css'
import styles from './Select.module.css'
import { ds } from '../ds'

export interface SelectOption {
  value: string
  label: string
  isDisabled?: boolean
}

export interface SelectProps {
  /** Always required: the visible label (field) or the trigger's text before a choice (compact), and the accessible name. */
  label: string
  options: SelectOption[]
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string | null) => void
  /** field: a form control that looks like TextField. compact: a 32px pill trigger for sort and filters. */
  appearance?: 'field' | 'compact'
  /** Field only: md 40px, lg 48px. */
  size?: FieldSize
  /** Field only: shown before a choice is made. */
  placeholder?: string
  /** Hide the label visually (screen readers still get it). Compact triggers always do, showing it as the trigger text instead. */
  hideLabel?: boolean
  hint?: string
  /** When set, the select is invalid: red, thicker border, icon and this message. */
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  name?: string
  /** Opens the list on first render (used for documentation and tests). */
  defaultOpen?: boolean
}

export function Select({
  label, options, value, defaultValue, onChange, appearance = 'field', size = 'md', placeholder = 'Select', hideLabel,
  hint, errorMessage, isRequired, isDisabled, name, defaultOpen,
}: SelectProps) {
  const compact = appearance === 'compact'
  const chosen = options.find((o) => o.value === (value ?? defaultValue))?.label
  const mark = ds({
    set: 'Select',
    props: { Appearance: compact ? 'Compact' : 'Field', Size: compact ? 'md' : size, State: isDisabled ? 'Disabled' : errorMessage ? 'Invalid' : chosen ? 'Filled' : 'Placeholder' },
    ...(compact ? {} : { text: { Label: label }, bools: { 'Show label': !hideLabel } }),
    layers: { Value: chosen ?? (compact ? label : placeholder ?? '') },
  })
  return (
    <AriaSelect
      className={`${fieldStyles.field} ${styles.select}`}
      {...mark}
      value={value as Key | null | undefined}
      defaultValue={defaultValue as Key | null | undefined}
      onChange={(key) => onChange?.(key === null ? null : String(key))}
      placeholder={compact ? label : placeholder}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errorMessage}
      name={name}
      defaultOpen={defaultOpen}
      // A compact trigger is named by aria-label. Before a choice, its visible
      // text repeats the label, so that text is hidden from screen readers (below);
      // otherwise they'd hear "Sort, Sort". After a choice: "Newest, Sort".
      aria-label={compact ? label : undefined}
    >
      {!compact && <FieldLabel isRequired={isRequired} hidden={hideLabel}>{label}</FieldLabel>}
      <Button className={compact ? styles.compact : `${styles.trigger} ${styles[size]}`}>
        <SelectValue className={styles.value}>
          {({ isPlaceholder, defaultChildren }) => (compact && isPlaceholder ? <span aria-hidden="true">{label}</span> : defaultChildren)}
        </SelectValue>
        <ChevronDown className={compact ? styles.compactChevron : styles.chevron} aria-hidden="true" />
      </Button>
      {hint && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      <Popover className={styles.popover} placement="bottom start">
        <ListBox className={styles.listbox} items={options.map((o) => ({ id: o.value, ...o }))}>
          {(option) => (
            <ListBoxItem id={option.id} textValue={option.label} isDisabled={option.isDisabled} className={styles.option}>
              {({ isSelected }) => (
                <>
                  <span>{option.label}</span>
                  {isSelected && <Check className={styles.check} aria-hidden="true" />}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
}
