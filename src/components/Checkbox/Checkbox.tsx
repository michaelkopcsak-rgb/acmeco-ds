import { useId, type ReactNode } from 'react'
import { Checkbox as AriaCheckbox, CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components'
import { Check, Minus } from '../../icons'
import { FieldErrorMessage, FieldHint, FieldLabel } from '../Field/Field'
import fieldStyles from '../Field/Field.module.css'
import styles from './Checkbox.module.css'

export interface CheckboxProps {
  /** The visible label; also the checkbox's accessible name. The whole label is clickable. */
  children: ReactNode
  /** Extra detail under the label, read by screen readers as the description. */
  description?: ReactNode
  isSelected?: boolean
  defaultSelected?: boolean
  onChange?: (isSelected: boolean) => void
  /** "Some selected": shows a dash, e.g. a "Select all" whose group is partly checked. */
  isIndeterminate?: boolean
  isDisabled?: boolean
  /** Red border; pair it with an error message (CheckboxGroup shows one). */
  isInvalid?: boolean
  /** Required inside a CheckboxGroup: what this option means in the group's value. */
  value?: string
  name?: string
}

export function Checkbox({ children, description, isSelected, defaultSelected, onChange, isIndeterminate, isDisabled, isInvalid, value, name }: CheckboxProps) {
  const descriptionId = useId()
  return (
    <div className={styles.item}>
      <AriaCheckbox
        className={styles.checkbox}
        isSelected={isSelected}
        defaultSelected={defaultSelected}
        onChange={onChange}
        isIndeterminate={isIndeterminate}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        value={value}
        name={name}
        aria-describedby={description ? descriptionId : undefined}
      >
        {({ isSelected: selected, isIndeterminate: indeterminate }) => (
          <>
            <span className={styles.box} aria-hidden="true">
              {indeterminate ? <Minus className={styles.icon} /> : selected ? <Check className={styles.icon} /> : null}
            </span>
            <span className={styles.label}>{children}</span>
          </>
        )}
      </AriaCheckbox>
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
    </div>
  )
}

export interface CheckboxGroupProps {
  /** The group's visible label, read before each option ("Space use, Office, checkbox"). */
  label: string
  children: ReactNode
  hint?: ReactNode
  /** When set, the group is invalid: each box gets a red border, and this message (with an icon) is linked to the group. */
  errorMessage?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  isRequired?: boolean
  isDisabled?: boolean
  name?: string
}

export function CheckboxGroup({ label, children, hint, errorMessage, value, defaultValue, onChange, isRequired, isDisabled, name }: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      className={fieldStyles.field}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errorMessage}
      name={name}
    >
      <FieldLabel isRequired={isRequired}>{label}</FieldLabel>
      {hint && <FieldHint>{hint}</FieldHint>}
      <div className={styles.options}>{children}</div>
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </AriaCheckboxGroup>
  )
}
