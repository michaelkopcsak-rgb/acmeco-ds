import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Broker } from '../../data/types'
import { Button } from '../Button/Button'
import { Dialog } from '../Dialog/Dialog'
import { Link } from '../Link/Link'
import { BrokerIdentity } from '../Property/BrokerIdentity'
import { Select } from '../Select/Select'
import { TextField } from '../TextField/TextField'
import styles from './ContactForm.module.css'

export interface ContactValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  ext: string
  space: string
  message: string
}

export interface ContactFormProps {
  /** The listing the message is about; prefills the message, as AcmeCo does. */
  listingTitle: string
  /** The listing's company and brokers, shown above the form. */
  company: string
  brokers: Broker[]
  /** Receives the values when they're valid. The prototype sends nothing. */
  onSubmit?: (values: ContactValues) => void | Promise<void>
  /** Controlled open state. Leave both unset inside a DialogTrigger with the button that opens it. */
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

// AcmeCo's optional "How much space do you need?" select. Synthetic ranges (the
// captured options weren't recorded), as in the audit prototype.
const SPACE = [
  { value: 'under-2000', label: 'Under 2,000 SF' },
  { value: '2000-5000', label: '2,000 - 5,000 SF' },
  { value: '5000-10000', label: '5,000 - 10,000 SF' },
  { value: '10000-plus', label: '10,000+ SF' },
]

const MAX_MESSAGE = 400 // OBSERVED: "84 out of 400"
type Errors = Partial<Record<keyof ContactValues, string>>

/** What's wrong with each field, in the order the form shows them. */
export function validateContact(v: ContactValues): Errors {
  const errors: Errors = {}
  if (!v.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!v.lastName.trim()) errors.lastName = 'Enter your last name.'
  if (!v.email.trim()) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Enter an email address like name@example.com.'
  if (!v.phone.trim()) errors.phone = 'Enter your phone number.'
  else if (v.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a phone number with at least 10 digits.'
  if (!v.message.trim()) errors.message = 'Enter a message for the broker.'
  return errors
}

/**
 * AcmeCo's guest contact form ("Contact Broker"), in a Dialog that a stray click
 * can't close (decision 28). Every field is labelled; required and optional are
 * said in words; problems show under their fields on send, and focus moves to the
 * first one. After sending, the dialog confirms who the message went to.
 */
export function ContactForm({ listingTitle, company, brokers, onSubmit, isOpen, onOpenChange }: ContactFormProps) {
  const lead = brokers[0]
  const initial: ContactValues = {
    firstName: '', lastName: '', email: '', phone: '', ext: '', space: '',
    message: `Hi, I found ${listingTitle} on AcmeCo and would like to learn more about it. Thanks!`,
  }
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const sentRef = useRef<HTMLParagraphElement>(null)

  const field = (key: keyof ContactValues) => ({
    name: key,
    value: values[key],
    errorMessage: errors[key],
    onChange: (value: string) => {
      setValues((v) => ({ ...v, [key]: value }))
      // A fixed problem clears as soon as it's fixed; new ones wait for the next send.
      if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
    },
  })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      // After React shows the messages, move focus to the first field with a problem.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus())
      return
    }
    setSending(true)
    try {
      await onSubmit?.(values)
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  // Once the confirmation is on screen, move focus to it. The send button it replaced had
  // focus, and the dialog's focus trap re-homes lost focus first; a timeout runs after that.
  useEffect(() => {
    if (!sent) return
    const timer = setTimeout(() => sentRef.current?.focus())
    return () => clearTimeout(timer)
  }, [sent])

  const reset = () => {
    setValues(initial)
    setErrors({})
    setSent(false)
  }

  return (
    <Dialog
      title="Contact broker"
      isDismissable={false}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && sent) reset()
        onOpenChange?.(open)
      }}
      footer={(close) => (
        // One button that becomes Done, not two: React Aria announces a finished loading button
        // by pointing at it, and a replaced button would leave that announcement pointing at nothing.
        // The footer sits outside the form (it stays put while the form scrolls), so it submits by reference.
        <Button
          isLoading={sending}
          onPress={sent ? () => { close(); reset() } : () => formRef.current?.requestSubmit()}
        >
          {sent ? 'Done' : 'Contact Broker'}
        </Button>
      )}
    >
      {sent ? (
        <p ref={sentRef} tabIndex={-1} className={styles.sent} role="status">
          Message sent{lead ? ` to ${lead.name}` : ''}. {lead ? 'They' : 'The broker'} will reply to {values.email}.
        </p>
      ) : (
        <div className={styles.layout}>
          <div className={styles.about}>
            <BrokerIdentity company={company} brokers={brokers.slice(0, 1)} />
            <p className={styles.note}>
              About {listingTitle}. Already a member? <Link href="#log-in">Log in</Link>
            </p>
          </div>

          {/* noValidate: the form checks itself on send and explains each problem, instead of the browser's bubbles. */}
          <form ref={formRef} className={styles.form} onSubmit={submit} noValidate aria-label="Contact broker">
            <div className={styles.pair}>
              <TextField label="First name" isRequired autoComplete="given-name" {...field('firstName')} />
              <TextField label="Last name" isRequired autoComplete="family-name" {...field('lastName')} />
            </div>
            <TextField label="Email" type="email" isRequired autoComplete="email" {...field('email')} />
            <div className={`${styles.pair} ${styles.phone}`}>
              <TextField label="Phone" type="tel" isRequired autoComplete="tel-national" {...field('phone')} />
              <TextField label="Ext (optional)" type="tel" autoComplete="tel-extension" {...field('ext')} />
            </div>
            <Select
              label="How much space do you need? (optional)"
              placeholder="Select size"
              options={SPACE}
              name="space"
              value={values.space || null}
              onChange={(value) => setValues((v) => ({ ...v, space: value ?? '' }))}
            />
            <TextField label="Message" multiline rows={3} maxLength={MAX_MESSAGE} isRequired {...field('message')} />
            <p className={styles.note}>
              New to AcmeCo? We'll create a free account with these details so you can follow up. By sending, you agree to the{' '}
              <Link href="#terms">Terms of Use</Link> and <Link href="#privacy">Privacy Notice</Link>. (Placeholder wording.)
            </p>
          </form>
        </div>
      )}
    </Dialog>
  )
}
