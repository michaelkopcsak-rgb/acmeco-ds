import type { ReactElement, ReactNode } from 'react'
import { Button as AriaButton, type PressEvent } from 'react-aria-components'
import { ChevronDown, Close } from '../../icons'
import { Popover } from '../Popover/Popover'
import styles from './FilterButton.module.css'
import { ds, plain } from '../ds'

export interface FilterButtonProps {
  /** The filter's name ("Rent"), or what it's set to ("$20–$40 /SF/YR"). Also its accessible name. */
  children: ReactNode
  /** An icon before the label (All Filters' sliders), from the registry. Hidden from screen readers. */
  icon?: ReactNode
  /** How many filters are set (All Filters): a blue count, read as "2 applied". */
  count?: number
  /** Shows a chevron: pressing opens a panel (the default). False for a pill that acts directly. */
  hasMenu?: boolean
  /** The filter is set: dark border on light grey, as AcmeCo's. */
  isActive?: boolean
  /** Shows only the icon in a round button (the phone's filter button); the label stays its accessible name. */
  iconOnly?: boolean
  onPress?: (event: PressEvent) => void
}

/**
 * AcmeCo's search-bar pill: a filter's name (or its value once set), an optional icon and
 * count, and a chevron when it opens a panel. Same height, shape and type as the compact
 * Select, so the bar is one family. Use FilterMenu for a pill that opens a panel of choices.
 */
export function FilterButton({ children, icon, count, hasMenu = true, isActive, iconOnly, onPress }: FilterButtonProps) {
  return (
    <AriaButton
      className={iconOnly ? `${styles.button} ${styles.iconOnly}` : styles.button}
      data-active={isActive || undefined}
      onPress={onPress}
      {...ds({
        set: 'Filter button',
        props: { Kind: iconOnly ? 'Icon only' : count != null ? 'All filters' : 'Menu', State: 'Default' },
        layers: { ...(plain(children) ? { Label: plain(children)! } : {}), ...(count ? { 'Count value': String(count) } : {}) },
      })}
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span className={iconOnly ? 'sr-only' : undefined}>{children}</span>
      {count ? (
        <>
          <span className={styles.count} aria-hidden="true">{count}</span>
          <span className="sr-only">, {count} applied</span>
        </>
      ) : null}
      {hasMenu && <ChevronDown className={styles.chevron} aria-hidden="true" />}
    </AriaButton>
  )
}

export interface FilterMenuProps {
  /** The filter's name ("Space Use"): the pill's text until it's set, and the panel's name. */
  label: string
  /** What it's set to, in a few words ("Office, Coworking"): shown instead of the label, with a clear button. */
  value?: string
  /** Clears the filter (the x in the pill). Without it a set pill shows its chevron instead. */
  onClear?: () => void
  /** The panel: checkboxes, a range, and so on. A function receives `close`. */
  children: ReactNode | ((close: () => void) => ReactNode)
  placement?: 'bottom start' | 'bottom end'
}

/**
 * A FilterButton that opens a panel of choices (a Popover) and, once set, shows its value
 * and clears in place ("Office, Coworking ✕"), as on AcmeCo's search bar.
 */
export function FilterMenu({ label, value, onClear, children, placement = 'bottom start' }: FilterMenuProps): ReactElement {
  const clearable = !!value && !!onClear
  return (
    <span className={styles.menu} data-clearable={clearable || undefined} {...(clearable ? ds({ set: 'Filter button', props: { Kind: 'Set', State: 'Default' }, layers: { Label: value! } }) : {})}>
      <Popover label={label} placement={placement} trigger={<FilterButton isActive={!!value} hasMenu={!clearable}>{value ?? label}</FilterButton>}>
        {(close) => <div className={styles.panel}>{typeof children === 'function' ? children(close) : children}</div>}
      </Popover>
      {clearable && (
        <AriaButton className={styles.clear} aria-label={`Clear ${label}`} onPress={onClear}>
          <Close aria-hidden="true" />
        </AriaButton>
      )}
    </span>
  )
}
