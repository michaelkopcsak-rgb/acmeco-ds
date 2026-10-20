import type { ReactNode } from 'react'
import { Link as AriaLink, type PressEvent } from 'react-aria-components'
import { ExternalLink } from '../../icons'
import styles from './Link.module.css'
import { ds, iconName, plain } from '../ds'

export type LinkVariant = 'inline' | 'standalone' | 'subtle' | 'inverse'

export interface LinkProps {
  /** The link text: say where it goes ("View all office listings"), never "click here". */
  children: ReactNode
  href: string
  /**
   * inline: inside body text, always underlined. standalone: on its own, underlined on hover.
   * subtle: ink text for card titles and navigation, underlined on hover. inverse: white, on dark surfaces.
   */
  variant?: LinkVariant
  /** Opens in a new tab, with an icon and "(opens in a new tab)" for screen readers. */
  external?: boolean
  /** The page the reader is on (a navigation link): announced as "current page" and underlined, not shown by colour alone. */
  isCurrent?: boolean
  /** An icon before the text, sized to it (a view switch: "Map" with a map, "Gallery" with a grid). Decorative: the text names the link. */
  icon?: ReactNode
  onPress?: (event: PressEvent) => void
}

export function Link({ children, href, variant = 'inline', external = false, isCurrent = false, icon, onPress }: LinkProps) {
  return (
    <AriaLink
      {...ds({ set: 'Link', props: { Variant: variant, Context: 'body', State: 'Default' }, ...(plain(children) ? { text: { Label: plain(children)! } } : {}), ...(iconName(icon) ? { before: iconName(icon) } : {}) })}
      className={`${styles.link} ${styles[variant]}`}
      href={href}
      onPress={onPress}
      {...(isCurrent ? { 'aria-current': 'page' as const } : {})}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {icon && <span className={styles.startIcon} aria-hidden="true">{icon}</span>}
      {children}
      {external && (
        <>
          <ExternalLink className={styles.externalIcon} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </AriaLink>
  )
}
