// Shared parts of every form control: label, hint, error message and the control
// box. TextField and SearchField use them now; Select and Checkbox will too, so
// form controls can't drift apart (the audit found text fields in 5 shapes).
// Internal building blocks, not a public component.
import type { ReactNode } from 'react'
import { FieldError, Group, Label, Text } from 'react-aria-components'
import { CircleAlert } from '../../icons'
import styles from './Field.module.css'

export type FieldSize = 'md' | 'lg'
export type FieldShape = 'default' | 'pill'

export function FieldLabel({ children, isRequired, hidden }: { children: ReactNode; isRequired?: boolean; hidden?: boolean }) {
  return (
    <Label className={hidden ? 'sr-only' : styles.label}>
      {children}
      {/* The asterisk is visual only; React Aria tells screen readers the field is required. */}
      {isRequired && <span aria-hidden="true"> *</span>}
    </Label>
  )
}

export function FieldHint({ children }: { children: ReactNode }) {
  return (
    <Text slot="description" className={styles.hint}>
      {children}
    </Text>
  )
}

/** Shown only while the field is invalid; React Aria links it to the field for screen readers. */
export function FieldErrorMessage({ children }: { children: ReactNode }) {
  return (
    <FieldError className={styles.error}>
      <CircleAlert className={styles.errorIcon} aria-hidden="true" />
      <span>{children}</span>
    </FieldError>
  )
}

/** The bordered box around an input and any end actions (clear, submit). */
export function FieldControl({ children, size = 'md', shape = 'default', isInvalid, isDisabled, isReadOnly, multiline }: {
  children: ReactNode
  size?: FieldSize
  shape?: FieldShape
  isInvalid?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  multiline?: boolean
}) {
  const className = [styles.control, styles[size], shape === 'pill' && styles.pill, isReadOnly && styles.readOnly, multiline && styles.multiline].filter(Boolean).join(' ')
  return (
    <Group className={className} data-part="control" data-size={size} isInvalid={isInvalid} isDisabled={isDisabled}>
      {children}
    </Group>
  )
}

