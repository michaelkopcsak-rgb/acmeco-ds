import { useState, type ReactNode } from 'react'
import { Button as AriaButton, ButtonContext, Input, SearchField as AriaSearchField } from 'react-aria-components'
import { CircleX, Search } from '../../icons'
import { FieldControl, FieldHint, FieldLabel, type FieldShape, type FieldSize } from '../Field/Field'
import fieldStyles from '../Field/Field.module.css'
import { IconButton } from '../IconButton/IconButton'
import styles from './SearchField.module.css'
import { ds } from '../ds'

export interface SearchFieldProps {
  /** Always required: the field's accessible name ("City, ZIP or address"). */
  label: string
  /** Hide the label visually (screen readers still get it), e.g. in the hero where the purpose is obvious. */
  hideLabel?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Runs on Enter, and on the submit button when `showSubmit` is set. */
  onSubmit?: (value: string) => void
  /** Adds a dark blue Search button inside the field's end edge (the hero search). */
  showSubmit?: boolean
  /** button: a filled dark blue circle (the hero, the default). icon: a plain dark blue magnifier (the results search, as AcmeCo's). */
  submitAppearance?: 'button' | 'icon'
  /** An icon before the text (the results search's location arrow, from the registry). Hidden from screen readers. */
  startIcon?: ReactNode
  placeholder?: string
  hint?: string
  isDisabled?: boolean
  name?: string
  /** md 40px, lg 48px. */
  size?: FieldSize
  /** 'pill' is only for the hero location search. */
  shape?: FieldShape
}

export function SearchField({
  label, hideLabel, value, defaultValue, onChange, onSubmit, showSubmit, submitAppearance = 'button', startIcon, placeholder, hint, isDisabled, name, size = 'md', shape = 'default',
}: SearchFieldProps) {
  const [ownValue, setOwnValue] = useState(defaultValue ?? '')
  const current = value ?? ownValue
  const change = (next: string) => {
    setOwnValue(next)
    onChange?.(next)
  }
  return (
    <AriaSearchField
      {...ds({
        set: 'Search field',
        props: {
          Size: size,
          State: isDisabled ? 'Disabled' : shape === 'pill' && showSubmit
            ? (startIcon ? (submitAppearance === 'icon' ? 'Results (AcmeCo today)' : 'Results') : 'Hero')
            : current ? 'Filled' : 'Empty',
        },
        layers: { Value: current || placeholder || '' },
      })}
      className={`${fieldStyles.field} ${styles.searchField}`}
      value={current}
      onChange={change}
      onSubmit={onSubmit}
      isDisabled={isDisabled}
      name={name}
    >
      <FieldLabel hidden={hideLabel}>{label}</FieldLabel>
      <FieldControl size={size} shape={shape} isDisabled={isDisabled}>
        {startIcon && <span className={styles.startIcon} aria-hidden="true">{startIcon}</span>}
        <Input className={fieldStyles.input} placeholder={placeholder} />
        {/* React Aria wires this button to clear the field. Hidden while it's empty. */}
        <AriaButton className={styles.clear} aria-label="Clear search">
          <CircleX className={styles.clearIcon} aria-hidden="true" />
        </AriaButton>
        {showSubmit && (
          // SearchField gives every button inside it the "clear" behaviour; this
          // switches that off so the submit button submits.
          <ButtonContext.Provider value={null}>
            {submitAppearance === 'icon' ? (
              <AriaButton className={styles.searchIcon} aria-label="Search" isDisabled={isDisabled} onPress={() => onSubmit?.(current)}>
                <Search aria-hidden="true" />
              </AriaButton>
            ) : (
              <span className={styles.submit}>
                {/* Sized to sit inside the field with a 4px inset; round inside a pill. */}
                <IconButton
                  variant="primary"
                  size={size === 'lg' ? 'md' : 'sm'}
                  shape={shape === 'pill' ? 'circle' : 'default'}
                  label="Search"
                  icon={<Search />}
                  isDisabled={isDisabled}
                  onPress={() => onSubmit?.(current)}
                />
              </span>
            )}
          </ButtonContext.Provider>
        )}
      </FieldControl>
      {hint && <FieldHint>{hint}</FieldHint>}
    </AriaSearchField>
  )
}
