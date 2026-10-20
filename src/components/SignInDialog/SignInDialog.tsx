import { useId, useRef, useState, type FormEvent } from 'react'
import { Button } from '../Button/Button'
import { Dialog } from '../Dialog/Dialog'
import { TextField } from '../TextField/TextField'
import styles from './SignInDialog.module.css'

export interface SignInSlide {
  title: string
  text: string
  /** A picture for the slide; decorative (the title and text carry the meaning). */
  image: string
}

export interface SignInProvider {
  name: string
  /** Placeholder mark, e.g. "G". Production uses each provider's official sign-in artwork. */
  mark: string
}

const PROVIDERS: SignInProvider[] = [
  { name: 'Google', mark: 'G' },
  { name: 'LinkedIn', mark: 'in' },
  { name: 'Apple', mark: 'A' },
]

export interface SignInDialogProps {
  /** The promo carousel's slides (four on AcmeCo). */
  slides: SignInSlide[]
  /** Receives a valid email address. The next step (password or new account) is the caller's. */
  onContinue?: (email: string) => void | Promise<void>
  /**
   * Other ways to sign in, as AcmeCo's row of round buttons. `mark` is a neutral placeholder
   * shown in the circle (decision 31: providers' logos are licensed only for real sign-in
   * integrations); each button is named "Continue with {name}".
   */
  providers?: SignInProvider[]
  onProvider?: (provider: string) => void
  /** Controlled open state. Leave both unset inside a DialogTrigger with the link that opens it. */
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * AcmeCo's "Log In/Sign Up" dialog: an email form with other sign-in options, beside a
 * promo carousel. Opened by "Save results" on search results and "Log in" in the
 * contact form. Clicking outside doesn't close it (it holds a form, decision 28).
 */
export function SignInDialog({ slides, onContinue, providers = PROVIDERS, onProvider, isOpen, onOpenChange }: SignInDialogProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = email.trim()
    const problem = !value ? 'Enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter an email address like name@example.com.' : undefined
    setError(problem)
    if (problem) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus())
      return
    }
    setBusy(true)
    try {
      await onContinue?.(value)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog title="Log in or sign up" size="lg" isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className={styles.layout}>
        {/* The form comes first in reading order; on wide screens the promo sits to its left. */}
        <div className={styles.account}>
          <p className={styles.intro}>Enter your email to log in or create a free account.</p>
          <form ref={formRef} className={styles.form} onSubmit={submit} noValidate aria-label="Log in or sign up with email">
            <TextField
              label="Email"
              type="email"
              name="email"
              isRequired
              autoComplete="email"
              value={email}
              onChange={(v) => { setEmail(v); if (error) setError(undefined) }}
              errorMessage={error}
            />
            <Button type="submit" size="lg" fullWidth isLoading={busy}>Continue</Button>
          </form>
          {providers.length > 0 && (
            <>
              <p className={styles.divider}>or continue with</p>
              <div className={styles.providers}>
                {providers.map((p) => (
                  // The placeholder mark is drawn by CSS (data-mark), so it's decoration, not part of the button's text.
                  <button key={p.name} type="button" className={styles.provider} data-mark={p.mark} aria-label={`Continue with ${p.name}`} onClick={() => onProvider?.(p.name)} />
                ))}
              </div>
            </>
          )}
        </div>
        <Promo slides={slides} />
      </div>
    </Dialog>
  )
}

/**
 * The promo carousel: one slide at a time, changed with the dots. No automatic
 * rotation, so nothing moves while someone reads or types (WCAG 2.2.2).
 */
function Promo({ slides }: { slides: SignInSlide[] }) {
  const [index, setIndex] = useState(0)
  const id = useId()
  const slide = slides[index]
  if (!slide) return null
  return (
    <section className={styles.promo} aria-roledescription="carousel" aria-label="Why sign up">
      {/* Polite live region: changing slides reads the new one. */}
      <div id={`${id}-slide`} className={styles.slide} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`} aria-live="polite">
        <h3 className={styles.slideTitle}>{slide.title}</h3>
        <img className={styles.slideImage} src={slide.image} alt="" />
        <p className={styles.slideText}>{slide.text}</p>
      </div>
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={styles.dot}
              aria-label={`Slide ${i + 1} of ${slides.length}: ${s.title}`}
              aria-current={i === index ? 'true' : undefined}
              aria-controls={`${id}-slide`}
              onClick={() => setIndex(i)}
            >
              <span className={styles.dotMark} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
