import { useState, type ReactNode } from 'react'
import { Input, TextArea, TextField as AriaTextField } from 'react-aria-components'
import { FieldControl, FieldErrorMessage, FieldHint, FieldLabel, type FieldShape, type FieldSize } from '../Field/Field'
import fieldStyles from '../Field/Field.module.css'

export interface TextFieldProps {
  /** Always required: the visible label, and the field's accessible name. */
  label: string
  /**
   * Hide the label visually (screen readers still get it). Only when the purpose
   * is obvious from context, such as the hero location search.
   */
  hideLabel?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Short help below the field ("We'll only use this to reply to you"). */
  hint?: ReactNode
  /** When set, the field is invalid: red, thicker border, icon and this message. Say how to fix it. */
  errorMessage?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'password'
  /** A taller field for longer text (a message). */
  multiline?: boolean
  rows?: number
  /** Shows a live "120 / 500" counter, and stops typing at the limit. */
  maxLength?: number
  isRequired?: boolean
  isDisabled?: boolean
  /** Shows a value that can't be changed here (grey background), but can still be selected and copied. */
  isReadOnly?: boolean
  placeholder?: string
  /** e.g. "email", "tel", "name": lets browsers fill it in. */
  autoComplete?: string
  name?: string
  /** md 40px, lg 48px. */
  size?: FieldSize
  /** 'pill' is only for the hero location search. */
  shape?: FieldShape
  /** Something inside the field's end edge, such as an IconButton. */
  endAction?: ReactNode
}

export function TextField({
  label, hideLabel, value, defaultValue, onChange, hint, errorMessage, type = 'text', multiline, rows = 4,
  maxLength, isRequired, isDisabled, isReadOnly, placeholder, autoComplete, name, size = 'md', shape = 'default', endAction,
}: TextFieldProps) {
  const isInvalid = !!errorMessage
  // Works controlled (value + onChange) or uncontrolled (defaultValue); the
  // counter needs the current text either way.
  const [ownValue, setOwnValue] = useState(defaultValue ?? '')
  const current = value ?? ownValue
  return (
    <AriaTextField
      className={fieldStyles.field}
      value={current}
      onChange={(next) => {
        setOwnValue(next)
        onChange?.(next)
      }}
      type={type}
      maxLength={maxLength}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      autoComplete={autoComplete}
      name={name}
    >
      <FieldLabel isRequired={isRequired} hidden={hideLabel}>{label}</FieldLabel>
      <FieldControl size={size} shape={shape} isInvalid={isInvalid} isDisabled={isDisabled} isReadOnly={isReadOnly} multiline={multiline}>
        {multiline ? (
          <TextArea className={fieldStyles.input} rows={rows} placeholder={placeholder} />
        ) : (
          <Input className={fieldStyles.input} placeholder={placeholder} />
        )}
        {endAction}
      </FieldControl>
      {(hint || maxLength) && (
        <div className={fieldStyles.meta}>
          {/* The hint is linked to the field, so screen readers hear it (and the limit) on focus. */}
          <FieldHint>
            {hint}
            {maxLength && <span className="sr-only"> Up to {maxLength} characters.</span>}
          </FieldHint>
          {/* The live count is for sighted users; announcing every keystroke would be noise. */}
          {maxLength && <span className={fieldStyles.counter} aria-hidden="true">{current.length} / {maxLength}</span>}
        </div>
      )}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </AriaTextField>
  )
}
