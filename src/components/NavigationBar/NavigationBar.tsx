import { Link } from '../Link/Link'
import styles from './NavigationBar.module.css'

export interface NavigationLink {
  label: string
  href: string
  /** The page the reader is on: announced as the current page and underlined. */
  isCurrent?: boolean
}

export interface NavigationBarProps {
  /** The links, in order (AcmeCo's search links: For Lease, For Sale, Auctions, Businesses For Sale). */
  links: NavigationLink[]
  /** Names the navigation for screen readers ("Search"), so it can be told apart from others on the page. */
  label: string
  /** horizontal: a row (the header). vertical: a list of 40px rows (the phone menu). */
  orientation?: 'horizontal' | 'vertical'
}

/** A labelled row (or list) of navigation links. AcmeCo's header link row, reusable for other site navigation. */
export function NavigationBar({ links, label, orientation = 'horizontal' }: NavigationBarProps) {
  return (
    <nav aria-label={label} className={styles.nav}>
      <ul className={styles.list} data-orientation={orientation}>
        {links.map((l) => (
          <li key={l.href} className={styles.item}>
            <Link variant="subtle" href={l.href} isCurrent={l.isCurrent}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
