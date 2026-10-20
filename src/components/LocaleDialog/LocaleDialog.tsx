import { useRef, type KeyboardEvent } from 'react'
import { ChoiceCards, type ChoiceCardOption } from '../ChoiceCards/ChoiceCards'
import { Dialog } from '../Dialog/Dialog'
import { Link } from '../Link/Link'
import { Tabs } from '../Tabs/Tabs'

export interface LocaleDialogProps {
  /** The language-and-region choices ("English / United States"). */
  locales: ChoiceCardOption[]
  /** The currency choices ("US Dollar / USD $"). */
  currencies: ChoiceCardOption[]
  locale: string
  currency: string
  onLocaleChange?: (locale: string) => void
  onCurrencyChange?: (currency: string) => void
  /** Where "View My Preferences" goes. */
  preferencesHref?: string
  /** Controlled open state. Leave both unset inside a DialogTrigger with the globe button. */
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * AcmeCo's language, region and currency dialog, opened by the header's globe. Two tabs
 * of choice cards and "View My Preferences". Choosing with the pointer applies and closes;
 * with the keyboard, arrow keys apply as they move and Enter closes, so the dialog doesn't
 * vanish on the first arrow press.
 */
export function LocaleDialog({
  locales, currencies, locale, currency, onLocaleChange, onCurrencyChange, preferencesHref = '#preferences', isOpen, onOpenChange,
}: LocaleDialogProps) {
  // Was the latest change made with a pointer? Then the choice is final: close.
  const byPointer = useRef(false)
  return (
    <Dialog
      title="Language and currency"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      footer={<Link variant="standalone" href={preferencesHref}>View My Preferences</Link>}
    >
      {(close) => {
        const choose = (apply?: (value: string) => void) => (value: string) => {
          apply?.(value)
          if (byPointer.current) close()
        }
        // Enter on a choice confirms it (a radio has no Enter action of its own).
        const onKeyDown = (event: KeyboardEvent) => {
          byPointer.current = false
          if (event.key === 'Enter' && (event.target as HTMLElement).matches('input[type="radio"]')) close()
        }
        return (
          // Capture phase: React Aria's press handling stops pointer events before they bubble here.
          <div onPointerDownCapture={() => { byPointer.current = true }} onKeyDownCapture={onKeyDown}>
            <Tabs
              label="Language and currency"
              items={[
                { id: 'language', label: 'Language and Region', content: <ChoiceCards label="Language and region" options={locales} value={locale} onChange={choose(onLocaleChange)} /> },
                { id: 'currency', label: 'Currency', content: <ChoiceCards label="Currency" options={currencies} value={currency} onChange={choose(onCurrencyChange)} /> },
              ]}
            />
          </div>
        )
      }}
    </Dialog>
  )
}
