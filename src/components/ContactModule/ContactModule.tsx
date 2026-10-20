import type { Broker } from '../../data/types'
import { Heart, Phone, Share } from '../../icons'
import { Button } from '../Button/Button'
import { ContactForm, type ContactValues } from '../ContactForm/ContactForm'
import { DialogTrigger } from '../Dialog/Dialog'
import { IconButton } from '../IconButton/IconButton'
import { Link } from '../Link/Link'
import { BrokerIdentity } from '../Property/BrokerIdentity'
import styles from './ContactModule.module.css'

export interface ContactModuleProps {
  listingTitle: string
  company: string
  /** The listing's brokers, the lead first. */
  brokers: Broker[]
  /** The phone number to show and call, as written ("(469) 324-4030"). Defaults to the lead broker's. */
  phone?: string
  /** The "Contact" heading's level in the page outline (h3 on AcmeCo's detail page). */
  headingLevel?: 2 | 3 | 4
  saved?: boolean
  /** Shows the Save toggle. */
  onSaveChange?: (saved: boolean) => void
  onShare?: () => void
  /** Receives the contact form's values when they're valid. */
  onContactSubmit?: (values: ContactValues) => void | Promise<void>
}

/** "tel:" wants digits only: "(469) 324-4030" → "tel:+14693244030" (US numbers in the fixtures). */
const telHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`
}

/**
 * The contact box beside a listing (AcmeCo's property detail sidebar): call or message
 * the broker, see who they are, and share or save the listing. Message opens ContactForm.
 */
export function ContactModule({
  listingTitle, company, brokers, phone = brokers[0]?.phone, headingLevel = 3, saved = false, onSaveChange, onShare, onContactSubmit,
}: ContactModuleProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <aside className={styles.module} aria-label={`Contact about ${listingTitle}`}>
      <div className={styles.body}>
        {phone && (
          <p className={styles.phone}>
            <Phone className={styles.phoneIcon} aria-hidden="true" />
            <Link variant="subtle" href={telHref(phone)}>
              <span className="sr-only">Call </span>
              {phone}
            </Link>
          </p>
        )}
        <DialogTrigger>
          <Button size="lg" fullWidth>Message</Button>
          <ContactForm listingTitle={listingTitle} company={company} brokers={brokers} onSubmit={onContactSubmit} />
        </DialogTrigger>
        <Heading className={styles.heading}>Contact</Heading>
        <BrokerIdentity company={company} brokers={brokers} layout="sidebar" />
      </div>
      <div className={styles.actions}>
        <span className={styles.action}>
          <IconButton label={`Share ${listingTitle}`} icon={<Share />} onPress={onShare} />
        </span>
        {/* Save appears only when the page can save (a disabled button wouldn't say why). */}
        {onSaveChange && (
          <span className={styles.action}>
            <IconButton label={`Save ${listingTitle}`} icon={<Heart />} isSelected={saved} onChange={onSaveChange} />
          </span>
        )}
      </div>
    </aside>
  )
}
