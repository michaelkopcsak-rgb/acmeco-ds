import { useId, type ReactNode } from 'react'
import { Heading, type HeadingLevel } from '../Heading/Heading'
import styles from './Card.module.css'

export interface CardProps {
  /** What the card holds: text, a FactList, a photo. */
  children: ReactNode
  /** outline: AcmeCo's light grey edge (the property page's boxes). raised: the edge and the card shadow (the broker page's panels). */
  appearance?: 'outline' | 'raised'
  /** A heading at the top. The card becomes a section named by it. */
  heading?: string
  /** The heading's level in the page's outline (default 2). It looks the same at every level. */
  headingLevel?: HeadingLevel
  /** Buttons or links at the bottom ("Details"). */
  actions?: ReactNode
}

/**
 * A surface that groups related content: AcmeCo's grey-edged panels. With a heading it's a
 * section named by that heading, so screen readers can list it; without one it's a plain box.
 * Padding, edge, radius and shadow come from tokens; the content sets the height.
 */
export function Card({ children, appearance = 'outline', heading, headingLevel = 2, actions }: CardProps) {
  const id = useId()
  const Root = heading ? 'section' : 'div'
  return (
    <Root className={styles.card} data-appearance={appearance} aria-labelledby={heading ? id : undefined}>
      {heading && <Heading level={headingLevel} size="heading-3" id={id}>{heading}</Heading>}
      <div className={styles.body}>{children}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </Root>
  )
}
