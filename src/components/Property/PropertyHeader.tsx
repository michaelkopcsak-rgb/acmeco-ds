import { Link } from '../Link/Link'
import styles from './Property.module.css'

export interface PropertyHeaderProps {
  title: string
  /** The listing's page. The title is the card's one link. */
  href: string
  address: string
  /** "8,024 SF Available". Not shown in the compact layout, where size is one of the facts. */
  sizeText?: string
  /** "Denver, CO 80216" */
  location: string
  /** The title's heading level in the page outline (h3 in a results list under an h2). */
  headingLevel?: 2 | 3 | 4
  /** Stretch the title link over the nearest positioned ancestor, making a whole card clickable (decision 27). */
  stretchLink?: boolean
  /** `row`: title + address | size + city (tiers 1 and 2). `compact`: title, address, city in one column (tier 3). */
  layout?: 'row' | 'compact'
  /** An id for the heading, so a card can be named by its title. */
  id?: string
}

/** AcmeCo's header row: title and street address on the left; size and city on the right. Stacks on narrow cards. */
export function PropertyHeader({ title, href, address, sizeText, location, headingLevel = 3, stretchLink, layout = 'row', id }: PropertyHeaderProps) {
  const Heading = `h${headingLevel}` as const
  const heading = (
    <Heading id={id} className={stretchLink ? `${styles.title} ${styles.stretch}` : styles.title}>
      <Link variant="subtle" href={href}>{title}</Link>
    </Heading>
  )
  if (layout === 'compact') {
    return (
      <div className={styles.header}>
        <div className={styles.headerStart}>
          {heading}
          <p className={styles.headerLine}>{address}</p>
          <p className={styles.headerLine}>{location}</p>
        </div>
      </div>
    )
  }
  return (
    // The wrapper is a size container, so the header can stack when the card is narrow.
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        <div className={styles.headerStart}>
          {heading}
          <p className={styles.headerLine}>{address}</p>
        </div>
        <div className={styles.headerEnd}>
          {sizeText && <p className={styles.headerLine}>{sizeText}</p>}
          <p className={styles.headerLine}>{location}</p>
        </div>
      </div>
    </div>
  )
}
