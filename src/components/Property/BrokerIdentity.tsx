import type { Broker } from '../../data/types'
import styles from './Property.module.css'

export interface BrokerIdentityProps {
  /** The listing company; shown as its logo. */
  company: string
  /** One to three brokers (AcmeCo's contact-count). Empty for tier 3, which shows the logo only. */
  brokers: Broker[]
  /**
   * `visible`, or `hidden` to show only the photos (AcmeCo's tier 2 with several brokers).
   * Hidden names are still read by screen readers.
   */
  names?: 'visible' | 'hidden'
  /**
   * `row`: logo and brokers side by side. `stacked`: the logo above the brokers (narrow columns).
   * `sidebar`: brokers in a column with large (80px) photos, then the logo, as in AcmeCo's contact box.
   */
  layout?: 'row' | 'stacked' | 'sidebar'
}

/**
 * The listing company's logo and up to three brokers. In this prototype the logo
 * is a neutral placeholder mark with the company's name, and brokers show
 * initials instead of photos: no real companies or people.
 */
export function BrokerIdentity({ company, brokers, names = 'visible', layout = 'row' }: BrokerIdentityProps) {
  const logo = <span className={styles.logo}>{company}</span>
  return (
    <div className={layout === 'row' ? styles.broker : `${styles.broker} ${styles[`broker-${layout}`]}`}>
      {/* A logo image would carry the company name as its alt text; the placeholder shows it as text. */}
      {layout !== 'sidebar' && logo}
      {brokers.length > 0 && (
        <ul className={styles.brokerList} aria-label="Listing brokers">
          {brokers.slice(0, 3).map((broker) => (
            <li key={broker.id} className={styles.brokerItem}>
              <span className={styles.avatar} aria-hidden="true">{broker.initials}</span>
              <span className={names === 'hidden' ? 'sr-only' : styles.brokerName}>{broker.name}</span>
            </li>
          ))}
        </ul>
      )}
      {layout === 'sidebar' && logo}
    </div>
  )
}
