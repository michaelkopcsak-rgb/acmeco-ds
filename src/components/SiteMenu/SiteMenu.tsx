import { useRef, useState } from 'react'
import { Menu } from '../../icons'
import { Disclosure } from '../Disclosure/Disclosure'
import { IconButton } from '../IconButton/IconButton'
import { Link } from '../Link/Link'
import { Popover } from '../Popover/Popover'
import { SignInDialog, type SignInSlide } from '../SignInDialog/SignInDialog'
import styles from './SiteMenu.module.css'

export interface SiteMenuLink {
  label: string
  href: string
  /** Opens in a new window (Marketing Center), with an icon and "(opens in a new tab)" for screen readers. */
  external?: boolean
}

export interface SiteMenuProps {
  /** Links after "Log In/Sign Up" (Explore Marketing Solutions, Advertise, Marketing Center). */
  linksBefore: SiteMenuLink[]
  /** The Search group's links (For Lease, For Sale, Auctions, Businesses, Find a Broker). */
  searchLinks: SiteMenuLink[]
  /** Links after the Search group (Preferences, Help Center). */
  linksAfter: SiteMenuLink[]
  /** The sign-in dialog's promo slides ("Log In/Sign Up" opens it). */
  signInSlides: SignInSlide[]
  onSignInContinue?: (email: string) => void | Promise<void>
  onSignInProvider?: (provider: string) => void
}

/**
 * AcmeCo's header menu: a Menu button that opens a 280px panel of links, with
 * "Log In/Sign Up" first and a Search group that opens in place, in four groups with lines between.
 */
export function SiteMenu({ linksBefore, searchLinks, linksAfter, signInSlides, onSignInContinue, onSignInProvider }: SiteMenuProps) {
  const [signingIn, setSigningIn] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const item = (l: SiteMenuLink) => (
    <li key={l.href} className={styles.item}>
      <Link variant="subtle" href={l.href} external={l.external}>{l.label}</Link>
    </li>
  )
  return (
    <span ref={root} className={styles.root}>
      <Popover label="Menu" trigger={<IconButton label="Menu" icon={<Menu />} />} placement="bottom end">
        {(close) => (
          <nav aria-label="Site" className={styles.menu}>
            {/* Four groups, a line between each, as on AcmeCo. */}
            <ul className={styles.group}>
              <li className={`${styles.item} ${styles.login}`}>
                {/* A link, as on AcmeCo; it opens the sign-in dialog in place. */}
                <Link variant="subtle" href="#sign-in" onPress={() => { close(); setSigningIn(true) }}>Log In/Sign Up</Link>
              </li>
            </ul>
            <ul className={styles.group}>{linksBefore.map(item)}</ul>
            <div className={`${styles.group} ${styles.search}`}>
              <Disclosure title="Search">
                <ul className={styles.list}>
                  {searchLinks.map((l) => (
                    <li key={l.href} className={`${styles.item} ${styles.subItem}`}>
                      <Link variant="subtle" href={l.href} external={l.external}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </Disclosure>
            </div>
            <ul className={styles.group}>{linksAfter.map(item)}</ul>
          </nav>
        )}
      </Popover>
      <SignInDialog
        slides={signInSlides}
        onContinue={onSignInContinue}
        onProvider={onSignInProvider}
        isOpen={signingIn}
        onOpenChange={(open) => {
          setSigningIn(open)
          // The link that opened it has gone with the menu: return focus to the Menu button.
          if (!open) root.current?.querySelector<HTMLButtonElement>('button')?.focus()
        }}
      />
    </span>
  )
}
