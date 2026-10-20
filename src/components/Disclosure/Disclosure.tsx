import type { ReactNode } from 'react'
import { Button, Disclosure as AriaDisclosure, DisclosurePanel, Heading } from 'react-aria-components'
import { ChevronDown } from '../../icons'
import styles from './Disclosure.module.css'

export interface DisclosureProps {
  /** The button's text: what the group holds ("Search"). */
  title: string
  children: ReactNode
  defaultExpanded?: boolean
  isExpanded?: boolean
  onExpandedChange?: (isExpanded: boolean) => void
  /** Wrap the button in a heading of this level, when the group is a section of the page (an accordion). Leave unset in menus. */
  headingLevel?: 2 | 3 | 4
}

/**
 * A button that shows or hides a group (the Search group in AcmeCo's menu). Screen
 * readers hear whether it's open; the chevron turns, so it isn't shown by colour.
 */
export function Disclosure({ title, children, defaultExpanded, isExpanded, onExpandedChange, headingLevel }: DisclosureProps) {
  const trigger = (
    <Button slot="trigger" className={styles.trigger}>
      <span>{title}</span>
      <ChevronDown className={styles.chevron} aria-hidden="true" />
    </Button>
  )
  return (
    <AriaDisclosure className={styles.disclosure} defaultExpanded={defaultExpanded} isExpanded={isExpanded} onExpandedChange={onExpandedChange}>
      {headingLevel ? <Heading level={headingLevel} className={styles.heading}>{trigger}</Heading> : trigger}
      <DisclosurePanel className={styles.panel}>{children}</DisclosurePanel>
    </AriaDisclosure>
  )
}
