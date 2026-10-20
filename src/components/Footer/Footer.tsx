import { Link } from '../Link/Link'
import styles from './Footer.module.css'
import { ds } from '../ds'

export interface FooterLink {
  label: string
  href: string
  /** Opens in a new tab (AcmeCo's Marketplace sites), with an icon and "(opens in a new tab)" for screen readers. */
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterSocialLink {
  /** The network ("LinkedIn"): the link is named "AcmeCo on LinkedIn". */
  name: string
  /** The neutral placeholder letters in the circle ("in"): not the network's logo. */
  mark: string
  href: string
}

export interface FooterProps {
  /** AcmeCo's five columns: Search, Products & Services, Marketplace, Resources, Company. */
  columns: FooterColumn[]
  social: FooterSocialLink[]
  /** The app-store links, as text ("Download on the App Store"). */
  apps: FooterLink[]
  /** An optional paragraph (the search pages' disclaimer). */
  disclaimer?: string
  /** The columns' heading level in the page outline (h2 by default). */
  headingLevel?: 2 | 3
  /** The copyright line (placeholder wording by default, decision 35, F). */
  copyright?: string
  /** On phones (below 768px), AcmeCo's single list of links, with lines between them, in place of the columns (decision 51). */
  phoneLinks?: FooterLink[]
}

/**
 * AcmeCo's site footer, on every page after `main`: five columns of links, then the
 * mark, "Connect with us", the social links, the copyright and the app links. A real
 * footer landmark; on phones the columns reflow so nothing goes off screen.
 */
export function Footer({
  columns, social, apps, disclaimer, headingLevel = 2, copyright = '© 2026 · Prototype · AcmeCo is a fictional brand', phoneLinks,
}: FooterProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <footer className={styles.footer} {...ds({ set: 'Footer', props: { Width: 'Desktop' } })}>
      <div className={styles.inner}>
        <div className={styles.columns} data-phone-links={phoneLinks ? '' : undefined}>
          {columns.map((c) => (
            // A heading and a list (not a landmark region each: five would crowd the page's landmarks).
            <div key={c.title} className={styles.column}>
              <Heading className={styles.heading}>{c.title}</Heading>
              <ul className={styles.links}>
                {c.links.map((l) => (
                  <li key={l.href}><Link variant="subtle" href={l.href} external={l.external}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {phoneLinks && (
          // Phones only: one list, as AcmeCo's phone footer (the columns above are hidden there).
          <ul className={styles.phoneLinks}>
            {phoneLinks.map((l) => (
              <li key={l.href}><Link variant="subtle" href={l.href} external={l.external}>{l.label}</Link></li>
            ))}
          </ul>
        )}
        <div className={styles.brand}>
          {/* A neutral placeholder: AcmeCo's logo stays out of the prototype (decision 35). */}
          <p className={styles.logo}>
            <span className={styles.mark} aria-hidden="true">AC</span>
            <span className={styles.name}>AcmeCo</span>
          </p>
          {disclaimer && <p className={`${styles.text} ${styles.disclaimer}`}>{disclaimer}</p>}
          <p className={styles.text} id="footer-connect">Connect with us</p>
          <ul className={styles.social} aria-labelledby="footer-connect">
            {social.map((s) => (
              <li key={s.name}>
                <Link variant="subtle" href={s.href} external>
                  <span className={styles.socialMark} aria-hidden="true">{s.mark}</span>
                  <span className="sr-only">AcmeCo on {s.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.text}>{copyright}</p>
          <ul className={styles.apps}>
            {apps.map((a) => (
              <li key={a.href}><Link variant="subtle" href={a.href} external={a.external}>{a.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
